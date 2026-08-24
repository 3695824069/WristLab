import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { plans } from '../data/plans'
import { Flame, CheckCircle, Circle, Target } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { checkin, getWorkoutHistory } from '../lib/api'
import type { ExerciseInputV2 } from '../lib/api'
import { toast } from 'sonner'

interface ExerciseDetailInput {
  sets: string
  reps: string
  weight: string
  rpe: string
}

interface ParsedExerciseValues {
  sets: number | null
  reps: number | null
  weight: number | null
  rpe: number | null
}

/** Parse raw string inputs into numbers (empty → null). */
function parseExerciseInput(detail: ExerciseDetailInput): ParsedExerciseValues {
  return {
    sets: detail.sets.trim() ? parseInt(detail.sets, 10) : null,
    reps: detail.reps.trim() ? parseInt(detail.reps, 10) : null,
    weight: detail.weight.trim() ? parseFloat(detail.weight) : null,
    rpe: detail.rpe.trim() ? parseInt(detail.rpe, 10) : null,
  }
}

/** Validate parsed values. Returns an error message, or null if valid. */
function validateExerciseInput(key: string, values: ParsedExerciseValues): string | null {
  if (values.sets != null && (isNaN(values.sets) || values.sets < 1)) return `「${key}」组数必须 ≥ 1`
  if (values.reps != null && (isNaN(values.reps) || values.reps < 1)) return `「${key}」次数必须 ≥ 1`
  if (values.weight != null && (isNaN(values.weight) || values.weight < 0)) return `「${key}」重量不能为负数`
  if (values.rpe != null && (isNaN(values.rpe) || values.rpe < 1 || values.rpe > 10)) return `「${key}」RPE 必须在 1-10 之间`
  return null
}

