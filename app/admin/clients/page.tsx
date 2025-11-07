'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Eye, 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  ArrowLeft,
  LogOut,
  Search,
  Filter,
  Calendar,
  Building2,
  FileText,
  X
} from 'lucide-react'
import Link from 'next/link'

interface Client {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  createdAt: string
  lastLogin?: string
  totalLicitaciones: number
  totalAhorro: number
  licitacionesActivas: number
  licitacionesCerradas: number
  promedioAhorro: number
  productosMasComprados: Array<{
    producto: string
    cantidad: number
    monto: number
  }>
  tendenciaAhorro: number
  ultimaActividad: string
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showClientReport, setShowClientReport] = useState(false)

  // Datos simulados para desarrollo
  const mockClients: Client[] = [
    {
      id: 'client-001',
      name: 'Juan Pérez',
      email: 'juan@abc.com',
      company: 'Industrias ABC S.A.',
      phone: '+1 (555) 234-5678',
      createdAt: '2024-02-10',
      lastLogin: '2024-05-25',
      totalLicitaciones: 12,
      totalAhorro: 5500,
      licitacionesActivas: 2,
      licitacionesCerradas: 10,
      promedioAhorro: 15.2,
      productosMasComprados: [
        { producto: 'Tornillos M8', cantidad: 5000, monto: 2500 },
        { producto: 'Láminas de Acero', cantidad: 100, monto: 8000 },
        { producto: 'Pintura Industrial', cantidad: 50, monto: 3000 }
      ],
      tendenciaAhorro: 8.5,
      ultimaActividad: '2024-05-25'
    },
    {
      id: 'client-002',
      name: 'María González',
      email: 'maria@xyz.com',
      company: 'Construcciones XYZ Ltda.',
      phone: '+1 (555) 345-6789',
      createdAt: '2024-03-05',
      lastLogin: '2024-05-24',
      totalLicitaciones: 8,
      totalAhorro: 3200,
      licitacionesActivas: 1,
      licitacionesCerradas: 7,
      promedioAhorro: 12.8,
      productosMasComprados: [
        { producto: 'Cemento Portland', cantidad: 200, monto: 4000 },
        { producto: 'Varillas de Acero', cantidad: 1000, monto: 6000 },
        { producto: 'Arena Fina', cantidad: 50, monto: 1500 }
      ],
      tendenciaAhorro: 5.2,
      ultimaActividad: '2024-05-24'
    },
    {
      id: 'client-003',
      name: 'Carlos Rodríguez',
      email: 'carlos@metal123.com',
      company: 'Metalúrgica 123 S.A.',
      phone: '+1 (555) 456-7890',
      createdAt: '2024-03-20',
      lastLogin: '2024-05-15',
      totalLicitaciones: 5,
      totalAhorro: 1800,
      licitacionesActivas: 0,
      licitacionesCerradas: 5,
      promedioAhorro: 9.5,
      productosMasComprados: [
        { producto: 'Perfiles de Aluminio', cantidad: 200, monto: 5000 },
        { producto: 'Soldadura MIG', cantidad: 100, monto: 2000 },
        { producto: 'Herramientas de Corte', cantidad: 50, monto: 3000 }
      ],
      tendenciaAhorro: -2.1,
      ultimaActividad: '2024-05-15'
    },
    {
      id: 'client-004',
      name: 'Ana Martínez',
      email: 'ana@fabrica.com',
      company: 'Fábrica DEF S.A.',
      phone: '+1 (555) 567-8901',
      createdAt: '2024-04-10',
      lastLogin: '2024-05-23',
      totalLicitaciones: 6,
      totalAhorro: 2400,
      licitacionesActivas: 1,
      licitacionesCerradas: 5,
      promedioAhorro: 11.3,
      productosMasComprados: [
        { producto: 'Componentes Electrónicos', cantidad: 1000, monto: 8000 },
        { producto: 'Cables de Cobre', cantidad: 500, monto: 3000 },
        { producto: 'Placas de Circuito', cantidad: 200, monto: 4000 }
      ],
      tendenciaAhorro: 12.8,
      ultimaActividad: '2024-05-23'
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setClients(mockClients)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleViewClientReport = (client: Client) => {
    setSelectedClient(client)
    setShowClientReport(true)
  }

  const getTendenciaColor = (tendencia: number) => {
    if (tendencia > 0) return 'text-green-600'
    if (tendencia < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getTendenciaIcon = (tendencia: number) => {
    if (tendencia > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (tendencia < 0) return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
    return <TrendingUp className="h-4 w-4 text-gray-600" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">admin@naova.com</span>
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
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Licitaciones Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((acc, c) => acc + c.totalLicitaciones, 0)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ahorro Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${clients.reduce((acc, c) => acc + c.totalAhorro, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio Ahorro</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(clients.reduce((acc, c) => acc + c.promedioAhorro, 0) / clients.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Clients List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ahorro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                              {client.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.company}</div>
                      {client.phone && (
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{client.totalLicitaciones} licitaciones</div>
                      <div>{client.licitacionesActivas} activas</div>
                      <div>Última: {new Date(client.ultimaActividad).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${client.totalAhorro.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.promedioAhorro}% promedio
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTendenciaIcon(client.tendenciaAhorro)}
                        <span className={`ml-1 text-sm font-medium ${getTendenciaColor(client.tendenciaAhorro)}`}>
                          {client.tendenciaAhorro > 0 ? '+' : ''}{client.tendenciaAhorro}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewClientReport(client)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                        title="Ver reporte detallado"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Reporte
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
            <p className="text-gray-500">Intenta ajustar los términos de búsqueda</p>
          </div>
        )}
      </main>

      {/* Client Report Modal */}
      {showClientReport && selectedClient && (
        <ClientReportModal
          client={selectedClient}
          onClose={() => setShowClientReport(false)}
        />
      )}
    </div>
  )
}

// Client Report Modal Component
function ClientReportModal({ 
  client, 
  onClose 
}: { 
  client: Client
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Reporte Detallado - {client.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Información del Cliente</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Empresa:</strong> {client.company}</div>
              <div><strong>Email:</strong> {client.email}</div>
              <div><strong>Teléfono:</strong> {client.phone || 'No disponible'}</div>
              <div><strong>Cliente desde:</strong> {new Date(client.createdAt).toLocaleDateString()}</div>
              <div><strong>Último acceso:</strong> {client.lastLogin ? new Date(client.lastLogin).toLocaleDateString() : 'Nunca'}</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Métricas de Actividad</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Total Licitaciones:</strong> {client.totalLicitaciones}</div>
              <div><strong>Licitaciones Activas:</strong> {client.licitacionesActivas}</div>
              <div><strong>Licitaciones Cerradas:</strong> {client.licitacionesCerradas}</div>
              <div><strong>Última Actividad:</strong> {new Date(client.ultimaActividad).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-green-900">Ahorro Total</h4>
            <p className="text-2xl font-bold text-green-600">${client.totalAhorro.toLocaleString()}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-900">Promedio de Ahorro</h4>
            <p className="text-2xl font-bold text-blue-600">{client.promedioAhorro}%</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-purple-900">Tendencia</h4>
            <p className="text-2xl font-bold text-purple-600">
              {client.tendenciaAhorro > 0 ? '+' : ''}{client.tendenciaAhorro}%
            </p>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Productos Más Comprados</h4>
          <div className="space-y-3">
            {client.productosMasComprados.map((producto, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{producto.producto}</p>
                    <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${producto.monto.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              // TODO: Implementar exportación de reporte
              console.log('Exporting client report...')
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Exportar Reporte
          </button>
        </div>
      </div>
    </div>
  )
}