const CACHE = 'monsucre-v8';
const ASSETS = ['/', '/index.html', '/public/style.css', '/public/app.js', '/public/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // API : toujours réseau
  if (e.request.url.includes('/api/')) return;

  // Cache-busting (?v=...) : toujours réseau, puis met à jour le cache
  if (e.request.url.includes('?v=')) {
    e.respondWith(
      fetch(e.request.url.split('?')[0]).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request.url.split('?')[0], clone));
        return res;
      })
    );
    return;
  }

  // Reste : network-first (réseau en priorité, cache en fallback)
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
