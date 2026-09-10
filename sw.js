var CACHE='minasa-v3';
var FILES=['./','./index.html','./manifest.webmanifest','./og.jpg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(x){return x!==CACHE;}).map(function(x){return caches.delete(x);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(function(hit){
    return hit || fetch(e.request).then(function(r){
      var c=r.clone(); caches.open(CACHE).then(function(x){x.put(e.request,c);}); return r;
    }).catch(function(){ return caches.match('./index.html'); });
  }));
});
