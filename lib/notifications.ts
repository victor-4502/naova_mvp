// Sistema de notificaciones básico para Naova

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionText?: string
  persistent?: boolean
}

export interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
}

class NotificationManager {
  private store: NotificationStore = {
    notifications: [],
    unreadCount: 0
  }
  private listeners: Array<(store: NotificationStore) => void> = []

  // Suscribirse a cambios en las notificaciones
  subscribe(listener: (store: NotificationStore) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Notificar a todos los listeners
  private notify() {
    this.listeners.forEach(listener => listener(this.store))
  }

  // Agregar una nueva notificación
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }

    this.store.notifications.unshift(newNotification)
    this.store.unreadCount++
    
    // Limitar a 50 notificaciones
    if (this.store.notifications.length > 50) {
      this.store.notifications = this.store.notifications.slice(0, 50)
    }

    this.notify()

    // Auto-remover notificaciones no persistentes después de 5 segundos
    if (!newNotification.persistent) {
      setTimeout(() => {
        this.removeNotification(newNotification.id)
      }, 5000)
    }

    return newNotification.id
  }

  // Marcar notificación como leída
  markAsRead(notificationId: string) {
    const notification = this.store.notifications.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      this.store.unreadCount = Math.max(0, this.store.unreadCount - 1)
      this.notify()
    }
  }

  // Marcar todas como leídas
  markAllAsRead() {
    this.store.notifications.forEach(notification => {
      notification.read = true
    })
    this.store.unreadCount = 0
    this.notify()
  }

  // Remover notificación
  removeNotification(notificationId: string) {
    const notification = this.store.notifications.find(n => n.id === notificationId)
    if (notification) {
      this.store.notifications = this.store.notifications.filter(n => n.id !== notificationId)
      if (!notification.read) {
        this.store.unreadCount = Math.max(0, this.store.unreadCount - 1)
      }
      this.notify()
    }
  }

  // Limpiar todas las notificaciones
  clearAll() {
    this.store.notifications = []
    this.store.unreadCount = 0
    this.notify()
  }

  // Obtener notificaciones no leídas
  getUnreadNotifications() {
    return this.store.notifications.filter(n => !n.read)
  }

  // Obtener todas las notificaciones
  getAllNotifications() {
    return this.store.notifications
  }

  // Obtener el estado actual
  getState() {
    return this.store
  }

  // Métodos de conveniencia para diferentes tipos de notificaciones
  success(title: string, message: string, options?: Partial<Notification>) {
    return this.addNotification({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  warning(title: string, message: string, options?: Partial<Notification>) {
    return this.addNotification({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  error(title: string, message: string, options?: Partial<Notification>) {
    return this.addNotification({
      type: 'error',
      title,
      message,
      persistent: true, // Los errores son persistentes por defecto
      ...options
    })
  }

  info(title: string, message: string, options?: Partial<Notification>) {
    return this.addNotification({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  // Notificaciones específicas del negocio
  tenderCreated(tenderTitle: string) {
    return this.success(
      'Licitación Creada',
      `La licitación "${tenderTitle}" ha sido creada exitosamente`,
      {
        actionUrl: '/app/tenders',
        actionText: 'Ver Licitaciones'
      }
    )
  }

  tenderActivated(tenderTitle: string) {
    return this.success(
      'Licitación Activada',
      `La licitación "${tenderTitle}" está ahora activa y disponible para proveedores`,
      {
        actionUrl: '/app/tenders',
        actionText: 'Ver Licitaciones'
      }
    )
  }

  newOfferReceived(tenderTitle: string, providerName: string) {
    return this.info(
      'Nueva Oferta Recibida',
      `"${providerName}" ha enviado una oferta para la licitación "${tenderTitle}"`,
      {
        actionUrl: '/app/tenders',
        actionText: 'Ver Ofertas'
      }
    )
  }

  priceAlert(productName: string, priceChange: number) {
    const isIncrease = priceChange > 0
    return this.warning(
      'Alerta de Precio',
      `El precio de "${productName}" ha ${isIncrease ? 'aumentado' : 'disminuido'} un ${Math.abs(priceChange).toFixed(1)}%`,
      {
        persistent: true
      }
    )
  }

  recommendationAvailable(recommendation: string) {
    return this.info(
      'Nueva Recomendación',
      recommendation,
      {
        actionUrl: '/app/reports',
        actionText: 'Ver Recomendaciones'
      }
    )
  }

  systemMaintenance(scheduledTime: string) {
    return this.warning(
      'Mantenimiento Programado',
      `El sistema estará en mantenimiento el ${scheduledTime}. Guarda tu trabajo.`,
      {
        persistent: true
      }
    )
  }

  userCreated(userName: string, userRole: string) {
    return this.success(
      'Usuario Creado',
      `Se ha creado el usuario "${userName}" con rol ${userRole}`,
      {
        actionUrl: '/admin/users',
        actionText: 'Ver Usuarios'
      }
    )
  }

  userStatusChanged(userName: string, isActive: boolean) {
    return this.info(
      'Estado de Usuario Cambiado',
      `El usuario "${userName}" ha sido ${isActive ? 'activado' : 'desactivado'}`,
      {
        actionUrl: '/admin/users',
        actionText: 'Ver Usuarios'
      }
    )
  }
}

// Instancia global del manager de notificaciones
export const notificationManager = new NotificationManager()

// Hook para usar notificaciones en componentes React
export function useNotifications() {
  const [store, setStore] = React.useState(notificationManager.getState())

  React.useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setStore)
    return unsubscribe
  }, [])

  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    markAsRead: (id: string) => notificationManager.markAsRead(id),
    markAllAsRead: () => notificationManager.markAllAsRead(),
    removeNotification: (id: string) => notificationManager.removeNotification(id),
    clearAll: () => notificationManager.clearAll(),
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => 
      notificationManager.addNotification(notification)
  }
}

// Importar React para el hook
import React from 'react'
