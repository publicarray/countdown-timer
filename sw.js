// https://web.dev/offline-cookbook/
const $ASSETS = [
    "/?source=pwa",
    "/",
    "css/main.css",
    "js/main.js",
    "images/logo.svg",
    "images/help.svg",
    "images/pause.svg",
    "images/play.svg",
    "images/start-over.svg",
    "images/android-icon-192x192.png",
    "images/apple-icon-144x144.png",
    "images/favicon-32x32.png",
    "images/favicon-16x16.png",
    "css/fonts/3b303641-706e-4221-94c4-4fb491f4f8ef.woff2",
    "css/fonts/b0868b4c-234e-47d3-bc59-41ab9de3c0db.woff2",
    "manifest.json"
];

let cacheVersion = "countdown-1.0";

// cache assets
self.addEventListener("install", event => {
    console.log("start server worker", cacheVersion);
    event.waitUntil(
        caches.open(cacheVersion).then(cache => {
            return cache.addAll($ASSETS);
        })
    );
});


// respond with the cached version
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        }),
    );
});


// remove old cached versions
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames
                .filter(function(cacheName) {
                    return cacheName != cacheVersion;
                })
                .map(function(cacheName) {
                    return caches.delete(cacheName);
                }),
            );
        }),
    );
});