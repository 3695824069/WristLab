const CACHE = 'wristlab-v2'
const STATIC_CACHE = 'wristlab-static-v2'
const IMAGE_CACHE = 'wristlab-images-v2'

// Assets to precache on install
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
]

// Install: precache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(PRECACHE_URLS)
    })
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== IMAGE_CACHE && k !== CACHE)
          .map(k => caches.delete(k))
      )
    })
  )
  self.clients.claim()
})

// Fetch: smart strategy per request type
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, non-http(s)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return

  // API requests → Network First (always fresh)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Images → Cache First (never change)
  if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(cacheFirstImage(request))
    return
  }

  // JS/CSS → Network First (fresh in dev; prod hashed URLs update on rebuild)
  if (request.destination === 'script' || request.destination === 'style' || /\.(js|css)$/i.test(url.pathname)) {
    event.respondWith(networkFirst(request))
    return
  }

  // Navigation (HTML pages) → Network First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(request))
    return
  }

  // Everything else → Network First
  event.respondWith(networkFirst(request))
})

async function cacheFirst(request, cacheName = CACHE) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('Offline', { status: 503 })
  }
}

async function cacheFirstImage(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(IMAGE_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // Return a transparent placeholder if image is unavailable offline
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#18181b" width="400" height="300"/><text fill="#52525b" font-family="sans-serif" font-size="16" text-anchor="middle" x="200" y="155">图片暂不可用</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    )
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    return new Response(JSON.stringify({ success: false, message: '网络不可用' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request)
    if (response.ok) return response
    throw new Error('Response not OK')
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    // Fallback: serve cached index.html for any navigation
    const indexCache = await caches.match('/')
    if (indexCache) return indexCache
    return new Response('Offline', { status: 503 })
  }
}
