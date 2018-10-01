var VERSION = 'v1.0';

var cacheFirstFiles = [

  // ADDME: Add paths and URLs to pull from cache first if it has been loaded before. Else fetch from network.
  'common/js/jquery-2.1.3.min.js',
  'common/js/object-fit.min.js',
  'common/js/form-submission-handler.js',

  'common/font-awesome/css/fontawesome-all.min.css',

  'common/font-awesome/webfonts/fa-brands-400.ttf',
  'common/font-awesome/webfonts/fa-brands-400.woff',
  'common/font-awesome/webfonts/fa-brands-400.woff2',
  'common/font-awesome/webfonts/fa-regular-400.ttf',
  'common/font-awesome/webfonts/fa-regular-400.woff',
  'common/font-awesome/webfonts/fa-regular-400.woff2',
  'common/font-awesome/webfonts/fa-solid-900.ttf',
  'common/font-awesome/webfonts/fa-solid-900.woff',
  'common/font-awesome/webfonts/fa-solid-900.woff2',

  'common/fonts/Roboto/Roboto-Black.ttf',
  'common/fonts/Roboto/Roboto-Bold.ttf',
  'common/fonts/Roboto/Roboto-Italic.ttf',
  'common/fonts/Roboto/Roboto-Light.ttf',
  'common/fonts/Roboto/Roboto-Medium.ttf',
  'common/fonts/Roboto/Roboto-Regular.ttf',
  'common/fonts/Roboto/Roboto-Thin.ttf',
  'common/fonts/Roboto_Condensed/RobotoCondensed-Bold.ttf',
  'common/fonts/Roboto_Condensed/RobotoCondensed-Italic.ttf',
  'common/fonts/Roboto_Condensed/RobotoCondensed-Light.ttf',
  'common/fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf',

  'common/img/background-image-placeholder.png',
  'common/img/logo-branding.png',
  'common/img/logo-footer.png',

  'images/background-atf.png',
  'images/atf/atf-illus-01.png',
  'images/atf/atf-illus-02.png',
  'images/atf/atf-illus-03.png',
  'images/atf/atf-illus-04.png',
  'images/atf/atf-illus-05.png',

  'about/images/image-jackro-logo.jpg',
  'about/images/image-profile-picture.jpg',
];

var networkFirstFiles = [

  // ADDME: Add paths and URLs to pull from network first. Else fall back to cache if offline. Examples: 
  'common/js/custom.min.js',
  'common/css/style.min.css',

  'index.html',
  'about/index.html',
  'contact/index.html',
  'services/index.html',
  'portfolio/index.html',
  'portfolio/branding-design/index.html',
  'portfolio/featured/index.html',
  'portfolio/graphic-design/index.html',
  'portfolio/web-design/index.html',
  'portfolio/web-development/index.html',
];

// Below is the service worker code.

var cacheFiles = cacheFirstFiles.concat(networkFirstFiles);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') { return; }
  if (networkFirstFiles.indexOf(event.request.url) !== -1) {
    event.respondWith(networkElseCache(event));
  } else if (cacheFirstFiles.indexOf(event.request.url) !== -1) {
    event.respondWith(cacheElseNetwork(event));
  }
  event.respondWith(fetch(event.request));
});

// If cache else network.
// For images and assets that are not critical to be fully up-to-date.
// developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
// #cache-falling-back-to-network
function cacheElseNetwork (event) {
  return caches.match(event.request).then(response => {
    function fetchAndCache () {
       return fetch(event.request).then(response => {
        // Update cache.
        caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
        return response;
      });
    }

    // If not exist in cache, fetch.
    if (!response) { return fetchAndCache(); }

    // If exists in cache, return from cache while updating cache in background.
    fetchAndCache();
    return response;
  });
}

// If network else cache.
// For assets we prefer to be up-to-date (i.e., JavaScript file).
function networkElseCache (event) {
  return caches.match(event.request).then(match => {
    if (!match) { return fetch(event.request); }
    return fetch(event.request).then(response => {
      // Update cache.
      caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
      return response;
    }) || response;
  });
}