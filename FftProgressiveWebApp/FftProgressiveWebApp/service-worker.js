"use strict";

const cacheName = 'weather-1.1';
const filesToCache = [
    // Files
    '/',
    '/Content/app.css',
    '/Content/angular-material.min.css',
    '/Content/weather-icon-512.png',
    '/Scripts/angular-animate.min.js',
    '/Scripts/angular-aria.min.js',
    '/Scripts/angular-material.min.js',
    '/Scripts/angular-messages.min.js',
    '/Scripts/angular.min.js',
    '/Scripts/app.js',

    // API
    '/api/weather'
];


self.addEventListener('install', e => {
    console.log('[ServiceWorker] Install');

    // Activate after install
    self.skipWaiting();

    // Precache files
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('[ServiceWorker] Caching app files');
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('activate', e => {
    console.log('[ServiceWorker] Activate');

    // Clear old caches (if any)
    e.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (key !== cacheName) {
                        console.log('[ServiceWorker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
    );

    // Force clients to use Service Worker's fetch
    return self.clients.claim();
});

self.addEventListener('fetch', e => {
    console.log('[ServiceWorker] Fetch', e.request.url);

    // Network or cache
    e.respondWith(_fromNetwork(e.request, 2000)
        .catch(() => {
            return _fromCache(e.request);
        })
    );
});

function _fromCache(request) {
    return caches.open(cacheName)
        .then(cache => {
            return cache.match(request)
                .then(matching => {
                    return _modifyIfJson(matching) || Promise.reject('no-match');
                });
        });
}

function _modifyIfJson(response) {
    if (response.url.includes('/api/')) {
        // Modify JSON response
        return response.json().then(json => {
            json._isFromCache = true;
            var blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
            return new Response(blob, { headers: response.headers });
        });
    } else {
        return response;
    }
}

function _fromNetwork(request, timeout) {
    return new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(request)
            .then(response => {
                clearTimeout(timeoutId);
                fulfill(response);
            }, reject);
    });
}
