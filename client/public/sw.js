self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || 'Habityn Reminder'
  const options = {
    body: data.body || 'Time to check in on your habits!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: data.tag || 'habityn-reminder',
    data: { url: data.url || '/' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  )
})
