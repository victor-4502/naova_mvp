'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  Clock,
  FileText,
  Gavel,
  ArrowRight,
  LogOut,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalAhorros: number
  totalCompras: number
  proveedoresActivos: number
  crecimientoMensual: number
  requerimientosActivos: number
  licitacionesActivas: number
}

export default function ClientDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAhorros: 0,
    totalCompras: 0,
    proveedoresActivos: 0,
    crecimientoMensual: 0,
    requerimientosActivos: 0,
    licitacionesActivas: 0,
  })
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{name: string, email: string} | null>(null)

  useEffect(() => {
    // Obtener usuario actual
    const getCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setCurrentUser(userData)
        }
      } catch (error) {
        console.error('Error getting current user:', error)
      }
    }

    // Cargar estadísticas
    const loadStats = async () => {
      try {
        setLoading(true)
        // TODO: Implementar API para obtener estadísticas del cliente
        // Por ahora usamos valores por defecto
        setStats({
          totalAhorros: 125000,
          totalCompras: 48,
          proveedoresActivos: 12,
          crecimientoMensual: 15,
          requerimientosActivos: 3,
          licitacionesActivas: 5,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    getCurrentUser()
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Naova Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{currentUser?.email || 'cliente@naova.com'}</span>
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Bienvenido, {currentUser?.name || 'Cliente'}!
            </h2>
            <p className="text-gray-600">Gestiona tus compras y requerimientos desde aquí</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ahorros Totales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalAhorros.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Compras</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCompras}</p>
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
                  <p className="text-sm font-medium text-gray-600">Crecimiento</p>
                  <p className="text-2xl font-bold text-gray-900">
                    +{stats.crecimientoMensual}%
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Proveedores Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.proveedoresActivos}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/app/requests">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Crear Requerimiento
                      </h4>
                      <p className="text-sm text-gray-600">
                        Solicita nuevos productos o servicios
                      </p>
                    </div>
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/app/tenders">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Ver Licitaciones
                      </h4>
                      <p className="text-sm text-gray-600">
                        {stats.licitacionesActivas} licitaciones activas
                      </p>
                    </div>
                    <Gavel className="h-8 w-8 text-blue-500" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/app/reports">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Ver Reportes
                      </h4>
                      <p className="text-sm text-gray-600">
                        Análisis y estadísticas de compras
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-green-500" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Active Requests Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Requerimientos Activos</h3>
              <Link 
                href="/app/requests"
                className="text-primary hover:text-purple-700 flex items-center gap-2 text-sm font-medium"
              >
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-gray-600">
              Tienes <strong>{stats.requerimientosActivos}</strong> requerimientos en proceso.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

