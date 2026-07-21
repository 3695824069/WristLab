import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CalendarDays, Flame, Trophy, Swords } from 'lucide-react'
import { plans } from '../data/plans'

export default function Plans() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <section className="border-b border-zinc-800 bg-zinc-900/50 py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">{t('plans.title')}</h1>
          <p className="mt-2 text-zinc-400">{t('plans.description')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => (
            <Link
              key={plan.id}
              to={`/plans/${plan.id}`}
              className="group block rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-green-500/40 transition-colors"
            >
              {/* Banner */}
              <div className={`h-32 flex items-center justify-center ${
                plan.type === '7day'
                  ? 'bg-gradient-to-br from-green-500/20 to-zinc-900'
                  : plan.type === '21day'
                  ? 'bg-gradient-to-br from-violet-500/20 to-zinc-900'
                  : 'bg-gradient-to-br from-orange-500/20 to-zinc-900'
              }`}>
                {plan.type === '7day'
                  ? <CalendarDays className="h-12 w-12 text-green-500/60" />
                  : plan.type === '21day'
                  ? <Swords className="h-12 w-12 text-violet-500/60" />
                  : <Trophy className="h-12 w-12 text-orange-500/60" />
                }
              </div>

              {/* Info */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    plan.type === '7day'
                      ? 'bg-green-500/20 text-green-400'
                      : plan.type === '21day'
                      ? 'bg-violet-500/20 text-violet-400'
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {plan.type === '7day' ? t('plans.plan7day') : plan.type === '21day' ? t('plans.plan21day') : t('plans.plan30day')}
                  </span>
                </div>

                <h3 className="font-bold text-lg group-hover:text-green-400 transition-colors">
                  {plan.title}
                </h3>

                <p className="text-sm text-zinc-400 line-clamp-2">
                  {plan.description}
                </p>

                <div className="flex items-center gap-1 text-xs text-zinc-500 pt-2">
                  <Flame className="h-3.5 w-3.5 text-orange-500/60" />
                  {t('plans.clickToView')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
