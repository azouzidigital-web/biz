// Aggressive image caching service worker
const CACHE_NAME = 'channel-images-v1';

// Cache all channel images aggressively
const CHANNEL_IMAGES = [
  '/channel_guide/logo_cbctelevision.webp',
  '/channel_guide/logo_cbcnews.webp',
  '/channel_guide/logo_ctvhd.webp',
  '/channel_guide/logo_citytv.webp',
  '/channel_guide/logo_global.webp',
  '/channel_guide/logo_tsn.webp',
  '/channel_guide/logo_sportsnet.webp',
  '/channel_guide/logo_cnninternational.webp',
  '/channel_guide/logo_bbcnews.webp',
  '/channel_guide/logo_disneychannel.webp',
  '/channel_guide/logo_much.webp',
  '/channel_guide/logo_history.webp',
  '/channel_guide/logo_documentary_0.webp',
  '/channel_guide/logo_showcase.webp',
  '/channel_guide/logo_ytv.webp',
  // Add more images as needed
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Pre-cache all channel images
        return cache.addAll(CHANNEL_IMAGES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle channel guide image requests
  if (event.request.url.includes('/channel_guide/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Cache the new response
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
              return fetchResponse;
            });
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});
