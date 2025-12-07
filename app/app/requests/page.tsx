'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  LogOut,
  Filter
} from 'lucide-react'
import Link from 'next/link'

interface Request {
  id: string
  source: string
  status: string
  pipelineStage: string
  rawContent: string
  category?: string | null
  urgency: string
  createdAt: string
}

export default function ClientRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'CLOSED'>('ALL')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      // TODO: Implementar API para obtener requerimientos del cliente
      // Por ahora mostramos un estado vacío
      setRequests([])
    } catch (error) {
      console.error('Error loading requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.rawContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = 
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && request.status !== 'closed') ||
      (filterStatus === 'CLOSED' && request.status === 'closed')

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'incomplete_information':
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      default:
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'new_request': 'Nueva Solicitud',
      'incomplete_information': 'Falta Información',
      'finding_suppliers': 'Buscando Proveedores',
      'quotes_in_progress': 'Cotizaciones en Proceso',
      'selecting_quote': 'Seleccionando Cotización',
      'purchase_in_progress': 'Orden de Compra',
      'delivered': 'Entregado',
      'closed': 'Cerrado',
      'completed': 'Completado',
      'cancelled': 'Cancelado',
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando requerimientos...</p>
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
            <div className="flex items-center gap-4">
              <Link
                href="/app/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Requerimientos</h1>
                <p className="text-gray-600 text-sm">Gestiona tus solicitudes de compra</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/app/requests/new"
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nuevo Requerimiento
              </Link>
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar requerimientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'ACTIVE' | 'CLOSED')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="CLOSED">Cerrados</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes requerimientos aún
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Crea tu primer requerimiento para solicitar productos o servicios que necesitas comprar.
              </p>
              <Link
                href="/app/requests/new"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Crear Requerimiento
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <Link href={`/app/requests/${request.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(request.status)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.category || 'Requerimiento sin categoría'}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            request.urgency === 'high' 
                              ? 'bg-red-100 text-red-800'
                              : request.urgency === 'medium'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {request.urgency === 'high' ? 'Alta' : request.urgency === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {request.rawContent.substring(0, 200)}
                          {request.rawContent.length > 200 ? '...' : ''}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{getStatusLabel(request.status)}</span>
                          <span>•</span>
                          <span>{getStatusLabel(request.pipelineStage)}</span>
                          <span>•</span>
                          <span>{new Date(request.createdAt).toLocaleDateString('es-MX')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

