import { useState, useCallback } from 'react'
import { NotificationContext } from './NotificationContext'
import { useNotification } from './useNotification'

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const notify = useCallback((message, type = 'success') => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setNotifications(prev => [...prev.slice(-4), { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, notify, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="notification-container" aria-live="polite" aria-atomic="true">
      {notifications.map(n => (
        <div key={n.id} className={`notification notification-${n.type}`} role="alert">
          <span>{n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : 'ℹ'} {n.message}</span>
          <button onClick={() => removeNotification(n.id)} aria-label="Dismiss notification" className="notification-close">&times;</button>
        </div>
      ))}
    </div>
  )
}
