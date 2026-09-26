/* Ramza service worker — makes the installed app work without signal.
   Pages and card data are network-first so updates land immediately when
   online; icons, fonts and other static files come from the cache. */
const CACHE = "ramza-v1";
const SHELL = [
  "./", "./index.html", "./cards.json", "./manifest.json",
  "./site.webmanifest", "./icon-180.png", "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function save(req, res) {
  if (res && (res.ok || res.type === "opaque")) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const sameOrigin = new URL(req.url).origin === self.location.origin;
  const liveData = req.mode === "navigate" || /\.json$/.test(new URL(req.url).pathname);

  if (sameOrigin && liveData) {
    // Always try the network, so a new deck or a new build shows up at once.
    e.respondWith(
      fetch(req).then((r) => save(req, r))
        .catch(() => caches.match(req).then((m) => m || caches.match("./index.html")))
    );
  } else {
    // Icons, fonts, everything else: cache first, then network.
    e.respondWith(
      caches.match(req).then((m) => m || fetch(req).then((r) => save(req, r)).catch(() => m))
    );
  }
});
