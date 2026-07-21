import { useTranslation } from 'react-i18next'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clock, ChevronRight, ExternalLink, AlertTriangle, Calendar } from 'lucide-react'
import React from 'react'
import { knowledgeArticles } from '../data/knowledge'
import { knowledgeCategoryLabels, courseCategoryLabels } from '../types'
import { courses } from '../data/courses'

const categoryColors: Record<string, string> = {
  technique: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  guide: 'bg-green-500/20 text-green-400 border-green-500/30',
  rehab: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let inList = false
  let listItems: string[] = []
  let listIndex = 0

  const flushList = (): React.ReactNode | null => {
    if (listItems.length === 0) return null
    const items = [...listItems]
    listItems = []
    inList = false
    const savedIndex = listIndex
    listIndex = 0
    return (
      <div className="my-4 space-y-1.5" key={`list-${savedIndex}`}>
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 text-zinc-300 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500/60" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    )
  }

  const addParagraph = (key: string, children: React.ReactNode) => {
    const listEl = flushList()
    if (listEl) elements.push(listEl)
    elements.push(
      <p key={key} className="text-zinc-300 leading-relaxed mb-3">
        {children}
      </p>
    )
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      const listEl = flushList()
      if (listEl) elements.push(listEl)
      continue
    }

    if (trimmed.startsWith('## ')) {
      const listEl = flushList()
      if (listEl) elements.push(listEl)
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-bold text-white mt-8 mb-3">
          {trimmed.slice(3)}
        </h2>
      )
      continue
    }
    if (trimmed.startsWith('### ')) {
      const listEl = flushList()
      if (listEl) elements.push(listEl)
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-bold text-green-400 mt-6 mb-2">
          {trimmed.slice(4)}
        </h3>
      )
      continue
    }

    // **Bold** — text
    const boldMatch = trimmed.match(/^\*\*(.+?)\*\*\s*[—\-–]\s*(.+)/)
    if (boldMatch) {
      const listEl = flushList()
      if (listEl) elements.push(listEl)
      elements.push(
        <p key={`p-${i}`} className="text-zinc-300 leading-relaxed mb-2">
          <strong className="text-white">{boldMatch[1]}</strong> — {boldMatch[2]}
        </p>
      )
      continue
    }

    // | table line
    if (trimmed.startsWith('| ')) {
      const listEl = flushList()
      if (listEl) elements.push(listEl)
      // Skip header separator lines
      if (trimmed.match(/^\|[\s\-:]+\|/)) continue
      elements.push(
        <p key={`table-${i}`} className="text-zinc-300 font-mono text-sm leading-relaxed mb-1 ml-2">
          {trimmed}
        </p>
      )
      continue
    }

    // Numbered list
    const listMatch = trimmed.match(/^(\d+)\.\s+(.+)/)
    if (listMatch) {
      if (!inList) {
        const listEl = flushList()
        if (listEl) elements.push(listEl)
        inList = true
        listIndex = parseInt(listMatch[1])
      }
      listItems.push(trimmed.replace(/^\d+\.\s+/, ''))
      continue
    }

    // Regular paragraph
    addParagraph(`p-${i}`, trimmed)
  }

  const listEl = flushList()
  if (listEl) elements.push(listEl)

  return elements
}

export default function KnowledgeArticle() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const article = knowledgeArticles.find(a => a.id === id)

  if (!article) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t('knowledge.notFound')}</h2>
          <Link to="/knowledge" className="text-green-400 hover:text-green-300">
            {t('knowledge.backToKnowledge')}
          </Link>
        </div>
      </div>
    )
  }

  const relatedCoursesList = (article.relatedCourses || [])
    .map(id => courses.find(c => c.id === id))
    .filter(Boolean) as typeof courses

  const relatedArticlesList = (article.relatedArticles || [])
    .map(relId => knowledgeArticles.find(a => a.id === relId))
    .filter(Boolean) as typeof knowledgeArticles

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Cover image */}
      <div className="relative h-48 sm:h-64 bg-zinc-900 overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-300 hover:text-green-400 transition-colors bg-black/40 rounded-lg px-3 py-1.5 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('knowledge.back')}
          </button>
        </div>
      </div>

      {/* Article header */}
      <section className="mx-auto max-w-3xl px-4 -mt-10 relative z-10">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                categoryColors[article.category]
              }`}
            >
              {knowledgeCategoryLabels[article.category]}
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {t('common.minutesRead', { count: article.readTime })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">{article.title}</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">{article.summary}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {article.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="mx-auto max-w-3xl px-4 pb-8">
        <div className="prose prose-invert max-w-none">
          {renderContent(article.content)}
        </div>

        {/* Disclaimer */}
        {article.disclaimer && (
          <div className="mt-10 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-300/80 leading-relaxed">{article.disclaimer}</p>
          </div>
        )}

        {/* References */}
        {article.references && article.references.length > 0 && (
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-400" />
              {t('knowledge.references')}
            </h3>
            <ul className="space-y-2.5">
              {article.references.map((ref, i) => (
                <li key={i} className="text-xs text-zinc-400 leading-relaxed">
                  <span className="text-zinc-500 mr-1">[{i + 1}]</span>
                  {ref.url ? (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-green-400 transition-colors"
                    >
                      {ref.title}
                      <ExternalLink className="h-3 w-3 inline-block ml-1 -mt-0.5 opacity-60" />
                    </a>
                  ) : (
                    <span className="text-zinc-300">{ref.title}</span>
                  )}
                  <br />
                  <span className="text-zinc-600 ml-3">— {ref.source}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Last updated */}
        {article.lastUpdated && (
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-600">
            <Calendar className="h-3.5 w-3.5" />
            {t('knowledge.lastUpdated', { date: article.lastUpdated })}
          </div>
        )}
      </section>

      {/* Related articles */}
      {relatedArticlesList.length > 0 && (
        <section className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h2 className="text-xl font-bold mb-6">{t('knowledge.relatedArticles')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedArticlesList.map(rel => (
                <Link
                  key={rel.id}
                  to={`/knowledge/${rel.id}`}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-green-500/40 transition-all"
                >
                  <div className="aspect-video bg-zinc-800 overflow-hidden">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                        categoryColors[rel.category]
                      }`}>
                        {knowledgeCategoryLabels[rel.category]}
                      </span>
                      <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {t('common.minutes', { count: rel.readTime })}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-green-400 transition-colors line-clamp-1">
                      {rel.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related courses */}
      {relatedCoursesList.length > 0 && (
        <section className="border-t border-zinc-800">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <h2 className="text-xl font-bold mb-6">{t('knowledge.relatedCourses')}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedCoursesList.map(course => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-green-500/40 transition-all group"
                >
                  <div className="h-14 w-20 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors truncate">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {courseCategoryLabels[course.category] || course.category} · {course.duration}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="mx-auto max-w-3xl px-4 py-8 text-center">
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            {t('knowledge.browseAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
