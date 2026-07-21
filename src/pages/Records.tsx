import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Flame, Trophy, Calendar, ArrowRight, CheckCircle, TrendingUp, BarChart3, ChevronRight, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getWorkoutHistory, getWorkoutStats } from '../lib/api'
import { plans } from '../data/plans'

interface WorkoutRecord {
  id: number
  plan_id: string
  record_date: string
  created_at: string
}

interface WorkoutStats {
  total: number
  weekCount: number
  streak: number
  checkedToday: boolean
}


export default function Records() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const WEEKDAYS = [t('records.sun'), t('records.mon'), t('records.tue'), t('records.wed'), t('records.thu'), t('records.fri'), t('records.sat')]
  const [records, setRecords] = useState<WorkoutRecord[]>([])
  const [stats, setStats] = useState<WorkoutStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  useEffect(() => {
    if (!user) { setLoading(false); return }
    Promise.all([
      getWorkoutHistory(365),
      getWorkoutStats(),
    ]).then(([histRes, statsRes]) => {
      setRecords(histRes.data?.records || [])
      setStats(statsRes.data?.stats || null)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t('records.loginRequired')}</h2>
          <p className="text-zinc-400 mb-4">{t('records.loginHint')}</p>
          <Link to="/login" className="text-green-400 hover:text-green-300">
            {t('records.goLogin')}
          </Link>
        </div>
      </div>
    )
  }

  // Build checked date set
  const checkedDates = new Set(records.map(r => r.record_date))

  // Build monthly stats
  const monthlyStats = (() => {
    const byMonth: Record<string, number> = {}
    for (const r of records) {
      const key = r.record_date.substring(0, 7) // YYYY-MM
      byMonth[key] = (byMonth[key] || 0) + 1
    }
    return Object.entries(byMonth)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6)
  })()

  // Build calendar heatmap data (last 90 days)
  const calendarDays = (() => {
    const today = new Date()
    const days: { date: string; checked: boolean; dayOfWeek: number }[] = []
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      days.push({
        date: dateStr,
        checked: checkedDates.has(dateStr),
        dayOfWeek: d.getDay(),
      })
    }
    return days
  })()

  // Group calendar by weeks
  const calendarWeeks: typeof calendarDays[] = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarWeeks.push(calendarDays.slice(i, i + 7))
  }

  // Get plan title helper
  const getPlanTitle = (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    return plan ? plan.title : t('records.defaultPlanTitle')
  }

  // Recent records (last 50)
  const recentRecords = records.slice(0, 50)

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white px-4 py-12">
        <div className="mx-auto max-w-4xl animate-pulse space-y-6">
          <div className="h-8 w-40 bg-zinc-800 rounded" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-zinc-800 rounded-xl" />)}
          </div>
          <div className="h-64 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <section className="border-b border-zinc-800 bg-zinc-900/50 py-10 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-1">
            <Activity className="h-6 w-6 text-green-400" />
            <h1 className="text-3xl font-bold">{t('records.title')}</h1>
          </div>
          <p className="text-zinc-400 text-sm mt-1">{t('records.description')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* ─── Stats Grid ─── */}
        {stats && (
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-zinc-900 p-4 text-center">
                <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-zinc-500 mt-1">{t('records.totalTraining')}</p>
              </div>
              <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-zinc-900 p-4 text-center">
                <Flame className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.streak}</p>
                <p className="text-xs text-zinc-500 mt-1">{t('records.streak')}</p>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-zinc-900 p-4 text-center">
                <Calendar className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.weekCount}</p>
                <p className="text-xs text-zinc-500 mt-1">{t('records.weeklyTraining')}</p>
              </div>
              <div className={`rounded-xl border p-4 text-center ${
                stats.checkedToday
                  ? 'border-green-500/20 bg-gradient-to-br from-green-500/10 to-zinc-900'
                  : 'border-zinc-800 bg-zinc-900/60'
              }`}>
                <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${stats.checkedToday ? 'text-green-400' : 'text-zinc-600'}`} />
                <p className={`text-3xl font-bold ${stats.checkedToday ? 'text-green-400' : 'text-zinc-500'}`}>
                  {stats.checkedToday ? t('records.checked') : t('records.notChecked')}
                </p>
                <p className="text-xs text-zinc-500 mt-1">{t('records.todayStatus')}</p>
              </div>
            </div>
          </section>
        )}

        {/* ─── Monthly Chart ─── */}
        {monthlyStats.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              {t('records.monthlyChart')}
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
              <div className="flex items-end gap-3 sm:gap-5 h-40">
                {monthlyStats.map(([key, count]) => {
                  const maxCount = Math.max(...monthlyStats.map(([, c]) => c))
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                  const [year, month] = key.split('-')
                  return (
                    <div key={key} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                      <span className="text-xs text-zinc-500">{count}</span>
                      <div className="w-full rounded-md bg-green-500/20 relative" style={{ height: '160px' }}>
                        <div
                          className="absolute bottom-0 left-0 right-0 rounded-md bg-gradient-to-t from-green-500 to-green-400 transition-all duration-500"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-600">
                        {t('records.month', { n: parseInt(month) })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ─── Calendar Heatmap ─── */}
        {records.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-400" />
              {t('records.calendarTitle')}
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 overflow-x-auto">
              <div className="flex gap-1.5 min-w-fit">
                {/* Weekday labels */}
                <div className="flex flex-col gap-1 mr-1">
                  {WEEKDAYS.map((d, i) => (
                    <div key={i} className="w-4 h-4 flex items-center justify-center text-[9px] text-zinc-600">
                      {i % 2 === 0 ? d : ''}
                    </div>
                  ))}
                </div>
                {/* Calendar grid */}
                {calendarWeeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((day, di) => (
                      <div
                        key={di}
                        title={day.date}
                        className={`w-4 h-4 rounded-sm transition-colors ${
                          day.checked
                            ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.3)]'
                            : 'bg-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-600">
                <span>{t('records.legendLess')}</span>
                <div className="w-3 h-3 rounded-sm bg-zinc-800" />
                <div className="w-3 h-3 rounded-sm bg-green-500/40" />
                <div className="w-3 h-3 rounded-sm bg-green-500/60" />
                <div className="w-3 h-3 rounded-sm bg-green-500" />
                <span>{t('records.legendMore')}</span>
              </div>
            </div>
          </section>
        )}

        {/* ─── History List ─── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              {t('records.historyTitle')}
            </h2>
            <span className="text-xs text-zinc-500">{t('records.listView')}</span>
          </div>

          {recentRecords.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-10 text-center">
              <Activity className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400 font-medium">{t('records.noRecords')}</p>
              <p className="text-sm text-zinc-600 mt-1">{t('records.noRecordsHint')}</p>
              <Link
                to="/plans"
                className="inline-block mt-4 rounded-lg bg-green-500 px-5 py-2 text-sm font-semibold text-black hover:bg-green-400 transition-colors"
              >
                {t('records.startTraining')}
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentRecords.map((record, index) => {
                const date = new Date(record.record_date + 'T00:00:00')
                const dayOfWeek = WEEKDAYS[date.getDay()]
                const isToday = record.record_date === new Date().toISOString().split('T')[0]
                const planTitle = getPlanTitle(record.plan_id)

                return (
                  <div
                    key={record.id || index}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                      isToday
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    {/* Date */}
                    <div className="w-12 flex-shrink-0 text-center">
                      <div className={`text-lg font-bold leading-none ${isToday ? 'text-green-400' : 'text-white'}`}>
                        {date.getDate()}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isToday ? 'text-green-400/70' : 'text-zinc-600'}`}>
                        {date.getMonth() + 1}/{dayOfWeek}
                      </div>
                    </div>

                    {/* Dot separator */}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isToday ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]' : 'bg-zinc-700'}`} />

                    {/* Plan info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {planTitle}
                        </span>
                        {isToday && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-medium flex-shrink-0">
                            {t('records.today')}
                          </span>
                        )}
                      </div>
                      {record.plan_id && (
                        <Link
                          to={`/plans/${record.plan_id}`}
                          className="text-[11px] text-green-400/60 hover:text-green-400 transition-colors inline-flex items-center gap-0.5"
                        >
                          {t('records.viewPlan')}
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>

                    {/* Arrow */}
                    <ArrowRight className={`h-4 w-4 flex-shrink-0 ${isToday ? 'text-green-500' : 'text-zinc-700'}`} />
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ─── Empty CTA ─── */}
        {records.length > 0 && (
          <section className="pb-8 text-center">
            <Link
              to="/plans"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm text-zinc-400 hover:text-white hover:border-green-500/40 transition-all"
            >
              <Flame className="h-4 w-4" />
              {t('records.continueTraining')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}
      </div>
    </div>
  )
}
