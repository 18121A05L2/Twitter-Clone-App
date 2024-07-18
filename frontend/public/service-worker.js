const cacheName = "v1.0";
const cacheAssets = [
  "index.html",
  "about.html",
  "/js/main.js",
  "/css/style.css",
];

// Installation
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Service Worker: Caching Files");
        return cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation
self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip requests to unsupported schemes like 'chrome-extension' and the service worker script
  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    url.pathname === "/service-worker.js"
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("Serving from cache:", event.request.url);
        return cachedResponse;
      }
      return fetch(event.request)
        .then((response) => {
          // Check if the response is a partial response (status code 206)
          if (response.status === 206) {
            console.log("Partial response not cached:", event.request.url);
            return response;
          }
          console.log("Fetching from network and caching:", event.request.url);
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch((error) => {
          console.error("Fetch failed; returning offline page instead.", error);
          return caches.match("offline.html");
        });
    })
  );
});
