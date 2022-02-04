const $ASSETS = [
    "/",
    "/css/main.css",
    "/js/main.js",
    "/images/logo.svg",
    "/images/help.svg",
    "/images/pause.svg",
    "/images/play.svg",
    "/images/start-over.svg",
    "/images/android-icon-192x192.png",
    "/images/favicon-32x32.png",
    "/css/fonts/3b303641-706e-4221-94c4-4fb491f4f8ef.woff2",
    "/css/fonts/b0868b4c-234e-47d3-bc59-41ab9de3c0db.woff2"
];

let cache_name = "v1.1";

self.addEventListener("install", event => {
    console.log("start server worker");
    event.waitUntil(
        caches
        .open(cache_name)
        .then(cache => {
            return cache.addAll($ASSETS);
        })
        .catch(err => console.log(err))
    );
});

self.addEventListener("fetch", event => {
    let url = event.request.url.indexOf(self.location.origin) !== -1 ?
        event.request.url.split(`${self.location.origin}/`)[1] :
        event.request.url;
    let isFileCached = $ASSETS.indexOf(url) !== -1;

    if (isFileCached) {
        event.respondWith(
            fetch(event.request).catch(err =>
                self.cache.open(cache_name).then(cache => cache.match("/"))
            )
        );
    } else {
        event.respondWith(
            fetch(event.request).catch(err =>
                caches.match(event.request).then(response => response)
            )
        );
    }
});