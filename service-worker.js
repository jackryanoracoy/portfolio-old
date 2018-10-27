var CACHE = 'JACKRO-precache';
var precacheFiles = [
	'/',
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

	'common/css/style.min.css',

	'common/js/custom.min.js',
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

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function(evt) {
  console.log('JACKRO: The service worker is being installed.');
  evt.waitUntil(precache().then(function() {
    console.log('JACKRO: Skip waiting on install');
    return self.skipWaiting();
  }));
});


//allow sw to control of current page
self.addEventListener('activate', function(event) {
  console.log('JACKRO: Claiming clients for current page');
  return self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
  console.log('JACKRO: The service worker is serving the asset.'+ evt.request.url);
  evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
  evt.waitUntil(update(evt.request));
});


function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(precacheFiles);
  });
}

function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  //this is where we call the server to get the newest version of the 
  //file to use the next time we show view
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

function fromServer(request){
  //this is the fallback if it is not in the cache to go to the server and get it
  return fetch(request).then(function(response){ return response});
}
