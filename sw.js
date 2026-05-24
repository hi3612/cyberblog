const CACHE = 'cyberblog-v1';
const ASSETS = [
  '/cyberblog/',
  '/cyberblog/index.html',
  '/cyberblog/css/style.css',
  '/cyberblog/js/main.js',
  '/cyberblog/js/posts.js',
  '/cyberblog/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok && e.request.url.startsWith(self.location.origin)) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
