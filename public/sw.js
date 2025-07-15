// Service Worker for QRloop PWA
const CACHE_NAME = 'qrloop-v1';
const urlsToCache = [
  '/',
  '/generator',
  '/scanner',
  '/library',
  '/analytics',
  '/templates',
  '/collaboration',
  '/settings',
  '/about',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and development specific URLs
  if (!event.request.url.startsWith(self.location.origin) ||
      event.request.url.includes('?') ||
      event.request.url.includes('vite') ||
      event.request.url.includes('__vite') ||
      event.request.url.includes('node_modules') ||
      event.request.url.includes('.hot-update.') ||
      event.request.url.includes('sockjs-node') ||
      event.request.url.includes('webpack') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch((error) => {
          console.log('Fetch failed; returning offline page instead.', error);
          
          // Return a basic fallback for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          
          // For other requests, just fail gracefully
          return new Response('Service Unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Activate event - clean up old caches
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

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Background sync triggered')
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open QRloop',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('QRloop', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle share target
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/share-target' && event.request.method === 'POST') {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const title = formData.get('title');
        const text = formData.get('text');
        const url = formData.get('url');
        const files = formData.getAll('file');

        // Process shared data
        const sharedData = {
          title,
          text,
          url,
          files: files.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
          }))
        };

        // Store shared data for the app to access
        await caches.open('shared-data').then(cache => {
          cache.put('/shared-data', new Response(JSON.stringify(sharedData)));
        });

        return Response.redirect('/?shared=true', 302);
      })()
    );
  }
});
