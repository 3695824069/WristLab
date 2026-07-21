import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { courses } from '../data/courses'
import type { CourseAction } from '../types'
import { courseCategoryLabels, difficultyLabels, difficultyColors } from '../types'
import VideoPlayer from '../components/VideoPlayer'
import VideoModal from '../components/VideoModal'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../context/AuthContext'
import { checkin } from '../lib/api'
import { toast } from 'sonner'

const diffColor = difficultyColors

export default function CourseDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const course = courses.find(c => c.id === id)
  const [videoOpen, setVideoOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [checkingIn, setCheckingIn] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)

  if (!course) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('courses.notFound')}</h2>
          <Link to="/courses" className="text-green-400 hover:text-green-300">
            {t('courses.backToList')}
          </Link>
        </div>
      </div>
    )
  }

  const catLabel = courseCategoryLabels[course.category]
  const diffLabel = difficultyLabels[course.level]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Back link */}
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-green-400 transition-colors">
          {t('courses.backToList')}
        </Link>
      </div>

      {/* Video Section */}
      <section className="mx-auto max-w-4xl px-4 py-6">
        <VideoPlayer
          poster={course.thumbnail}
          title={course.title}
          onPlay={() => setVideoOpen(true)}
        />
        <VideoModal
          isOpen={videoOpen}
          onClose={() => setVideoOpen(false)}
          title={course.title}
          videoUrl={course.videoUrl}
          thumbnail={course.thumbnail}
          type="course"
        />
      </section>

      {/* Course Info */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
            {catLabel}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${diffColor[diffLabel] || 'bg-zinc-800 text-zinc-300'}`}>
            {diffLabel}
          </span>
          <span className="text-xs text-zinc-500">{course.duration}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{course.title}</h1>
        <p className="text-zinc-400 mb-8">{course.description}</p>

        {/* Actions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">{t('courses.trainingActions')}</h2>
          {course.actions.map((action: CourseAction, i: number) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-400">{i + 1}. {action.name}</h3>
                <span className="text-xs text-zinc-500">{action.reps}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-zinc-500">{t('courses.actionInstruction')}</span>
                  <span className="text-zinc-300">{action.instruction}</span>
                </div>
                <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-3">
                  <span className="text-orange-400 text-xs font-medium">{t('courses.caution')}</span>
                  <span className="text-orange-300/90 text-sm ml-1">{action.caution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={async () => {
              if (!user) { navigate('/login'); return }
              setCheckingIn(true)
              try {
                await checkin(course.id)
                setCheckedIn(true)
                toast.success(t('courses.checkinSuccess'))
              } catch (err: any) {
                if (err.message === '今天已经打卡过了') {
                  setCheckedIn(true)
                  toast.info(t('courses.checkinDupe'))
                } else {
                  toast.error(err.message || t('courses.checkinFail'))
                }
              } finally {
                setCheckingIn(false)
              }
            }}
            disabled={checkingIn || checkedIn}
            className={`rounded-lg px-6 py-2.5 font-semibold text-sm transition-all ${
              checkedIn
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                : 'bg-green-500 text-black hover:bg-green-400'
            }`}
          >
            {checkingIn ? t('courses.checkingIn') : checkedIn ? t('courses.checkedIn') : t('courses.markDone')}
          </button>
          <button
            onClick={() => toggleFavorite({
              id: course.id, type: 'course',
              title: course.title, thumbnail: course.thumbnail,
            })}
            className={`inline-flex items-center gap-2 rounded-lg border px-6 py-2.5 font-medium text-sm transition-colors ${
              isFavorite(course.id)
                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            {isFavorite(course.id) ? t('courses.favorited') : t('courses.favorite')}
          </button>
        </div>
      </section>
    </div>
  )
}
