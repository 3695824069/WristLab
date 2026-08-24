import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { Flame, ArrowRight, Play, CheckCircle, BookOpen, Clock } from 'lucide-react'
import { courses } from '../data/courses'
import { plans } from '../data/plans'
import { knowledgeArticles } from '../data/knowledge'
import CourseCard from '../components/CourseCard'
import { useAuth } from '../context/AuthContext'
import { getTodayWorkout } from '../lib/api'

// 取前3个腕力课程作为推荐
const recommended = courses.filter(c => c.category.startsWith('arm_')).slice(0, 3)

// 精选3篇知识文章
const featuredKnowledge = knowledgeArticles.filter(a =>
  ['what-is-top-roll', 'hook-technique', 'injury-prevention'].includes(a.id)
)

export default function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [todayData, setTodayData] = useState<{ planId: string; dayIndex: number; checkedToday: boolean } | null>(null)
  const [todayLoading, setTodayLoading] = useState(false)

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTodayLoading(true)
      getTodayWorkout()
        .then(res => setTodayData(res.data))
        .catch(() => {})
        .finally(() => setTodayLoading(false))
    } else {
      setTodayData(null)
    }
  }, [user])

  const todayPlan = todayData ? plans.find(p => p.id === todayData.planId) : null
  const todayDay = todayPlan ? todayPlan.days.find(d => d.day === todayData!.dayIndex) : null

  const handleStartTraining = () => {
    if (!user) { navigate('/login'); return }
    if (todayData) navigate(`/plans/${todayData.planId}?day=${todayData.dayIndex}`)
  }
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-zinc-950" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm text-green-400 mb-6">
            <Flame className="h-4 w-4" />
            {t('home.title')}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <Trans i18nKey="home.subtitle" components={{ highlight: <span className="text-green-500" /> }} />
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-zinc-400">
            {t('home.description')}
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/courses?category=arm_basic"
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-black hover:bg-green-400 transition-colors"
            >
              <Play className="h-4 w-4 fill-black" />
              {t('home.startTraining')}
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 font-medium text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
            >
              {t('home.viewCourses')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 今日训练 ─── */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-4">
        {user && todayLoading ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 animate-pulse">
            <div className="h-5 w-32 bg-zinc-800 rounded mb-4" />
            <div className="h-4 w-48 bg-zinc-800 rounded mb-2" />
            <div className="h-3 w-64 bg-zinc-800 rounded" />
          </div>
        ) : todayPlan && todayDay ? (
          <div className={`rounded-2xl border p-6 ${todayData!.checkedToday ? 'border-zinc-800 bg-zinc-900/60' : 'border-green-500/30 bg-gradient-to-r from-green-500/20 to-zinc-900'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Flame className={`h-5 w-5 ${todayData!.checkedToday ? 'text-zinc-500' : 'text-green-400'}`} />
              <span className={`text-sm font-medium ${todayData!.checkedToday ? 'text-zinc-500' : 'text-green-400'}`}>
                {todayData!.checkedToday ? t('home.todayDone') : t('home.todayTraining')}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1">{todayPlan.title}</h3>
            <p className="text-zinc-400 text-sm mb-1">{todayDay.title}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {todayDay.exercises.slice(0, 3).map((ex, i) => (
                <span key={i} className="text-xs bg-zinc-800 rounded-full px-2.5 py-1 text-zinc-300">{ex.displayText}</span>
              ))}
              {todayDay.exercises.length > 3 && (
                <span className="text-xs text-zinc-500">+{todayDay.exercises.length - 3}</span>
              )}
            </div>
            {todayData!.checkedToday ? (
              <div className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-400 cursor-default">
                <CheckCircle className="h-4 w-4" />
                {t('todaysTraining.done')}
              </div>
            ) : (
              <button
                onClick={handleStartTraining}
                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 font-semibold text-black hover:bg-green-400 transition-colors text-sm"
              >
                {t('todaysTraining.start')}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : user && !todayLoading ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6 text-center">
            <p className="text-zinc-500 text-sm">{t('home.noRecommendation')}</p>
            <Link to="/plans" className="inline-block mt-2 text-sm text-green-400 hover:text-green-300">
              {t('home.viewPlans')}
            </Link>
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">{t('home.loginHint')}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{t('home.loginHintDesc')}</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 transition-colors"
            >
              登录
            </button>
          </div>
        ) : null}
      </section>

      {/* ─── 推荐课程 ─── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('home.recommendedCourses')}</h2>
          <Link to="/courses" className="text-sm text-green-400 hover:text-green-300 transition-colors">
            {t('common.viewAll')}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* ─── 新手入口 ─── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">{t('home.beginnerGuide')}</h2>
        <div className="rounded-2xl bg-gradient-to-r from-green-500/20 to-zinc-900 border border-green-500/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold">{t('home.beginnerTitle')}</h3>
            <p className="text-zinc-400">
              {t('home.beginnerDesc')}<br /><br />
              {t('home.beginnerSub')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/courses/aw-basic-grip"
                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 font-semibold text-black hover:bg-green-400 transition-colors text-sm"
              >
                {t('home.gripTechnique')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/courses/aw-basic-stance"
                className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 px-5 py-2.5 font-medium text-green-400 hover:bg-green-500/10 transition-colors text-sm"
              >
                {t('home.stanceChain')}
              </Link>
              <Link
                to="/courses/aw-basic-rules"
                className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 px-5 py-2.5 font-medium text-green-400 hover:bg-green-500/10 transition-colors text-sm"
              >
                {t('home.rulesSafety')}
              </Link>
            </div>
          </div>
          <div className="hidden sm:block flex-shrink-0">
            <div className="h-32 w-32 rounded-full bg-green-500/10 flex items-center justify-center">
              <Flame className="h-16 w-16 text-green-500/50" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 热门训练（按热度模拟） ─── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('home.popularTraining')}</h2>
          <Link to="/courses" className="text-sm text-green-400 hover:text-green-300 transition-colors">
            {t('common.viewAll')}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* ─── 热门知识 ─── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-green-400" />
            <h2 className="text-2xl font-bold">{t('home.popularKnowledge')}</h2>
          </div>
          <Link to="/knowledge" className="text-sm text-green-400 hover:text-green-300 transition-colors">
            {t('home.viewMore')}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {featuredKnowledge.map(article => (
            <Link
              key={article.id}
              to={`/knowledge/${article.id}`}
              className="group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/60 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/5 transition-all"
            >
              <div className="aspect-[4/3] bg-zinc-800 overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-white mb-1.5 group-hover:text-green-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{article.summary}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                  <Clock className="h-3 w-3" />
                  {t('common.minutesRead', { count: article.readTime })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 腕力分类入口 ─── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">{t('home.trainingSystem')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t('home.armBasic'), desc: t('home.armBasicDesc'), color: 'from-green-500/20 to-transparent', border: 'border-green-500/30', href: '/courses?category=arm_basic' },
            { label: t('home.strengthUp'), desc: t('home.strengthUpDesc'), color: 'from-blue-500/20 to-transparent', border: 'border-blue-500/30', href: '/courses?category=arm_strength' },
            { label: t('home.technique'), desc: t('home.techniqueDesc'), color: 'from-purple-500/20 to-transparent', border: 'border-purple-500/30', href: '/courses?category=arm_technique' },
            { label: t('home.rehab'), desc: t('home.rehabDesc'), color: 'from-amber-500/20 to-transparent', border: 'border-amber-500/30', href: '/courses?category=arm_rehab' },
          ].map(({ label, desc, color, border, href }) => (
            <Link
              key={label}
              to={href}
              className={`block rounded-xl border ${border} bg-gradient-to-br ${color} p-6 hover:scale-[1.02] transition-transform`}
            >
              <h3 className="text-lg font-bold">{label}</h3>
              <p className="text-sm text-zinc-400 mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 健身辅助入口（降级） ─── */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-zinc-500" />
            <h3 className="text-sm font-medium text-zinc-400">{t('home.fitnessAux')}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/courses?category=fat_loss" className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">{t('home.fatLoss')}</Link>
            <Link to="/courses?category=muscle_gain" className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">{t('home.muscleGain')}</Link>
            <Link to="/courses?category=home" className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">{t('home.home')}</Link>
            <Link to="/exercises" className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">{t('nav.exercises')}</Link>
            <Link to="/plans" className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">{t('nav.plans')}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
