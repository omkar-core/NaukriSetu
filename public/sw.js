const CACHE_NAME = 'naukrisetu-v1'
const urlsToCache = [
  '/',
  '/jobs',
  '/internships',
  '/apprenticeships',
  '/exams',
  '/admit-cards',
  '/results',
  '/notifications',
  '/about',
  '/contact',
  '/offline',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/offline')
        }
      })
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
})
