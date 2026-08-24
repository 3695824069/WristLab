import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock i18n before importing api module
vi.mock('../i18n', () => ({
  default: {
    t: (key: string) => {
      const map: Record<string, string> = {
        'errors.networkError': 'Network error',
        'errors.networkException': 'Network exception',
        'errors.serverError': 'Server error',
        'errors.requestFailed': 'Request failed',
      }
      return map[key] || key
    },
    language: 'zh-CN',
  },
}))

import {
  cn,
  sendCode,
  login,
  getMe,
  updateProfile,
  checkin,
  getWorkoutHistory,
  getWorkoutTrends,
  toggleFavorite,
  sendEmailCode,
  bindEmail,
  unbindEmail,
} from '../lib/api'

const API_BASE_URL = 'http://localhost:3001/api'

function mockFetchOnce(data: unknown, ok = true, status = 200) {
  const mock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

function mockFetchNetworkError() {
  const mock = vi.fn().mockRejectedValue(new Error('Failed to fetch'))
  vi.stubGlobal('fetch', mock)
  return mock
}

function mockFetchParseError() {
  const mock = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.reject(new SyntaxError('Unexpected token')),
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

describe('cn()', () => {
  // cn is already tested in cn.test.ts, just basic sanity
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })
})

describe('API request helper (through public functions)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe('successful requests', () => {
    it('sendCode sends POST with phone', async () => {
      const mock = mockFetchOnce({ success: true, message: '验证码已发送' })
      const res = await sendCode('13800138000')

      expect(mock).toHaveBeenCalledTimes(1)
      const [url, opts] = mock.mock.calls[0]
      expect(url).toBe(`${API_BASE_URL}/auth/send-code`)
      expect(opts.method).toBe('POST')
      expect(JSON.parse(opts.body)).toEqual({ phone: '13800138000' })
      expect(res).toEqual({ success: true, message: '验证码已发送' })
    })

    it('login sends POST with phone and code', async () => {
      const mock = mockFetchOnce({ token: 'abc', user: { id: 1, nickname: 'Test' } })
      const res = await login('13800138000', '123456')

      expect(mock).toHaveBeenCalledTimes(1)
      const [url, opts] = mock.mock.calls[0]
      expect(url).toBe(`${API_BASE_URL}/auth/login`)
      expect(JSON.parse(opts.body)).toEqual({ phone: '13800138000', code: '123456' })
      expect(res.token).toBe('abc')
    })

    it('getMe sends GET with token injected', async () => {
      localStorage.setItem('fithub_auth', JSON.stringify({ token: 'my-jwt', user: { id: 1, nickname: 'T' } }))

      const mock = mockFetchOnce({ id: 1, nickname: 'Test' })
      const res = await getMe()

      const [, opts] = mock.mock.calls[0]
      expect(opts.headers).toHaveProperty('Authorization', 'Bearer my-jwt')
      expect(res.nickname).toBe('Test')
    })

    it('updateProfile sends PUT with body', async () => {
      const mock = mockFetchOnce({ success: true })
      const res = await updateProfile({ nickname: 'NewName' })

      const [, opts] = mock.mock.calls[0]
      expect(opts.method).toBe('PUT')
      expect(JSON.parse(opts.body)).toEqual({ nickname: 'NewName' })
      expect(res).toEqual({ success: true })
    })

    it('checkin sends POST with plan_id', async () => {
      const mock = mockFetchOnce({ success: true })
      const res = await checkin('plan-123', [
        { exerciseId: 'ex-1', displayText: '俯卧撑 3组' },
      ])

      const [, opts] = mock.mock.calls[0]
      expect(opts.method).toBe('POST')
      const body = JSON.parse(opts.body)
      expect(body.plan_id).toBe('plan-123')
      expect(body.exercises).toHaveLength(1)
      expect(res).toEqual({ success: true })
    })

    it('getWorkoutHistory sends GET with limit param', async () => {
      const mock = mockFetchOnce({ records: [] })
      const res = await getWorkoutHistory(7)

      const [url] = mock.mock.calls[0]
      expect(url).toContain('limit=7')
      expect(res).toEqual({ records: [] })
    })

    it('getWorkoutTrends sends GET with weeks param', async () => {
      const mock = mockFetchOnce({ data: { trends: [{ week_start: '2026-07-20', count: 3 }] } })
      const res = await getWorkoutTrends(8)

      const [url] = mock.mock.calls[0]
      expect(url).toContain('weeks=8')
      expect(res.data.trends).toHaveLength(1)
      expect(res.data.trends[0].count).toBe(3)
    })

    it('toggleFavorite sends POST with item', async () => {
      const mock = mockFetchOnce({ data: { favorites: [] } })
      const res = await toggleFavorite({ id: 'c-1', type: 'course', title: 'Test', thumbnail: '' })

      const [, opts] = mock.mock.calls[0]
      expect(opts.method).toBe('POST')
      expect(JSON.parse(opts.body).id).toBe('c-1')
      expect(res.data.favorites).toEqual([])
    })

    it('sendEmailCode sends POST with email', async () => {
      const mock = mockFetchOnce({ success: true })
      const res = await sendEmailCode('test@example.com')

      const [, opts] = mock.mock.calls[0]
      expect(opts.method).toBe('POST')
      expect(JSON.parse(opts.body)).toEqual({ email: 'test@example.com' })
      expect(res).toEqual({ success: true })
    })

    it('bindEmail sends POST with email and code', async () => {
      const mock = mockFetchOnce({ success: true })
      const res = await bindEmail('test@example.com', '888888')

      const [, opts] = mock.mock.calls[0]
      expect(JSON.parse(opts.body)).toEqual({ email: 'test@example.com', code: '888888' })
      expect(res).toEqual({ success: true })
    })
  })

  describe('token injection', () => {
    it('does not add Authorization header when no token stored', async () => {
      const mock = mockFetchOnce({ data: [] })
      await getWorkoutHistory()

      const [, opts] = mock.mock.calls[0]
      expect(opts.headers.Authorization).toBeUndefined()
    })

    it('adds Authorization header when token is in localStorage', async () => {
      localStorage.setItem('fithub_auth', JSON.stringify({ token: 'secret-token', user: { id: 1, nickname: 'T' } }))
      const mock = mockFetchOnce({ ok: true })
      await getMe()

      const [, opts] = mock.mock.calls[0]
      expect(opts.headers.Authorization).toBe('Bearer secret-token')
    })

    it('merges custom headers with Authorization', async () => {
      localStorage.setItem('fithub_auth', JSON.stringify({ token: 't', user: { id: 1, nickname: 'T' } }))

      // Use unbindEmail because it's a simple POST with no body
      const mock = mockFetchOnce({ success: true })
      await unbindEmail()

      const [, opts] = mock.mock.calls[0]
      expect(opts.headers.Authorization).toBe('Bearer t')
      expect(opts.headers['Content-Type']).toBe('application/json')
    })
  })

  describe('error handling', () => {
    it('throws with server message on HTTP error', async () => {
      mockFetchOnce({ message: '手机号无效' }, false, 400)

      await expect(sendCode('000')).rejects.toThrow('手机号无效')
    })

    it('throws default error when HTTP error has no message', async () => {
      mockFetchOnce({}, false, 500)

      await expect(sendCode('13800138000')).rejects.toThrow('Request failed')
    })

    it('throws network error on fetch failure', async () => {
      mockFetchNetworkError()

      await expect(sendCode('13800138000')).rejects.toThrow('Network error')
    })

    it('throws server error on JSON parse failure', async () => {
      mockFetchParseError()

      await expect(sendCode('13800138000')).rejects.toThrow('Server error')
    })

    it('handles empty error message from network', async () => {
      const mock = vi.fn().mockRejectedValue(new Error(''))
      vi.stubGlobal('fetch', mock)

      await expect(sendCode('13800138000')).rejects.toThrow('Network exception')
    })
  })
})
