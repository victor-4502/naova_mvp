'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Search, 
  Filter, 
  Download,
  ArrowLeft,
  LogOut,
  User,
  Calendar,
  Activity,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface AuditLog {
  id: string
  action: string
  userId: string
  userName: string
  userEmail: string
  metadata: any
  ipAddress: string
  createdAt: string
}

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('ALL')
  const [filterUser, setFilterUser] = useState('ALL')

  // Datos simulados para desarrollo
  const mockAuditLogs: AuditLog[] = [
    {
      id: 'audit-001',
      action: 'login',
      userId: 'client-001',
      userName: 'Industrias ABC',
      userEmail: 'juan@abc.com',
      metadata: { ip: '192.168.1.100', userAgent: 'Chrome/120.0' },
      ipAddress: '192.168.1.100',
      createdAt: '2024-05-25T10:30:00Z'
    },
    {
      id: 'audit-002',
      action: 'create_requirement',
      userId: 'client-001',
      userName: 'Industrias ABC',
      userEmail: 'juan@abc.com',
      metadata: { requirementId: 'req-001', title: 'Tornillos M8' },
      ipAddress: '192.168.1.100',
      createdAt: '2024-05-25T10:35:00Z'
    },
    {
      id: 'audit-003',
      action: 'create_tender',
      userId: 'admin-001',
      userName: 'Admin Principal',
      userEmail: 'admin@naova.com',
      metadata: { tenderId: 'tender-001', clientId: 'client-001' },
      ipAddress: '192.168.1.200',
      createdAt: '2024-05-25T11:00:00Z'
    },
    {
      id: 'audit-004',
      action: 'activate_tender',
      userId: 'admin-001',
      userName: 'Admin Principal',
      userEmail: 'admin@naova.com',
      metadata: { tenderId: 'tender-001', status: 'active' },
      ipAddress: '192.168.1.200',
      createdAt: '2024-05-25T11:05:00Z'
    },
    {
      id: 'audit-005',
      action: 'create_user',
      userId: 'admin-001',
      userName: 'Admin Principal',
      userEmail: 'admin@naova.com',
      metadata: { newUserId: 'client-004', newUserEmail: 'ana@fabrica.com' },
      ipAddress: '192.168.1.200',
      createdAt: '2024-05-25T14:20:00Z'
    },
    {
      id: 'audit-006',
      action: 'logout',
      userId: 'client-001',
      userName: 'Industrias ABC',
      userEmail: 'juan@abc.com',
      metadata: { sessionDuration: '2h 15m' },
      ipAddress: '192.168.1.100',
      createdAt: '2024-05-25T16:45:00Z'
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setAuditLogs(mockAuditLogs)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = filterAction === 'ALL' || log.action === filterAction
    const matchesUser = filterUser === 'ALL' || log.userId === filterUser
    
    return matchesSearch && matchesAction && matchesUser
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <User className="h-4 w-4 text-green-500" />
      case 'logout': return <User className="h-4 w-4 text-gray-500" />
      case 'create_requirement': return <Activity className="h-4 w-4 text-blue-500" />
      case 'create_tender': return <Activity className="h-4 w-4 text-purple-500" />
      case 'activate_tender': return <Activity className="h-4 w-4 text-orange-500" />
      case 'create_user': return <User className="h-4 w-4 text-indigo-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'bg-green-100 text-green-800'
      case 'logout': return 'bg-gray-100 text-gray-800'
      case 'create_requirement': return 'bg-blue-100 text-blue-800'
      case 'create_tender': return 'bg-purple-100 text-purple-800'
      case 'activate_tender': return 'bg-orange-100 text-orange-800'
      case 'create_user': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatAction = (action: string) => {
    const actionMap: { [key: string]: string } = {
      'login': 'Inicio de sesión',
      'logout': 'Cierre de sesión',
      'create_requirement': 'Crear requerimiento',
      'create_tender': 'Crear licitación',
      'activate_tender': 'Activar licitación',
      'create_user': 'Crear usuario',
      'update_user': 'Actualizar usuario',
      'delete_user': 'Eliminar usuario'
    }
    return actionMap[action] || action
  }

  const uniqueActions = [...new Set(auditLogs.map(log => log.action))]
  const uniqueUsers = [...new Set(auditLogs.map(log => ({ id: log.userId, name: log.userName })))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial de auditoría...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Historial de Auditoría</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  // TODO: Implementar exportación de auditoría
                  console.log('Exporting audit logs...')
                }}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Exportar
              </button>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Eventos</p>
                <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueUsers.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tipos de Acción</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueActions.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {auditLogs.filter(log => 
                    new Date(log.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Acción, usuario o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Acción
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="ALL">Todas las acciones</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>
                    {formatAction(action)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="ALL">Todos los usuarios</option>
                {uniqueUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getActionIcon(log.action)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                          {formatAction(log.action)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                        <div className="text-sm text-gray-500">{log.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {log.metadata && Object.keys(log.metadata).length > 0 ? (
                          <div className="space-y-1">
                            {Object.entries(log.metadata).map(([key, value]) => (
                              <div key={key} className="text-xs">
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Sin detalles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          // TODO: Implementar vista detallada
                          console.log('View details for:', log.id)
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron registros</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </main>
    </div>
  )
}
