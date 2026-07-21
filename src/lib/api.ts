import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import i18n from '../i18n'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  } catch (netErr: any) {
    // Network error: backend down, CORS, offline, etc.
    const msg = netErr?.message || ''
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      throw new Error(i18n.t('errors.networkError'))
    }
    throw new Error(i18n.t('errors.networkException'))
  }

  let data: any
  try {
    data = await res.json()
  } catch {
    throw new Error(i18n.t('errors.serverError'))
  }

  if (!res.ok) throw new Error(data.message || i18n.t('errors.requestFailed'))
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

export async function checkin(planId?: string, completedExercises?: { exerciseId?: string; displayText: string }[]) {
  const body: Record<string, any> = { plan_id: planId || '' }
  if (completedExercises && completedExercises.length > 0) {
    body.completedExercises = completedExercises
  }
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
