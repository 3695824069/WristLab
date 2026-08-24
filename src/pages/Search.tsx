import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search as SearchIcon, X, Clock, ArrowRight, Play, Star } from 'lucide-react'
import { courses } from '../data/courses'
import { exercises } from '../data/exercises'
import { plans } from '../data/plans'
import { knowledgeArticles } from '../data/knowledge'
import VideoModal from '../components/VideoModal'
import { useTranslation } from 'react-i18next'
import { getTitle, getDesc, rank, highlightText } from '../lib/search-utils'
import type { RankedResult } from '../lib/search-utils'

// ─── Constants ───

const SEARCH_HISTORY_KEY = 'fithub_search_history_v2'
const MAX_HISTORY = 10
const SEARCH_DEBOUNCE_MS = 300

// ─── Types ───

interface HistoryItem {
  query: string
  time: number
}

interface VideoState {
  open: boolean
  title: string
  videoUrl?: string
  thumbnail?: string
  type: 'course' | 'exercise'
}

// ─── Utilities ───

// getTitle, getDesc, toPinyin, scoreItem, rank, highlightText, RankedResult
// are imported from ../lib/search-utils

/**
 * Return container style classes based on score.
 */
function getItemStyle(score: number): string {
  if (score >= 15) {
    return 'rounded-xl border border-green-500/40 bg-gradient-to-br from-green-500/10 to-zinc-900/80 shadow-lg shadow-green-500/10 overflow-hidden transition-all duration-200 group cursor-pointer'
  }
  if (score >= 8) {
    return 'rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-all duration-200 group cursor-pointer hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/5'
  }
  return 'rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-all duration-200 group cursor-pointer opacity-60 hover:opacity-80 hover:border-zinc-600'
}

function getPlanItemStyle(score: number): string {
  if (score >= 15) {
    return 'block rounded-xl border border-green-500/40 bg-gradient-to-br from-green-500/10 to-zinc-900/80 shadow-lg shadow-green-500/10 p-4 transition-all duration-200 group'
  }
  if (score >= 8) {
    return 'block rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all duration-200 group hover:border-green-500/40'
  }
  return 'block rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all duration-200 opacity-60 hover:opacity-80 hover:border-zinc-600'
}

// ─── History helpers ───

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistoryItem(q: string) {
  const list = loadHistory().filter(i => i.query !== q)
  const newList = [{ query: q, time: Date.now() }, ...list].slice(0, MAX_HISTORY)
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newList))
}

function removeHistoryItem(query: string) {
  const list = loadHistory().filter(i => i.query !== query)
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(list))
  return list
}

function clearAllHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY)
}

// ─── Component ───

