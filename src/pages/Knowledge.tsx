import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Search, BookOpen, Clock, ChevronRight, TrendingUp, ArrowRight } from 'lucide-react'
import { knowledgeArticles } from '../data/knowledge'
import { knowledgeCategoryLabels } from '../types'
import type { KnowledgeCategory } from '../types'

const allCategories = Object.keys(knowledgeCategoryLabels) as KnowledgeCategory[]

const categoryColors: Record<KnowledgeCategory, string> = {
  technique: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  guide: 'bg-green-500/20 text-green-400 border-green-500/30',
  rehab: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

const hotArticles = knowledgeArticles.slice(0, 3)

export default function Knowledge() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | 'all'>('all')

  const filtered = useMemo(() => {
    let items = knowledgeArticles
    if (activeCategory !== 'all') {
      items = items.filter(a => a.category === activeCategory)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      items = items.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return items
  }, [query, activeCategory])

  const latestArticles = useMemo(() => {
    return activeCategory === 'all' && !query.trim()
      ? knowledgeArticles.slice(0, 4)
      : filtered.slice(0, 4)
  }, [activeCategory, query, filtered])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-zinc-950" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs text-green-400 mb-5">
            <BookOpen className="h-3.5 w-3.5" />
            {t('knowledge.title')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {t('knowledge.title')}
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base mb-8">
            {t('knowledge.description')}
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder={t('knowledge.searchPlaceholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ─── Category filter ─── */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-sm shadow-green-500/10'
                : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-white'
            }`}
          >
            {t('knowledge.category_all')}
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? `${categoryColors[cat]} shadow-sm`
                  : 'bg-zinc-800/60 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
              }`}
            >
              {knowledgeCategoryLabels[cat]}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Hot articles (only when no filter/search) ─── */}
      {activeCategory === 'all' && !query.trim() && (
        <section className="mx-auto max-w-5xl px-4 pb-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h2 className="text-xl font-bold">{t('knowledge.popular')}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {hotArticles.map((article, index) => (
              <Link
                key={article.id}
                to={`/knowledge/${article.id}`}
                className="group relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/60 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/5 transition-all"
              >
                <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                      categoryColors[article.category]
                    }`}>
                      {knowledgeCategoryLabels[article.category]}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-green-500/90 flex items-center justify-center text-xs font-bold text-black">
                    {index + 1}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-white mb-1.5 group-hover:text-green-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center gap-3 mt-3 text-[10px] text-zinc-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t('common.minutes', { count: article.readTime })}
                    </span>
                    <span>{t('knowledge.read')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── Latest articles ─── */}
      {activeCategory === 'all' && !query.trim() && (
        <section className="mx-auto max-w-5xl px-4 pb-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-400" />
              <h2 className="text-xl font-bold">{t('knowledge.latest')}</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {latestArticles.map(article => (
              <Link
                key={article.id}
                to={`/knowledge/${article.id}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/5 transition-all flex"
              >
                <div className="w-28 sm:w-32 flex-shrink-0 bg-zinc-800 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="flex-1 p-4 min-w-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium inline-block mb-2 ${
                    categoryColors[article.category]
                  }`}>
                    {knowledgeCategoryLabels[article.category]}
                  </span>
                  <h3 className="font-bold text-sm text-white mb-1 group-hover:text-green-400 transition-colors line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-1">{article.summary}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-zinc-600">
                    <Clock className="h-3 w-3" />
                    {t('common.minutesRead', { count: article.readTime })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── All articles (visible when category filtered or search active) ─── */}
      {(activeCategory !== 'all' || query.trim()) && (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">
              {query.trim()
                ? t('knowledge.searchResults', { count: filtered.length })
                : `${knowledgeCategoryLabels[activeCategory as KnowledgeCategory]}（${filtered.length}）`
              }
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-500">{t('knowledge.noResults')}</p>
              <p className="text-sm text-zinc-600 mt-1">{t('knowledge.noResultsHint')}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map(article => (
                <Link
                  key={article.id}
                  to={`/knowledge/${article.id}`}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/5 transition-all"
                >
                  <div className="aspect-video bg-zinc-800 overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                        categoryColors[article.category]
                      }`}>
                        {knowledgeCategoryLabels[article.category]}
                      </span>
                      <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {t('common.minutes', { count: article.readTime })}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white mb-1.5 group-hover:text-green-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2">{article.summary}</p>
                    <div className="flex items-center gap-1.5 mt-3">
                      {article.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">
                          #{tag}
                        </span>
                      ))}
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-600 ml-auto group-hover:text-green-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ─── All articles grid (when no filter) ─── */}
      {activeCategory === 'all' && !query.trim() && (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-400" />
              <h2 className="text-xl font-bold">{t('knowledge.allArticles')}</h2>
            </div>
            <span className="text-xs text-zinc-500">{t('knowledge.totalArticles', { count: knowledgeArticles.length })}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {knowledgeArticles.map(article => (
              <Link
                key={article.id}
                to={`/knowledge/${article.id}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/5 transition-all"
              >
                <div className="aspect-video bg-zinc-800 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                      categoryColors[article.category]
                    }`}>
                      {knowledgeCategoryLabels[article.category]}
                    </span>
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t('common.minutes', { count: article.readTime })}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1 group-hover:text-green-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
