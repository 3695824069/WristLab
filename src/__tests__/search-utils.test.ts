import { describe, it, expect } from 'vitest'
import { toPinyin, scoreItem, rank, getTitle, getDesc } from '../lib/search-utils'

// ─── Mock data ───

const courseItem = {
  id: 'test-1',
  title: '高效燃脂 HIIT 训练',
  description: '20分钟高强度间歇训练，快速提升心率',
  category: 'fat_loss',
}

const exerciseItem = {
  id: 'ex-1',
  name: '俯卧撑',
  instruction: '双手撑地，略宽于肩',
  category: 'chest',
}

describe('getTitle()', () => {
  it('returns title for course-like items', () => {
    expect(getTitle(courseItem)).toBe('高效燃脂 HIIT 训练')
  })

  it('returns name for exercise-like items', () => {
    expect(getTitle(exerciseItem)).toBe('俯卧撑')
  })

  it('returns empty string for null/undefined', () => {
    expect(getTitle({})).toBe('')
  })
})

describe('getDesc()', () => {
  it('returns description for course-like items', () => {
    expect(getDesc(courseItem)).toBe('20分钟高强度间歇训练，快速提升心率')
  })

  it('returns instruction for exercise-like items', () => {
    expect(getDesc(exerciseItem)).toBe('双手撑地，略宽于肩')
  })

  it('returns empty string for null/undefined', () => {
    expect(getDesc({})).toBe('')
  })
})

describe('toPinyin()', () => {
  it('converts Chinese to pinyin without spaces', () => {
    expect(toPinyin('高效燃脂')).toBe('gaoxiaoranzhi')
  })

  it('returns empty string on empty input', () => {
    expect(toPinyin('')).toBe('')
  })

  it('preserves ASCII in mixed input', () => {
    const result = toPinyin('HIIT 训练')
    expect(result).toContain('xunlian')
  })
})

describe('scoreItem()', () => {
  it('scores exact title match highest', () => {
    const score = scoreItem(courseItem, '高效燃脂')
    expect(score).toBeGreaterThanOrEqual(10)
  })

  it('scores pinyin match when title does not contain query directly', () => {
    const score = scoreItem(courseItem, 'gaoxiao')
    expect(score).toBeGreaterThanOrEqual(8)
  })

  it('scores 0 for no match', () => {
    const score = scoreItem(courseItem, 'zzzzz')
    expect(score).toBe(0)
  })

  it('matches category', () => {
    const score = scoreItem(courseItem, 'fat_loss')
    expect(score).toBeGreaterThanOrEqual(5)
  })

  it('matches description', () => {
    const score = scoreItem(courseItem, '心率')
    expect(score).toBeGreaterThanOrEqual(2)
  })

  it('is case-insensitive', () => {
    const upper = scoreItem(courseItem, 'HIIT')
    const lower = scoreItem(courseItem, 'hiit')
    expect(upper).toBe(lower)
  })
})

describe('rank()', () => {
  const items = [
    { id: 'a', title: '俯卧撑入门', category: 'chest', description: '基础训练' },
    { id: 'b', title: '引体向上', category: 'back', description: '背部训练' },
    { id: 'c', title: '哑铃飞鸟', category: 'chest', description: '胸肌外侧' },
  ]

  it('returns results sorted by score descending', () => {
    const results = rank(items, '俯卧撑')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].item.id).toBe('a')
  })

  it('filters out zero-score items', () => {
    const results = rank(items, 'zzzzz')
    expect(results.length).toBe(0)
  })

  it('returns items with positive score', () => {
    const results = rank(items, 'chest')
    expect(results.length).toBe(2) // a and c have category 'chest'
    expect(results.every(r => r.score > 0)).toBe(true)
  })

  it('handles empty array', () => {
    const results = rank([], 'test')
    expect(results).toEqual([])
  })
})
