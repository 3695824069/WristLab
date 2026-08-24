import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import i18n from '../i18n'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Types ───

export interface ExerciseInputV2 {
  exerciseId?: string
  displayText: string
  sets?: number | null
  reps?: number | null
  weight?: number | null
  rpe?: number | null
}

export interface CheckinOptions {
  dayIndex?: number
  notes?: string
  startedAt?: string
  completedAt?: string
}

export interface WorkoutRecord {
  id: number
  plan_id: string
  record_date: string
  day_index?: number | null
  notes?: string | null
  started_at?: string | null
  completed_at?: string | null
  created_at: string
  exercises?: ExerciseRecord[]
}

export interface ExerciseRecord {
  id: number
  workout_record_id: number
  exercise_id?: string | null
  display_text: string
  sets?: number | null
  reps?: number | null
  weight?: number | null
  rpe?: number | null
  completed: number
  completed_at?: string | null
  sort_order: number
}

async function request(path: string, options: RequestInit = {}) {
  const token = (() => {
    try {
      const stored = localStorage.getItem('fithub_auth')
      return stored ? JSON.parse(stored).token : null
    } catch { return null }
  })()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch (netErr: unknown) {
    // Network error: backend down, CORS, offline, etc.
    const msg = netErr instanceof Error ? netErr.message : String(netErr || '')
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      throw new Error(i18n.t('errors.networkError'))
    }
    throw new Error(i18n.t('errors.networkException'))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any
  try {
    data = await res.json()
  } catch {
    throw new Error(i18n.t('errors.serverError'))
  }

  if (!res.ok) {
    const err = new Error(data.message || i18n.t('errors.requestFailed')) as Error & { code?: string }
    if (data.code) err.code = data.code
    throw err
  }
  return data
}

export async function sendCode(phone: string) {
  return request('/auth/send-code', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  })
}

export async function login(phone: string, code: string) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  })
}

export async function getMe() {
  return request('/auth/me')
}

export async function updateProfile(data: { nickname?: string; avatar?: string }) {
  return request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function checkin(
  planId?: string,
  exercises?: ExerciseInputV2[],
  options?: CheckinOptions,
) {
  const body: Record<string, unknown> = { plan_id: planId || '' }

  if (exercises && exercises.length > 0) {
    // V2 format: use 'exercises' key with structured fields
    body.exercises = exercises
  }

  if (options?.dayIndex != null) body.day_index = options.dayIndex
  if (options?.notes != null) body.notes = options.notes
  if (options?.startedAt != null) body.started_at = options.startedAt
  if (options?.completedAt != null) body.completed_at = options.completedAt

  return request('/workouts/checkin', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getWorkoutHistory(limit = 30) {
  return request(`/workouts/history?limit=${limit}`)
}

export async function getWorkoutStats() {
  return request('/workouts/stats')
}

export async function getWorkoutTrends(weeks = 12) {
  return request(`/workouts/trends?weeks=${weeks}`)
}

export async function getTodayWorkout() {
  return request('/workouts/today')
}

export async function toggleFavorite(item: { id: string; type: string; title: string; thumbnail: string }) {
  return request('/favorites/toggle', {
    method: 'POST',
    body: JSON.stringify(item),
  })
}

export async function fetchFavorites() {
  return request('/favorites')
}

export async function sendEmailCode(email: string) {
  return request('/auth/send-email-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function bindEmail(email: string, code: string) {
  return request('/auth/bind-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  })
}

export async function unbindEmail() {
  return request('/auth/unbind-email', {
    method: 'POST',
  })
}
