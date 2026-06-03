import api from '../lib/api'
import { getDeviceId } from '../lib/deviceId'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return false
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export async function subscribeHabitReminder(habitId: string, reminderTime: string) {
  const reg = await navigator.serviceWorker.ready
  const existing = await reg.pushManager.getSubscription()
  const subscription = existing ?? await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  })
  await api.post('/notifications/subscribe', {
    deviceId: getDeviceId(),
    habitId,
    subscription: subscription.toJSON(),
    reminderTime,
  })
}

export async function unsubscribeHabitReminder(habitId: string) {
  await api.delete(`/notifications/subscribe/${habitId}`)
}

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  try {
    await navigator.serviceWorker.register('/sw.js')
  } catch {
    // sw registration is non-critical
  }
}
