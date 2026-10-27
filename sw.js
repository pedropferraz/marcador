// Marcador — funciona offline. Mude VERSION a cada publicação para forçar a atualização.
const VERSION = 'marcador-v1';
const RUNTIME = 'marcador-runtime';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== RUNTIME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // dados e buscas sempre direto da rede
  if (/supabase\.co$/.test(url.hostname) || url.hostname === 'www.googleapis.com' || url.hostname === 'openlibrary.org') return;
  // página: rede primeiro (pega atualizações), cache se estiver offline
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(VERSION).then((c) => c.put('./index.html', cp)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  const own = url.origin === self.location.origin;
  const cacheable = own || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || /books\.google|googleusercontent|covers\.openlibrary\.org|archive\.org/.test(url.hostname);
  if (!cacheable) return;
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((r) => {
      if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(own ? VERSION : RUNTIME).then((c) => c.put(req, cp)); }
      return r;
    }).catch(() => hit);
    return hit || net;
  }));
});
