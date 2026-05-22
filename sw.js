const CACHE = 'monsucre-v134';
const ASSETS = ['/', '/index.html', '/public/style.css', '/public/app.js', '/public/manifest.json', '/public/medicaments-be.json'];

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

// ── Notifications planifiées depuis l'app ─────────────
// SHOW_NOTIF   : affiche immédiatement
// PLANIFIER_NOTIF : affiche après `delai` ms (setTimeout dans le SW,
//                   tourne en arrière-plan même quand l'app est suspendue)
const _timers = {};  // id → timeoutId (pour annulation future si besoin)

self.addEventListener('message', event => {
  const msg = event.data;
  if (!msg) return;

  if (msg.type === 'SHOW_NOTIF') {
    self.registration.showNotification(msg.titre, {
      body: msg.corps,
      icon: '/public/icons/icon.svg',
      badge: '/public/icons/icon.svg',
      vibrate: [200, 100, 200],
      tag: msg.tag || 'monsucre-notif'
    });
  }

  if (msg.type === 'PLANIFIER_NOTIF') {
    // Annule un éventuel timer précédent pour ce même médicament/slot
    const key = `${msg.medId}-${msg.slot}`;
    if (_timers[key]) clearTimeout(_timers[key]);

    _timers[key] = setTimeout(() => {
      // Vérifie si le médicament est déjà pris (message RETOUR depuis l'app)
      // On ne peut pas lire localStorage depuis le SW : on envoie la notif
      // et l'app peut la supprimer si le med est déjà pris.
      self.registration.showNotification(msg.titre, {
        body: msg.corps,
        icon: '/public/icons/icon.svg',
        badge: '/public/icons/icon.svg',
        vibrate: [200, 100, 200],
        tag: key,   // tag unique → une seule notif par médicament/slot
        renotify: false
      });
      delete _timers[key];
    }, msg.delai);
  }

  if (msg.type === 'ANNULER_NOTIF') {
    // Annule le timer si le med est marqué pris
    const keyA = `${msg.medId}-rappel`;
    const keyB = `${msg.medId}-oubli`;
    if (_timers[keyA]) { clearTimeout(_timers[keyA]); delete _timers[keyA]; }
    if (_timers[keyB]) { clearTimeout(_timers[keyB]); delete _timers[keyB]; }
    // Ferme aussi les notifications déjà affichées
    self.registration.getNotifications({ tag: keyA }).then(ns => ns.forEach(n => n.close()));
    self.registration.getNotifications({ tag: keyB }).then(ns => ns.forEach(n => n.close()));
  }
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
