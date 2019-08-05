self.addEventListener("install", event => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", event =>
  event.waitUntil(self.clients.claim())
);

// Prefetch and cache the javascript bundles, static images and svgs.
workbox.precaching.precacheAndRoute(self.__precacheManifest);
workbox.precaching.precacheAndRoute([
  { url: "/yc.png" },
  { url: "/wifi.svg" },
  { url: "/no-wifi.svg" }
]);

// app-shell
workbox.routing.registerRoute("/", workbox.strategies.networkFirst());

/**
 * Cache requests that go to the Hacker News API.
 * The service worker will use the response that comes over the network and
 * update the cache if it's different.
 * When the network response is not available it will use the data that
 * has been stored in the cache instead.
 */
workbox.routing.registerRoute(
  /^https:\/\/hacker-news.firebaseio.com\/.*/,
  new workbox.strategies.NetworkFirst()
);
