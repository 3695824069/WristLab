import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { courses } from '../data/courses'
import CourseCard from '../components/CourseCard'

export default function Courses() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const catFilter = (params.get('category') || 'all') as string
  const levelFilter = (params.get('level') || 'all') as string

  const categories: { value: string; label: string }[] = [
    { value: 'all', label: t('courses.category_all') },
    { value: 'arm_basic', label: t('courses.category_arm_basic') },
    { value: 'arm_strength', label: t('courses.category_arm_strength') },
    { value: 'arm_technique', label: t('courses.category_arm_technique') },
    { value: 'arm_rehab', label: t('courses.category_arm_rehab') },
    { value: 'fat_loss', label: t('courses.category_fat_loss') },
    { value: 'muscle_gain', label: t('courses.category_muscle_gain') },
    { value: 'home', label: t('courses.category_home') },
  ]
  const levels: { value: string; label: string }[] = [
    { value: 'all', label: t('courses.difficulty_all') },
    { value: 'beginner', label: t('courses.difficulty_beginner') },
    { value: 'intermediate', label: t('courses.difficulty_intermediate') },
    { value: 'advanced', label: t('courses.difficulty_advanced') },
  ]

  const filtered = courses.filter(c => {
    if (catFilter !== 'all' && c.category !== catFilter) return false
    if (levelFilter !== 'all' && c.level !== levelFilter) return false
    return true
  })

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <section className="border-b border-zinc-800 bg-zinc-900/50 py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">{t('courses.title')}</h1>
          <p className="mt-2 text-zinc-400">{t('courses.description')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Category filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">{t('courses.categoryLabel')}</span>
            {categories.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => updateParam('category', value)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  catFilter === value
                    ? 'bg-green-500 text-black font-semibold'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Level filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">{t('courses.difficultyLabel')}</span>
            {levels.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => updateParam('level', value)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  levelFilter === value
                    ? 'bg-green-500 text-black font-semibold'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-zinc-500 mb-6">
          {t('courses.count', { count: filtered.length })}
        </p>

        {/* Course Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500">
            <p>{t('courses.noResults')}</p>
            <button
              onClick={() => { setParams(new URLSearchParams()) }}
              className="mt-3 text-green-400 hover:text-green-300 text-sm"
            >
              {t('courses.clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
