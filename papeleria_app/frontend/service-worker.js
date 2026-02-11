self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("papeleria-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./app.js"
      ]);
    })
  );
});
