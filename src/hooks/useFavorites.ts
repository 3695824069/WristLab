import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { toggleFavorite as apiToggleFavorite, fetchFavorites as apiFetchFavorites } from '../lib/api'

export interface FavoriteItem {
  id: string
  type: 'course' | 'exercise'
  title: string
  thumbnail: string
}

function storageKey(userId?: number): string {
  return userId ? `favorites_${userId}` : 'favorites_guest'
}

function loadFromStorage(userId?: number): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(items: FavoriteItem[], userId?: number) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(items))
  } catch {
    /* quota exceeded or blocked */
  }
}

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => loadFromStorage(user?.id))

  // 用户切换时从对应来源加载收藏
  useEffect(() => {
    if (user) {
      // 登录用户：优先从服务端拉取，失败降级到 localStorage
      apiFetchFavorites()
        .then(res => {
          const items: FavoriteItem[] = (res.data?.favorites || []).map(
            (f: any) => ({ id: f.id, type: f.type, title: f.title, thumbnail: f.thumbnail })
          )
          setFavorites(items)
          saveToStorage(items, user.id)
        })
        .catch(() => {
          setFavorites(loadFromStorage(user.id))
        })
    } else {
      // 游客：仅 localStorage
      setFavorites(loadFromStorage())
    }
  }, [user?.id])

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    if (user) {
      // 乐观更新
      const prev = favorites
      const exists = prev.some(f => f.id === item.id)
      const next = exists ? prev.filter(f => f.id !== item.id) : [...prev, item]
      setFavorites(next)
      saveToStorage(next, user.id)

      // 同步到服务端
      apiToggleFavorite({ id: item.id, type: item.type, title: item.title, thumbnail: item.thumbnail })
        .then(res => {
          const items: FavoriteItem[] = (res.data?.favorites || []).map(
            (f: any) => ({ id: f.id, type: f.type, title: f.title, thumbnail: f.thumbnail })
          )
          setFavorites(items)
          saveToStorage(items, user.id)
        })
        .catch(() => {
          // 失败时回滚到操作前的状态
          setFavorites(prev)
          saveToStorage(prev, user.id)
        })
    } else {
      // 游客：仅 localStorage
      setFavorites(prev => {
        const exists = prev.some(f => f.id === item.id)
        const next = exists ? prev.filter(f => f.id !== item.id) : [...prev, item]
        saveToStorage(next)
        return next
      })
    }
  }, [user, favorites])

  const isFavorite = useCallback(
    (id: string) => favorites.some(f => f.id === id),
    [favorites]
  )

  return { favorites, toggleFavorite, isFavorite }
}
