import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { exercises } from '../data/exercises'
import type { ExerciseCategory } from '../types'
import { exerciseCategoryLabels, difficultyLabels, difficultyColors } from '../types'
import VideoModal from '../components/VideoModal'
import { useFavorites } from '../hooks/useFavorites'

const categoryLabels: Record<ExerciseCategory, string> = exerciseCategoryLabels
const diffLabels = difficultyLabels

const diffColor = difficultyColors

export default function ExerciseDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const exercise = exercises.find(e => e.id === id)
  const [videoOpen, setVideoOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()

  if (!exercise) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('exercises.notFound')}</h2>
          <Link to="/exercises" className="text-green-400 hover:text-green-300">
            {t('exercises.backToList')} →
          </Link>
        </div>
      </div>
    )
  }

  const catLabel = categoryLabels[exercise.category]
  const diffLabel = diffLabels[exercise.difficulty]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Back */}
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <Link to="/exercises" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-green-400 transition-colors">
          ← {t('exercises.backToList')}
        </Link>
      </div>

      {/* Media / Poster */}
      <section className="mx-auto max-w-4xl px-4 py-6">
        <button
          onClick={() => setVideoOpen(true)}
          className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group cursor-pointer text-left"
        >
          <img
            src={exercise.thumbnail}
            alt={exercise.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-green-500/90 flex items-center justify-center shadow-lg group-hover:bg-green-400 group-hover:scale-110 transition-all">
              <svg className="h-7 w-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Hover hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {t('video.clickToPlay')}
          </div>
        </button>
        <VideoModal
          isOpen={videoOpen}
          onClose={() => setVideoOpen(false)}
          title={exercise.name}
          videoUrl={exercise.videoUrl}
          thumbnail={exercise.thumbnail}
          type="exercise"
        />
      </section>

      {/* Detail */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
            {catLabel}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${diffColor[diffLabel] || 'bg-zinc-800 text-zinc-300'}`}>
            {diffLabel}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-4">{exercise.name}</h1>

        {/* Instruction */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 mb-6">
          <h2 className="text-lg font-bold text-green-400 mb-2">{t('exercises.instruction')}</h2>
          <p className="text-zinc-300 leading-relaxed">{exercise.instruction}</p>
        </div>

        {/* Common Mistakes */}
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">
          <h2 className="text-lg font-bold text-orange-400 mb-3">{t('exercises.commonMistakes')}</h2>
          <ul className="space-y-2">
            {exercise.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-orange-300/90">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                {mistake}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => toggleFavorite({
              id: exercise.id, type: 'exercise',
              title: exercise.name, thumbnail: exercise.thumbnail,
            })}
            className={`inline-flex items-center gap-2 rounded-lg border px-6 py-2.5 font-medium text-sm transition-colors ${
              isFavorite(exercise.id)
                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            {isFavorite(exercise.id) ? t('exercises.favorited') : t('exercises.favorite')}
          </button>
          <Link
            to="/exercises"
            className="rounded-lg border border-zinc-700 px-6 py-2.5 font-medium text-zinc-300 hover:border-zinc-500 transition-colors text-sm"
          >
            {t('exercises.viewMore')}
          </Link>
        </div>
      </section>
    </div>
  )
}
