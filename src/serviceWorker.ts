// Service Worker to bypass CORS
self.addEventListener('fetch', (event: any) => {
  if (event.request.mode === 'cors') {
    event.respondWith(
      fetch(event.request.url, {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
    );
  }
});