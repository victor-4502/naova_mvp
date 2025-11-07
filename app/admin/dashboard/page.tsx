'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, Gavel, TrendingUp, LogOut, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { appStore, type Tender } from '@/lib/store'

export default function AdminDashboard() {
  const [processingTenders, setProcessingTenders] = useState<Tender[]>([])
  const [totalClients, setTotalClients] = useState(0)
  const [currentUser, setCurrentUser] = useState<{name: string, email: string} | null>(null)

  useEffect(() => {
    // Obtener usuario actual
    const getCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setCurrentUser(userData)
        } else {
          setCurrentUser({ name: 'Admin', email: 'admin@naova.com' })
        }
      } catch (error) {
        console.error('Error getting current user:', error)
        setCurrentUser({ name: 'Admin', email: 'admin@naova.com' })
      }
    }
    getCurrentUser()

    // Cargar licitaciones en proceso
    const allTenders = appStore.getTenders()
    const processing = allTenders.filter(tender => tender.status === 'processing')
    setProcessingTenders(processing)

    // Cargar total de clientes
    const loadClients = async () => {
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          const clients = data.users.filter((user: any) => user.role === 'CLIENT')
          setTotalClients(clients.length)
        } else {
          setTotalClients(4) // Fallback a usuarios base
        }
      } catch (error) {
        console.error('Error loading clients:', error)
        setTotalClients(4) // Fallback a usuarios base
      }
    }
    loadClients()

    // Suscribirse a cambios
    const unsubscribe = appStore.subscribe(() => {
      const allTenders = appStore.getTenders()
      const processing = allTenders.filter(tender => tender.status === 'processing')
      setProcessingTenders(processing)
    })

    return unsubscribe
  }, [])

  const handleActivateTender = (tenderId: string) => {
    appStore.activateTender(tenderId)
    // Actualizar la lista local
    const allTenders = appStore.getTenders()
    const processing = allTenders.filter(tender => tender.status === 'processing')
    setProcessingTenders(processing)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Naova Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{currentUser?.email || 'admin@naova.com'}</span>
              <button 
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  window.location.href = '/login'
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Administrativo</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Volumen Total</p>
                  <p className="text-2xl font-bold text-gray-900">$2.4M</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <Gavel className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Licitaciones</p>
                  <p className="text-2xl font-bold text-gray-900">48</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ahorros</p>
                  <p className="text-2xl font-bold text-gray-900">$180K</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/clients">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Ver Reportes de Clientes
                </motion.button>
              </Link>
              <Link href="/admin/providers">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Gestionar Proveedores
                </motion.button>
              </Link>
              <Link href="/admin/reports">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Ver Reportes
                </motion.button>
              </Link>
              <Link href="/admin/users">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                >
                  Gestionar Usuarios
                </motion.button>
              </Link>
              <Link href="/admin/tenders">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Gestionar Licitaciones
                </motion.button>
              </Link>
              <Link href="/admin/audit">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Historial de Auditoría
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Back to Test */}
          <div className="mt-8 text-center">
            <Link href="/test">
              <span className="text-primary hover:text-purple-700 cursor-pointer">
                ← Volver a página de prueba
              </span>
            </Link>
          </div>

          {/* Licitaciones en Proceso */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Licitaciones en Proceso</h3>
              <div className="flex items-center gap-2 text-yellow-600">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">{processingTenders.length} pendientes</span>
              </div>
            </div>

            {processingTenders.length > 0 ? (
              <div className="space-y-4">
                {processingTenders.map((tender) => (
                  <motion.div
                    key={tender.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{tender.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Creada: {new Date(tender.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Vence: {new Date(tender.endAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500">
                            {tender.products?.length || 0} productos
                          </span>
                          <span className="text-sm text-gray-500">
                            Cliente: {tender.clientId}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleActivateTender(tender.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Activar Licitación
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No hay licitaciones en proceso
                </h4>
                <p className="text-gray-500">
                  Las licitaciones aparecerán aquí cuando los clientes las envíen para revisión.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}