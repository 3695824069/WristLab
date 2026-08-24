import { Fragment } from 'react'
import { pinyin } from 'pinyin-pro'

// ─── Types ───

export interface RankedResult<T> {
  item: T
  score: number
  _group?: 'course' | 'exercise' | 'plan' | 'knowledge'
}

// ─── Accessors ───

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTitle(item: any): string {
  return item.title || item.name || ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDesc(item: any): string {
  return item.description || item.instruction || ''
}

// ─── Pinyin ───

/** Convert Chinese text to pinyin (no tones, no spaces). */
export function toPinyin(text: string): string {
  try {
    return pinyin(text, { toneType: 'none' }).replace(/\s+/g, '')
  } catch {
    return ''
  }
}

// ─── Scoring ───

/**
 * Compute a relevance score for an item against query `q`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scoreItem(item: any, rawQ: string): number {
  const q = rawQ.toLowerCase()
  const title = getTitle(item).toLowerCase()
  const desc = getDesc(item).toLowerCase()
  const category = (item.category || '').toLowerCase()

  let score = 0

  if (title.includes(q)) {
    score += 10
  } else {
    const p = toPinyin(title)
    if (p.includes(q)) score += 8
  }

  if (title.startsWith(q)) score += 5
  if (category.includes(q)) score += 5
  if (desc.includes(q)) score += 2

  return score
}

/**
 * Rank items by relevance score, filtering out zero-score items.
 */
export function rank<T>(items: T[], q: string): RankedResult<T>[] {
  return items
    .map(item => ({ item, score: scoreItem(item, q) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
}

// ─── Highlight ───

/**
 * Split text into React nodes with matched keywords wrapped in <mark>.
 * Supports multiple keywords (space-separated). No innerHTML.
 */
export function highlightText(text: string, rawQ: string): React.ReactNode[] {
  if (!rawQ || !text) return [text]

  const keywords = rawQ
    .split(/\s+/)
    .filter(Boolean)
    .map(k => k.toLowerCase())

  if (keywords.length === 0) return [text]

  // Build a case-insensitive regex that captures any keyword
  const escaped = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = `(${escaped.join('|')})`
  const regex = new RegExp(pattern, 'gi')

  const parts = text.split(regex)
  const result: React.ReactNode[] = []

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part) continue

    if (keywords.includes(part.toLowerCase())) {
      result.push(
        <mark
          key={i}
          className="bg-yellow-300/80 text-yellow-900 font-semibold px-1 rounded shadow-[0_0_0_1px_rgba(250,204,21,0.3)]"
        >
          {part}
        </mark>
      )
    } else {
      result.push(<Fragment key={i}>{part}</Fragment>)
    }
  }

  return result
}
