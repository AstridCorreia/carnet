/* Service worker du Carnet d'entraînement
   Rôle : garder une copie de l'appli sur le téléphone pour qu'elle s'ouvre
   même sans réseau (sous-sol de la salle).
   - La page : on essaie le réseau 3 secondes (pour avoir les mises à jour),
     sinon on prend la copie en cache.
   - Firebase et les polices : copie en cache d'abord (elles ne changent pas).
   - Les échanges avec ta base (firestore, connexion) ne sont jamais mis en cache. */
const CACHE = "carnet-v2";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-180.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

function networkFirst(req) {
  return caches.open(CACHE).then((cache) => {
    const fromNet = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; });
    const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
    return Promise.race([fromNet.catch(() => null), timeout]).then((res) =>
      res || cache.match(req, { ignoreSearch: true }).then((hit) => hit || cache.match("./index.html")).then((hit) => hit || fromNet)
    );
  });
}
function cacheFirst(req) {
  return caches.open(CACHE).then((cache) => cache.match(req).then((hit) => hit || fetch(req).then((res) => { if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone()); return res; })));
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) { e.respondWith(networkFirst(req)); return; }
  if ((url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/")) || url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(cacheFirst(req));
  }
  // tout le reste (firestore.googleapis.com, identitytoolkit…) passe directement au réseau
});
