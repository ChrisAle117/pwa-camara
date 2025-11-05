// ============================================
// SERVICE WORKER - Gestión de Caché (sw.js)
// ============================================

// 3.1. ⚙️ Variables de Configuración Inicial
const CACHE_NAME = 'camara-pwa-v1'; // Nombre/versión del caché
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json'
];

// ============================================
// 3.2. 📥 Evento install: Almacenamiento Inicial
// ============================================
self.addEventListener('install', function(event) {
    console.log('Service Worker instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
            .catch(function(error) {
                console.log('Error al cachear archivos:', error);
            })
    );
});

// ============================================
// 3.3. 🌐 Evento fetch: Estrategia Cache First
// ============================================
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Si se encuentra en caché, devolverlo
                if (response) {
                    return response;
                }
                // Si no está en caché, ir a la red
                return fetch(event.request);
            })
            .catch(function() {
                console.log('Error en fetch, usando caché si está disponible');
            })
    );
});

// ============================================
// 3.4. ♻️ Evento activate: Limpieza de Cachés Antiguos
// ============================================
self.addEventListener('activate', function(event) {
    console.log('Service Worker activando...');
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando caché anterior:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

console.log('✅ Service Worker cargado');
