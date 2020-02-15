const version = "1.0.0";
const cacheName = `HOME_v${version}`;
const dynamicCacheName = `DYNAMIC_v${version}`;
const dynamicCacheLimit = 10;
const filesToCache = [
  "/",
  "/index.html",
  "/fallback.html"
];

const limitCacheSize = (name, limit) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > limit) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener("install", e => {
  console.log("[sw] installed");
  // Cache files when sw is installed
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("[sw] caching...");
      cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", e => {
  console.log("[sw] activated");
  // Delete other caches when sw is activated
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== cacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", e => {
  console.log("[sw] fetched", e);
  // Respond with cached result or fetch new one
  e.respondWith(
    caches.match(e.request).then(cachedResult => {
      return (
        cachedResult ||
        fetch(e.request)
          .then(async fetchedResult => {
            const cache = await caches.open(dynamicCacheName);
            cache.put(e.request.url, fetchedResult.clone());
            limitCacheSize(dynamicCacheName, dynamicCacheLimit);
            return fetchedResult;
          })
          .catch(() => {
            if (e.request.url.includes(".html")) {
              return caches.match("/fallback.html");
            }
          })
      );
    })
  );
});
