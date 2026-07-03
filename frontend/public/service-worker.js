// service-worker.js
const CACHE_NAME = 'punjabi-lingo-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/static/js/main.js', // Note: Vite hashes the filenames, so we need a different approach
  // We'll use a more dynamic approach: cache everything during install and then use runtime caching
];

// Since Vite uses hashed filenames, we can't precache specific JS/CSS files easily without knowing the hash.
// Instead, we'll cache the HTML and then rely on runtime caching for the rest.
// We'll use a cache-first strategy for static assets and network-first for API calls.

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (like to our API on a different port)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For API requests, we try network first, then cache
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response because it's a stream and can only be consumed once
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For other requests (static assets), try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if found
        if (response) {
          return response;
        }
        // Otherwise, try the network
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response to put in cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return response;
          })
          .catch(() => {
            // If both cache and network fail, return a fallback (e.g., offline page)
            // For now, we'll just return the error (but in a real app, we might have an offline page)
            return caches.match('/offline.html'); // We don't have an offline.html, so this might return undefined
          })
      })
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});