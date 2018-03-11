"use strict";

const cacheName = 'weather-1.0';
const filesToCache = [
    '/',
    '/Content/app.css',
    '/Content/angular-material.min.css',
    '/Content/weather-icon-512.png',
    '/Scripts/angular-animate.min.js',
    '/Scripts/angular-aria.min.js',
    '/Scripts/angular-material.min.js',
    '/Scripts/angular-messages.min.js',
    '/Scripts/angular.min.js',
    '/Scripts/app.js'
];


self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