export default function PlanDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const plan = plans.find(p => p.id === id)
  const { user } = useAuth()
  const [checking, setChecking] = useState(false)
  const [checked, setChecked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uniqueDays, setUniqueDays] = useState(0)
  const dayRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const [checkedExercises, setCheckedExercises] = useState<Set<string>>(new Set())
  const [exerciseDetails, setExerciseDetails] = useState<Record<string, ExerciseDetailInput>>({})
  const [notes, setNotes] = useState('')
  const { t } = useTranslation()

  const highlightDay = searchParams.get('day') ? parseInt(searchParams.get('day')!) : null

  // Load progress from workout history
  const loadProgress = useCallback(() => {
    if (!user || !plan) return
    getWorkoutHistory(365).then(res => {
      const records: { record_date: string; plan_id: string }[] = res.data?.records || []
      // Check if today is checked in
      const todayStr = new Date().toISOString().split('T')[0]
      setChecked(records.some(r => r.record_date === todayStr))
      // Calculate plan progress
      const planRecords = records.filter(r => r.plan_id === plan.id)
      const days = new Set(planRecords.map(r => r.record_date)).size
      setUniqueDays(days)
      setProgress(Math.min(Math.round((days / plan.days.length) * 100), 100))
    }).catch(() => {})
  }, [user, plan])

  useEffect(() => { loadProgress() }, [loadProgress])

  // Auto-scroll to highlighted day
  useEffect(() => {
    if (highlightDay && dayRefs.current[highlightDay]) {
      setTimeout(() => {
        dayRefs.current[highlightDay]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [highlightDay])

  // Toggle exercise checkbox
  const toggleExercise = (key: string) => {
    setCheckedExercises(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
        // Initialize empty detail fields on check
        setExerciseDetails(existing => {
          if (existing[key]) return existing
          return { ...existing, [key]: { sets: '', reps: '', weight: '', rpe: '' } }
        })
      }
      return next
    })
  }

  // Update exercise detail field
  const updateExerciseDetail = (key: string, field: keyof ExerciseDetailInput, value: string) => {
    setExerciseDetails(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  // Collect completed exercises for the API (V2 format)
  const getCompletedExercises = (): ExerciseInputV2[] => {
    if (!plan) return []
    const result: ExerciseInputV2[] = []
    for (const day of plan.days) {
      for (let i = 0; i < day.exercises.length; i++) {
        const key = `${day.day}-${i}`
        if (checkedExercises.has(key)) {
          const ex = day.exercises[i]
          const detail = exerciseDetails[key]
          const entry: ExerciseInputV2 = {
            exerciseId: ex.exerciseId,
            displayText: ex.displayText,
          }
          if (detail) {
            const values = parseExerciseInput(detail)
            if (values.sets != null && !isNaN(values.sets)) entry.sets = values.sets
            if (values.reps != null && !isNaN(values.reps)) entry.reps = values.reps
            if (values.weight != null && !isNaN(values.weight)) entry.weight = values.weight
            if (values.rpe != null && !isNaN(values.rpe)) entry.rpe = values.rpe
          }
          result.push(entry)
        }
      }
    }
    return result
  }

  const handleCheckin = async () => {
    if (!user) {
      toast.error(t('plans.needLogin'))
      return
    }

    // Validate V2 inputs if any details were filled
    const detailsToValidate = Object.keys(exerciseDetails).filter(k => checkedExercises.has(k))
    for (const key of detailsToValidate) {
      const detail = exerciseDetails[key]
      // Only validate if at least one field has a value
      if (detail.sets.trim() || detail.reps.trim() || detail.weight.trim() || detail.rpe.trim()) {
        const error = validateExerciseInput(key, parseExerciseInput(detail))
        if (error) {
          toast.error(error)
          return
        }
      }
    }

    setChecking(true)
    try {
      const completedExercises = getCompletedExercises()
      await checkin(plan!.id, completedExercises, { notes: notes.trim() || undefined })
      setChecked(true)
      loadProgress()
      const count = completedExercises.length
      if (count > 0) {
        toast.success(t('plans.checkinSuccessCount', { count }))
      } else {
        toast.success(t('plans.checkinSuccess'))
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'ALREADY_CHECKED_IN') {
        setChecked(true)
        toast.info(t('plans.checkinDupe'))
      } else {
        toast.error(err instanceof Error ? err.message : String(err) || t('plans.checkinFail'))
      }
    } finally {
      setChecking(false)
    }
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('plans.notFound')}</h2>
          <Link to="/plans" className="text-green-400 hover:text-green-300">
            {t('plans.backToList')} →
          </Link>
        </div>
      </div>
    )
  }

  const is7Day = plan.type === '7day'
  const is21Day = plan.type === '21day'

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Back */}
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <Link to="/plans" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-green-400 transition-colors">
          {t('plans.backToList')}
        </Link>
      </div>

      {/* Header */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-4 ${
          is7Day
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : is21Day
            ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
        }`}>
          <Flame className="h-3 w-3" />
          {is7Day ? t('plans.plan7day') : is21Day ? t('plans.plan21day') : t('plans.plan30day')}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{plan.title}</h1>
        <p className="text-zinc-400 mb-4">{plan.description}</p>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${is7Day ? 'bg-green-500' : is21Day ? 'bg-violet-500' : 'bg-orange-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          {progress > 0
            ? t('plans.progress', { progress, done: uniqueDays, total: plan.days.length })
            : t('plans.progressHint')}
        </p>

        {/* Recommended training banner */}
        {highlightDay && !checked && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-2.5 text-sm text-green-400">
            <Target className="h-4 w-4" />
            <span>{t('plans.instruction')}</span>
          </div>
        )}

        {/* Check-in button */}
        <button
          onClick={handleCheckin}
          disabled={checking || checked}
          className={`mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-sm transition-all ${
            checked
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
              : 'bg-green-500 text-black hover:bg-green-400 active:scale-[0.98]'
          }`}
        >
          <CheckCircle className={`h-5 w-5 ${checked ? 'text-green-400' : ''}`} />
          {checking ? t('plans.checkingIn') : checked ? t('plans.checkedIn') : t('plans.completeTraining')}
        </button>
        {!checked && getCompletedExercises().length > 0 && (
          <p className="text-xs text-zinc-500 mt-2">
            {t('plans.selectedCount', { count: getCompletedExercises().length })}
          </p>
        )}

        {/* Notes input */}
        {!checked && (
          <div className="mt-4">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="训练备注（可选） — 今天状态怎么样？"
              rows={2}
              className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none resize-none"
            />
          </div>
        )}
      </section>

      {/* Days */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <h2 className="text-xl font-bold mb-6">{t('plans.dailySchedule')}</h2>

        <div className="space-y-4">
          {plan.days.map(day => (
            <div
              key={day.day}
              ref={el => { dayRefs.current[day.day] = el }}
              className={`rounded-xl border p-5 transition-all duration-300 ${
                highlightDay === day.day
                  ? 'border-green-500/60 bg-green-500/10 shadow-lg shadow-green-500/5'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
              }`}
            >
              {/* Day header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  is7Day ? 'bg-green-500/20 text-green-400' : is21Day ? 'bg-violet-500/20 text-violet-400' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {day.day}
                </div>
                <h3 className="font-semibold text-white">{day.title}</h3>
                {highlightDay === day.day && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400">
                    <Target className="h-3 w-3" />
                    {t('plans.todayRecommended')}
                  </span>
                )}
                <span className="ml-auto text-xs text-zinc-500">
                  {t('plans.exercisesCount', { count: day.exercises.length })}
                </span>
              </div>

              {/* Exercise list */}
              <div className="ml-11 space-y-2 mb-3">
                {day.exercises.map((ex, i) => {
                  const key = `${day.day}-${i}`
                  const isChecked = checkedExercises.has(key)
                  const detail = exerciseDetails[key]
                  return (
                    <div key={i}>
                      {/* Exercise row (clickable) */}
                      <div
                        className={`flex items-center gap-2 text-sm cursor-pointer select-none transition-colors ${
                          isChecked ? 'text-green-300' : 'text-zinc-300 hover:text-zinc-200'
                        }`}
                        onClick={() => toggleExercise(key)}
                      >
                        {isChecked ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0 hover:text-zinc-400" />
                        )}
                        <span className={isChecked ? 'line-through opacity-70' : ''}>{ex.displayText}</span>
                      </div>

                      {/* V2 input fields — only when checked */}
                      {isChecked && (
                        <div className="mt-2 ml-7 grid grid-cols-4 gap-2">
                          <div>
                            <label className="block text-[10px] text-zinc-600 mb-0.5">{t('plans.sets')}</label>
                            <input
                              type="number"
                              min="1"
                              placeholder="-"
                              value={detail?.sets ?? ''}
                              onChange={e => updateExerciseDetail(key, 'sets', e.target.value)}
                              onClick={e => e.stopPropagation()}
                              className="w-full rounded border border-zinc-700 bg-zinc-800/80 px-2 py-1 text-xs text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-600 mb-0.5">{t('plans.reps')}</label>
                            <input
                              type="number"
                              min="1"
                              placeholder="-"
                              value={detail?.reps ?? ''}
                              onChange={e => updateExerciseDetail(key, 'reps', e.target.value)}
                              onClick={e => e.stopPropagation()}
                              className="w-full rounded border border-zinc-700 bg-zinc-800/80 px-2 py-1 text-xs text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-600 mb-0.5">{t('plans.weight')}</label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              placeholder="-"
                              value={detail?.weight ?? ''}
                              onChange={e => updateExerciseDetail(key, 'weight', e.target.value)}
                              onClick={e => e.stopPropagation()}
                              className="w-full rounded border border-zinc-700 bg-zinc-800/80 px-2 py-1 text-xs text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-600 mb-0.5">RPE</label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              placeholder="-"
                              value={detail?.rpe ?? ''}
                              onChange={e => updateExerciseDetail(key, 'rpe', e.target.value)}
                              onClick={e => e.stopPropagation()}
                              className="w-full rounded border border-zinc-700 bg-zinc-800/80 px-2 py-1 text-xs text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Notes */}
              {day.notes && (
                <div className="ml-11 rounded-lg bg-zinc-800/50 p-3 text-xs text-zinc-500">
                  💡 {day.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
