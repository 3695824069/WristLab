import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { exercises } from '../data/exercises'
import ExerciseCard from '../components/ExerciseCard'

export default function Exercises() {
  const { t } = useTranslation()
  const [cat, setCat] = useState<string>('all')
  const [level, setLevel] = useState<string>('all')

  const categories: { value: string; label: string }[] = [
    { value: 'all', label: t('exercises.category_all') },
    { value: 'grip', label: t('exercises.category_grip') },
    { value: 'forearm', label: t('exercises.category_forearm') },
    { value: 'wrist', label: t('exercises.category_wrist') },
    { value: 'bicep', label: t('exercises.category_bicep') },
    { value: 'chest', label: t('exercises.category_chest') },
    { value: 'back', label: t('exercises.category_back') },
    { value: 'legs', label: t('exercises.category_legs') },
    { value: 'core', label: t('exercises.category_core') },
  ]
  const levels: { value: string; label: string }[] = [
    { value: 'all', label: t('exercises.difficulty_all') },
    { value: 'beginner', label: t('exercises.difficulty_beginner') },
    { value: 'intermediate', label: t('exercises.difficulty_intermediate') },
    { value: 'advanced', label: t('exercises.difficulty_advanced') },
  ]

  const filtered = exercises.filter(e => {
    if (cat !== 'all' && e.category !== cat) return false
    if (level !== 'all' && e.difficulty !== level) return false
    return true
  })

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <section className="border-b border-zinc-800 bg-zinc-900/50 py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">{t('exercises.title')}</h1>
          <p className="mt-2 text-zinc-400">{t('exercises.description')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-zinc-500">{t('exercises.categoryLabel')}：</span>
            {categories.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setCat(value)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  cat === value
                    ? 'bg-green-500 text-black font-semibold'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-zinc-500">{t('exercises.difficultyLabel')}：</span>
            {levels.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setLevel(value)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  level === value
                    ? 'bg-green-500 text-black font-semibold'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-zinc-500 mb-6">{t('exercises.count', { count: filtered.length })}</p>

        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500">
            <p>{t('exercises.noResults')}</p>
            <button
              onClick={() => { setCat('all'); setLevel('all') }}
              className="mt-3 text-green-400 hover:text-green-300 text-sm"
            >
              {t('exercises.clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