export default function Search() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [videoModal, setVideoModal] = useState<VideoState>({ open: false, title: '', type: 'course' })

  // ─── Debounce ───

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  // ─── Load history ───

  useEffect(() => {
    setSearchHistory(loadHistory()) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  // ─── Search handler ───

  const handleSearch = (term: string) => {
    if (!term.trim()) return
    saveHistoryItem(term.trim())
    setSearchHistory(loadHistory())
    setQuery(term.trim())
    setSearchParams({ q: term.trim() })
    setShowHistory(false)
  }

  // ─── Scoring & ranking ───

  const normalizedQ = debouncedQuery.toLowerCase().trim()

  const rankedCourses = useMemo(() => {
    if (!normalizedQ) return null
    return rank(courses, normalizedQ)
  }, [normalizedQ])

  const rankedExercises = useMemo(() => {
    if (!normalizedQ) return null
    return rank(exercises, normalizedQ)
  }, [normalizedQ])

  const rankedPlans = useMemo(() => {
    if (!normalizedQ) return null
    return rank(plans, normalizedQ)
  }, [normalizedQ])

  const rankedKnowledge = useMemo(() => {
    if (!normalizedQ) return null
    return rank(knowledgeArticles, normalizedQ)
  }, [normalizedQ])

  const total = (rankedCourses?.length || 0) + (rankedExercises?.length || 0) + (rankedPlans?.length || 0) + (rankedKnowledge?.length || 0)

  // Flatten all ranked results to find the single top result
  const allRanked = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const all: RankedResult<any>[] = []
    if (rankedCourses) all.push(...rankedCourses.map(r => ({ ...r, _group: 'course' as const })))
    if (rankedExercises) all.push(...rankedExercises.map(r => ({ ...r, _group: 'exercise' as const })))
    if (rankedPlans) all.push(...rankedPlans.map(r => ({ ...r, _group: 'plan' as const })))
    if (rankedKnowledge) all.push(...rankedKnowledge.map(r => ({ ...r, _group: 'knowledge' as const })))
    return all.sort((a, b) => b.score - a.score)
  }, [rankedCourses, rankedExercises, rankedPlans, rankedKnowledge])

  const topResult = allRanked.length > 0 && allRanked[0].score > 10 ? allRanked[0] : null

  // History sorted by recency
  const sortedHistory = useMemo(() => {
    return [...searchHistory].sort((a, b) => b.time - a.time)
  }, [searchHistory])

  // ─── Render helpers ───

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderThumbnail = (item: any, title: string) => (
    <div className="relative aspect-video bg-zinc-800 flex-shrink-0">
      {(item.thumbnail) ? (
        <img loading="lazy"
          src={item.thumbnail}
          alt={title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-zinc-700 flex items-center justify-center">
            <Play className="h-6 w-6 text-zinc-500 ml-0.5" />
          </div>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full bg-green-500/90 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
          <Play className="h-7 w-7 text-white ml-1" />
        </div>
      </div>
      {item.duration && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-xs text-white flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {item.duration}
        </div>
      )}
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-green-500/90 text-xs text-black font-medium">
        {t('video.courseVideo')}
      </div>
    </div>
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCard = (item: any, score: number, q: string, type: 'course' | 'exercise', isTop: boolean) => {
    const title = getTitle(item)
    const desc = getDesc(item)

    const content = (
      <>
        {renderThumbnail(item, title)}
        <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
          <div>
            <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-green-400 transition-colors line-clamp-1">
              {highlightText(title, q)}
            </h3>
            {desc && (
              <p className="text-xs text-zinc-500 line-clamp-2">
                {highlightText(desc, q)}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            {item.difficulty && (
              <span className="text-[10px] text-zinc-600">
                {item.difficulty === 'beginner' ? t('courses.difficulty_beginner') : item.difficulty === 'intermediate' ? t('courses.difficulty_intermediate') : t('courses.difficulty_advanced')}
              </span>
            )}
            <span className="text-[10px] text-zinc-600/60 italic">
              {t('search.matchScore', { score })}
            </span>
          </div>
        </div>
      </>
    )

    if (isTop) {
      return (
        <div className="sm:col-span-2 lg:col-span-3" key={item.id}>
          <div
            className="rounded-xl border border-green-500/40 bg-gradient-to-br from-green-500/10 via-zinc-900/60 to-zinc-900 shadow-lg shadow-green-500/10 overflow-hidden transition-all duration-200 group cursor-pointer hover:shadow-green-500/20 hover:border-green-400 sm:flex"
            onClick={() =>
              setVideoModal({
                open: true,
                title,
                videoUrl: item.videoUrl,
                thumbnail: item.thumbnail,
                type,
              })
            }
          >
            <div className="sm:w-72 flex-shrink-0">
              {renderThumbnail(item, title)}
            </div>
            <div className="p-4 flex flex-col justify-center flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-[10px] font-semibold border border-yellow-400/30">
                  <Star className="h-3 w-3 fill-yellow-400" />
                  {t('search.bestMatch')}
                </span>
                <span className="text-[10px] text-green-400/60">{t('search.matchScore', { score })}</span>
              </div>
              <h3 className="font-bold text-white text-base mb-1 group-hover:text-green-400 transition-colors">
                {highlightText(title, q)}
              </h3>
              {desc && (
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {highlightText(desc, q)}
                </p>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        key={item.id}
        className={getItemStyle(score)}
        onClick={() =>
          setVideoModal({
            open: true,
            title,
            videoUrl: item.videoUrl,
            thumbnail: item.thumbnail,
            type,
          })
        }
      >
        {content}
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPlanCard = (plan: any, score: number, q: string, isTop: boolean) => {
    if (isTop) {
      return (
        <Link
          key={plan.id}
          to={`/plans/${plan.id}`}
          className="block rounded-xl border border-green-500/40 bg-gradient-to-br from-green-500/10 via-zinc-900/60 to-zinc-900 shadow-lg shadow-green-500/10 p-5 transition-all duration-200 group hover:shadow-green-500/20 hover:border-green-400"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-[10px] font-semibold border border-yellow-400/30">
              <Star className="h-3 w-3 fill-yellow-400" />
              {t('search.bestMatch')}
            </span>
            <span className="text-[10px] text-green-400/60">{t('search.matchScore', { score })}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                {highlightText(plan.title, q)}
              </h3>
              <p className="text-sm text-zinc-400 line-clamp-1">
                {highlightText(plan.description, q)}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-zinc-600 flex-shrink-0 ml-3" />
          </div>
        </Link>
      )
    }

    return (
      <Link
        key={plan.id}
        to={`/plans/${plan.id}`}
        className={getPlanItemStyle(score)}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">
              {highlightText(plan.title, q)}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-zinc-400 line-clamp-1 flex-1">
                {highlightText(plan.description, q)}
              </p>
              <span className="text-[10px] text-zinc-600/60 italic flex-shrink-0">
                {t('search.matchScore', { score })}
              </span>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-600 flex-shrink-0 ml-3" />
        </div>
      </Link>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderKnowledgeCard = (article: any, score: number, q: string, isTop: boolean) => {
    if (isTop) {
      return (
        <Link
          key={article.id}
          to={`/knowledge/${article.id}`}
          className="block rounded-xl border border-green-500/40 bg-gradient-to-br from-green-500/10 via-zinc-900/60 to-zinc-900 shadow-lg shadow-green-500/10 p-5 transition-all duration-200 group hover:shadow-green-500/20 hover:border-green-400"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-[10px] font-semibold border border-yellow-400/30">
              <Star className="h-3 w-3 fill-yellow-400" />
              {t('search.bestMatch')}
            </span>
            <span className="text-[10px] text-green-400/60">{t('search.matchScore', { score })}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                {highlightText(article.title, q)}
              </h3>
              <p className="text-sm text-zinc-400 line-clamp-1">
                {highlightText(article.summary, q)}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-zinc-600 flex-shrink-0 ml-3" />
          </div>
        </Link>
      )
    }

    return (
      <Link
        key={article.id}
        to={`/knowledge/${article.id}`}
        className="block rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all duration-200 group hover:border-green-500/40"
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">
              {highlightText(article.title, q)}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-zinc-400 line-clamp-1 flex-1">
                {highlightText(article.summary, q)}
              </p>
              <span className="text-[10px] text-zinc-600/60 italic flex-shrink-0">
                {t('search.matchScore', { score })}
              </span>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-600 flex-shrink-0 ml-3" />
        </div>
      </Link>
    )
  }

  // ─── Render ───

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <section className="border-b border-zinc-800 bg-zinc-900/50 py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">{t('search.title')}</h1>

          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch(query)
                }
              }}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 pl-12 pr-12 py-3 text-white placeholder:text-zinc-500 focus:border-green-500 focus:outline-none transition-all duration-200"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('')
                  setSearchParams({})
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            {/* Search History Dropdown */}
            {showHistory && sortedHistory.length > 0 && !query && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-zinc-700 bg-zinc-800 shadow-xl z-10 transition-all duration-200">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700">
                  <span className="text-sm text-zinc-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {t('search.history')}
                  </span>
                  <button
                    onClick={() => { clearAllHistory(); setSearchHistory([]) }}
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    {t('search.clear')}
                  </button>
                </div>
                <div className="py-1">
                  {sortedHistory.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-2 hover:bg-zinc-700/50 cursor-pointer group transition-colors"
                      onClick={() => handleSearch(entry.query)}
                    >
                      <span className="text-sm text-zinc-300">{entry.query}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-600">
                          {new Date(entry.time).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            const updated = removeHistoryItem(entry.query)
                            setSearchHistory(updated)
                          }}
                          className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        {!query ? (
          // Empty initial state
          <div className="text-center py-16 transition-all duration-200">
            <SearchIcon className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">{t('search.emptyHint')}</p>
          </div>
        ) : total === 0 ? (
          // No results
          <div className="text-center py-16 transition-all duration-200">
            <SearchIcon className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-300 font-medium mb-1">{t('search.noResults')}</p>
            <p className="text-zinc-500 text-sm">
              {t('search.noResultsQuery', { query })}
            </p>
            <p className="text-sm text-zinc-600 mt-2">{t('search.noResultsHint')}</p>
          </div>
        ) : (
          // Results
          <div className="space-y-8 transition-all duration-200">
            {/* Result count banner */}
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
              <span>
                {t('search.resultsFor', { count: total, query })}
              </span>
            </div>

            {/* Top Result — special highlight card */}
            {topResult && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <h2 className="text-lg font-bold text-white">{t('search.bestMatch')}</h2>
                </div>
                {topResult._group === 'course' &&
                  renderCard(topResult.item, topResult.score, debouncedQuery, 'course', true)}
                {topResult._group === 'exercise' &&
                  renderCard(topResult.item, topResult.score, debouncedQuery, 'exercise', true)}
                {topResult._group === 'plan' &&
                  renderPlanCard(topResult.item, topResult.score, debouncedQuery, true)}
                {topResult._group === 'knowledge' &&
                  renderKnowledgeCard(topResult.item, topResult.score, debouncedQuery, true)}
              </div>
            )}

            {/* Courses */}
            {rankedCourses && rankedCourses.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                  <span className="text-green-400">🔥</span>
                  {t('search.tabVideo')}
                  <span className="text-sm font-normal text-zinc-500">({rankedCourses.length})</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rankedCourses.map(r =>
                    renderCard(
                      r.item,
                      r.score,
                      debouncedQuery,
                      'course',
                      // Skip top result if it's already rendered above
                      !!(topResult && topResult._group === 'course' && topResult.item.id === r.item.id)
                    )
                  )}
                </div>
              </div>
            )}

            {/* Exercises */}
            {rankedExercises && rankedExercises.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                  <span className="text-orange-400">🏋️</span>
                  {t('search.tabDemo')}
                  <span className="text-sm font-normal text-zinc-500">({rankedExercises.length})</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rankedExercises.map(r =>
                    renderCard(
                      r.item,
                      r.score,
                      debouncedQuery,
                      'exercise',
                      !!(topResult && topResult._group === 'exercise' && topResult.item.id === r.item.id)
                    )
                  )}
                </div>
              </div>
            )}

            {/* Plans */}
            {rankedPlans && rankedPlans.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                  <span className="text-blue-400">📅</span>
                  {t('search.tabPlans')}
                  <span className="text-sm font-normal text-zinc-500">({rankedPlans.length})</span>
                </h2>
                <div className="space-y-3">
                  {rankedPlans.map(r =>
                    renderPlanCard(
                      r.item,
                      r.score,
                      debouncedQuery,
                      !!(topResult && topResult._group === 'plan' && topResult.item.id === r.item.id)
                    )
                  )}
                </div>
              </div>
            )}

            {/* Knowledge */}
            {rankedKnowledge && rankedKnowledge.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                  <span className="text-amber-400">📖</span>
                  {t('search.tabKnowledge')}
                  <span className="text-sm font-normal text-zinc-500">({rankedKnowledge.length})</span>
                </h2>
                <div className="space-y-3">
                  {rankedKnowledge.map(r =>
                    renderKnowledgeCard(
                      r.item,
                      r.score,
                      debouncedQuery,
                      !!(topResult && topResult._group === 'knowledge' && topResult.item.id === r.item.id)
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Click outside to close history */}
      {showHistory && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowHistory(false)}
        />
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModal.open}
        onClose={() => setVideoModal(prev => ({ ...prev, open: false }))}
        title={videoModal.title}
        videoUrl={videoModal.videoUrl}
        thumbnail={videoModal.thumbnail}
        type={videoModal.type}
      />
    </div>
  )
}
