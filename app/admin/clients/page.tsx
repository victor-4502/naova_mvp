'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Edit, 
  Search,
  ArrowLeft,
  Mail,
  Phone,
  Building,
  CheckCircle,
  XCircle,
  Calendar,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface Client {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  active: boolean
  plan?: string
  trialEndsAt?: string
  requirementsCount: number
  contacts: Array<{
    id: string
    type: string
    value: string
    label?: string
    isPrimary: boolean
    verified: boolean
  }>
  createdAt: string
}

export default function ClientsManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/clients', {
        headers: {
          'x-user-role': 'admin',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients || [])
      } else {
        console.error('Error loading clients')
      }
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleClientStatus = async (clientId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/clients', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
        },
        body: JSON.stringify({
          clientId,
          active: !currentStatus,
        }),
      })

      if (response.ok) {
        await loadClients()
      } else {
        alert('Error al actualizar el cliente')
      }
    } catch (error) {
      console.error('Error updating client:', error)
      alert('Error al actualizar el cliente')
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = 
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && client.active) ||
      (filterStatus === 'INACTIVE' && !client.active)

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-max py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
                <p className="text-gray-600 mt-1">Administra y visualiza todos los clientes</p>
              </div>
            </div>
            <Link
              href="/admin/create-client"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Crear Cliente
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-max py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Clientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{clients.length}</p>
              </div>
              <Users className="h-12 w-12 text-primary opacity-20" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Clientes Activos</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {clients.filter(c => c.active).length}
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Requerimientos</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {clients.reduce((sum, c) => sum + c.requirementsCount, 0)}
                </p>
              </div>
              <FileText className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Clients List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No se encontraron clientes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requerimientos
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{client.name}</p>
                          {client.company && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Building className="h-3 w-3" />
                              {client.company}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {client.email}
                          </p>
                          {client.contacts && client.contacts.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {client.contacts.length} contacto(s)
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {client.plan || 'Sin plan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{client.requirementsCount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleClientStatus(client.id, client.active)}
                          className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                            client.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {client.active ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              Activo
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              Inactivo
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.createdAt).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="text-primary hover:text-purple-700 mr-4"
                        >
                          Ver Detalles
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

