self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through all non-GET requests (like POST for Firebase auth)
  if (event.request.method !== 'GET') return;
  // Pass through requests to googleapis and other firebase domains
  if (event.request.url.includes('googleapis.com') || event.request.url.includes('firebase')) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Offline mode: No connection available.', {
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
