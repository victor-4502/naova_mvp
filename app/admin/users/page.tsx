'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  Filter,
  ArrowLeft,
  LogOut,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Building,
  X
} from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: 'admin_naova' | 'operator_naova' | 'client_enterprise'
  isActive: boolean
  company?: string
  phone?: string
  createdAt: string
  lastLogin?: string
  totalLicitaciones: number
  totalAhorro: number
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'ALL' | 'admin_naova' | 'operator_naova' | 'client_enterprise'>('ALL')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
  
  // Estados para el formulario de creación
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client_enterprise' as 'admin_naova' | 'operator_naova' | 'client_enterprise',
    company: '',
    phone: ''
  })
  const [creating, setCreating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Estados para el formulario de edición
  const [editingUser, setEditingUser] = useState({
    name: '',
    email: '',
    role: 'client_enterprise' as 'admin_naova' | 'operator_naova' | 'client_enterprise',
    company: '',
    phone: '',
    isActive: true
  })
  const [updating, setUpdating] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [resettingPassword, setResettingPassword] = useState(false)
  const [showPasswordField, setShowPasswordField] = useState(false)

  // Estados para gestión de contactos
  const [userContacts, setUserContacts] = useState<Array<{
    id: string
    type: 'email' | 'phone'
    value: string
    label?: string
    isPrimary: boolean
    verified: boolean
  }>>([])
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactType, setContactType] = useState<'email' | 'phone'>('email')
  const [newContact, setNewContact] = useState({
    value: '',
    label: '',
    isPrimary: false
  })

  // Datos simulados para desarrollo
  const mockUsers: User[] = [
    {
      id: 'admin-001',
      name: 'Admin Principal',
      email: 'admin@naova.com',
      role: 'admin_naova',
      isActive: true,
      company: 'Naova Corp',
      phone: '+1 (555) 123-4567',
      createdAt: '2024-01-15',
      lastLogin: '2024-05-25',
      totalLicitaciones: 0,
      totalAhorro: 0
    },
    {
      id: 'client-001',
      name: 'Industrias ABC',
      email: 'juan@abc.com',
      role: 'client_enterprise',
      isActive: true,
      company: 'Industrias ABC S.A.',
      phone: '+1 (555) 234-5678',
      createdAt: '2024-02-10',
      lastLogin: '2024-05-25',
      totalLicitaciones: 12,
      totalAhorro: 5500
    },
    {
      id: 'client-002',
      name: 'Construcciones XYZ',
      email: 'maria@xyz.com',
      role: 'client_enterprise',
      isActive: true,
      company: 'Construcciones XYZ Ltda.',
      phone: '+1 (555) 345-6789',
      createdAt: '2024-03-05',
      lastLogin: '2024-05-24',
      totalLicitaciones: 8,
      totalAhorro: 3200
    },
    {
      id: 'client-003',
      name: 'Metalúrgica 123',
      email: 'carlos@metal123.com',
      role: 'client_enterprise',
      isActive: false,
      company: 'Metalúrgica 123 S.A.',
      phone: '+1 (555) 456-7890',
      createdAt: '2024-03-20',
      lastLogin: '2024-05-15',
      totalLicitaciones: 5,
      totalAhorro: 1800
    },
    {
      id: 'client-004',
      name: 'Fábrica DEF',
      email: 'ana@fabrica.com',
      role: 'client_enterprise',
      isActive: true,
      company: 'Fábrica DEF S.A.',
      phone: '+1 (555) 567-8901',
      createdAt: '2024-04-10',
      lastLogin: '2024-05-23',
      totalLicitaciones: 6,
      totalAhorro: 2400
    }
  ]

  useEffect(() => {
    // Cargar usuarios desde el servidor
    const loadUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
        } else {
          setUsers(mockUsers)
        }
      } catch (error) {
        console.error('Error loading users:', error)
        setUsers(mockUsers)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'ALL' || user.role === filterRole
    const matchesStatus = filterStatus === 'ALL' || 
                         (filterStatus === 'ACTIVE' && user.isActive) ||
                         (filterStatus === 'INACTIVE' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = () => {
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'client_enterprise',
      company: '',
      phone: ''
    })
    setShowCreateModal(true)
  }

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      // Validar campos requeridos
      if (!newUser.name || !newUser.email || !newUser.password) {
        alert('Por favor completa todos los campos requeridos')
        return
      }

      // Crear usuario via API
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear usuario')
      }

      // Agregar a la lista de usuarios local
      const newUserData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        isActive: true,
        company: data.user.company,
        phone: data.user.phone,
        createdAt: data.user.createdAt,
        lastLogin: undefined,
        totalLicitaciones: 0,
        totalAhorro: 0
      }

      setUsers(prev => [...prev, newUserData])
      
      // Cerrar modal y limpiar formulario
      setShowCreateModal(false)
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'client_enterprise',
        company: '',
        phone: ''
      })

      alert(`✅ Usuario creado exitosamente!\n\nEmail: ${newUser.email}\nContraseña: ${newUser.password}\n\nGuarda estas credenciales para el login.`)
      
    } catch (error) {
      console.error('Error creating user:', error)
      alert(`Error al crear el usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setCreating(false)
    }
  }

  const handleNewUserChange = (field: string, value: string) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEditUser = async (user: User) => {
    setSelectedUser(user)
    setEditingUser({
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company || '',
      phone: user.phone || '',
      isActive: user.isActive
    })
    // Cargar contactos del usuario
    await loadUserContacts(user.id)
    setShowEditModal(true)
  }

  const loadUserContacts = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/clients/${userId}/contacts`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setUserContacts(data.contacts || [])
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
      setUserContacts([])
    }
  }

  const handleAddContact = (type: 'email' | 'phone') => {
    setContactType(type)
    setNewContact({
      value: '',
      label: '',
      isPrimary: false
    })
    setShowContactModal(true)
  }

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    // Validar formato
    if (contactType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContact.value)) {
      alert('Email inválido')
      return
    }

    try {
      console.log('Agregando contacto:', {
        userId: selectedUser.id,
        type: contactType,
        value: newContact.value,
        label: newContact.label,
        isPrimary: newContact.isPrimary
      })

      const response = await fetch(`/api/admin/clients/${selectedUser.id}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: contactType,
          value: newContact.value,
          label: newContact.label || undefined,
          isPrimary: newContact.isPrimary,
        }),
      })

      const data = await response.json()
      console.log('Respuesta del servidor:', data)

      if (!response.ok) {
        console.error('Error del servidor:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        })
        const errorMessage = data.error || data.details || `Error al agregar contacto (${response.status})`
        throw new Error(errorMessage)
      }

      console.log('Contacto creado exitosamente:', data.contact)
      
      // Verificar que el contacto tiene ID
      if (!data.contact || !data.contact.id) {
        console.warn('⚠️ Contacto creado pero sin ID:', data)
        throw new Error('El contacto se creó pero no se recibió el ID. Verifica en Supabase.')
      }

      // Recargar contactos
      await loadUserContacts(selectedUser.id)
      setShowContactModal(false)
      setNewContact({ value: '', label: '', isPrimary: false })
      alert('✅ Contacto agregado exitosamente')
    } catch (error) {
      console.error('Error adding contact:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}\n\nRevisa la consola del navegador para más detalles.`)
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!selectedUser) return
    if (!confirm('¿Estás seguro de eliminar este contacto?')) return

    try {
      const response = await fetch(`/api/admin/clients/${selectedUser.id}/contacts/${contactId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        await loadUserContacts(selectedUser.id)
        alert('✅ Contacto eliminado exitosamente')
      } else {
        alert('Error al eliminar contacto')
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      alert('Error al eliminar contacto')
    }
  }

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    setUpdating(true)

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar usuario')
      }

      // Actualizar la lista de usuarios local
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...editingUser }
          : user
      ))

      // Cerrar modal
      setShowEditModal(false)
      setSelectedUser(null)

      alert('✅ Usuario actualizado exitosamente')
      
    } catch (error) {
      console.error('Error updating user:', error)
      alert(`Error al actualizar el usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setUpdating(false)
    }
  }

  const handleEditUserChange = (field: string, value: string | boolean) => {
    setEditingUser(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateRandomPassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    const password = Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map(x => charset[x % charset.length])
      .join('')
    setNewPassword(password)
    setGeneratedPassword(password)
    return password
  }

  const handleResetPassword = async () => {
    if (!selectedUser) return

    setResettingPassword(true)

    try {
      // Si no hay contraseña, el servidor la generará automáticamente
      const response = await fetch(`/api/admin/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          newPassword: newPassword || undefined,
          generatePassword: !newPassword, // Si no hay contraseña, generar automáticamente
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || 'Error al resetear contraseña'
        const errorDetails = data.details ? `\n\nDetalles: ${data.details}` : ''
        throw new Error(errorMessage + errorDetails)
      }

      // Mostrar la nueva contraseña
      const finalPassword = data.newPassword || generatedPassword || newPassword
      setGeneratedPassword(finalPassword)
      setNewPassword(finalPassword)
      setShowPasswordField(true)

      alert(`✅ Contraseña actualizada exitosamente!\n\nNueva contraseña: ${finalPassword}\n\n⚠️ Guarda esta contraseña, no se volverá a mostrar.`)
    } catch (error) {
      console.error('Error resetting password:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setResettingPassword(false)
    }
  }

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isActive: !user.isActive }
            : user
        ))
        alert(`Usuario ${!user.isActive ? 'activado' : 'desactivado'} exitosamente`)
      } else {
        alert('Error al cambiar el estado del usuario')
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('Error al cambiar el estado del usuario')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId))
          alert('Usuario eliminado exitosamente')
        } else {
          alert('Error al eliminar el usuario')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error al eliminar el usuario')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateUser}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nuevo Usuario
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
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.isActive).length}
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
              <UserX className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactivos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => !u.isActive).length}
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
              <Building className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'client_enterprise').length}
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
                  placeholder="Nombre, email o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="ALL">Todos los roles</option>
                <option value="admin_naova">Administradores Naova</option>
                <option value="operator_naova">Operadores Naova</option>
                <option value="client_enterprise">Clientes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="ALL">Todos los estados</option>
                <option value="ACTIVE">Activos</option>
                <option value="INACTIVE">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.company || 'N/A'}</div>
                      {user.phone && (
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin_naova' || user.role === 'operator_naova'
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin_naova' || user.role === 'operator_naova' ? 'Administrador' : 'Cliente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Último acceso: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}</div>
                      <div>Licitaciones: {user.totalLicitaciones}</div>
                      <div>Ahorro: ${(user.totalAhorro || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar usuario"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={user.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                          title={user.isActive ? "Desactivar usuario" : "Activar usuario"}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nuevo Usuario</h3>
            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => handleNewUserChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => handleNewUserChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="usuario@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newUser.password}
                    onChange={(e) => handleNewUserChange('password', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">La contraseña se mostrará al crear el usuario</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => handleNewUserChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="client_enterprise">Cliente</option>
                  <option value="admin_naova">Administrador Naova</option>
                  <option value="operator_naova">Operador Naova</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  value={newUser.company}
                  onChange={(e) => handleNewUserChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => handleNewUserChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creando...
                    </>
                  ) : (
                    'Crear Usuario'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Usuario</h3>
            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => handleEditUserChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => handleEditUserChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="usuario@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => handleEditUserChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="client_enterprise">Cliente</option>
                  <option value="admin_naova">Administrador Naova</option>
                  <option value="operator_naova">Operador Naova</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  value={editingUser.company}
                  onChange={(e) => handleEditUserChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={editingUser.phone}
                  onChange={(e) => handleEditUserChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingUser.isActive}
                    onChange={(e) => handleEditUserChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Usuario activo</span>
                </label>
              </div>

              {/* Resetear Contraseña */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">Contraseña</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetPassword(!showResetPassword)
                      if (!showResetPassword) {
                        setNewPassword('')
                        setGeneratedPassword('')
                        setShowPasswordField(false)
                      }
                    }}
                    className="text-xs text-purple-600 hover:text-purple-700"
                  >
                    {showResetPassword ? 'Cancelar' : 'Resetear Contraseña'}
                  </button>
                </div>
                
                {showResetPassword && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded border border-gray-200">
                    {showPasswordField && generatedPassword && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-xs font-medium text-green-800 mb-1">Nueva contraseña generada:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-white px-2 py-1 rounded border flex-1">
                            {generatedPassword}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedPassword)
                              alert('Contraseña copiada al portapapeles')
                            }}
                            className="text-xs text-green-700 hover:text-green-900"
                          >
                            Copiar
                          </button>
                        </div>
                        <p className="text-xs text-green-600 mt-2">⚠️ Guarda esta contraseña, no se volverá a mostrar.</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nueva contraseña (opcional - se generará automáticamente si está vacío)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Dejar vacío para generar automáticamente"
                          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={generateRandomPassword}
                          className="text-xs px-2 py-1.5 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          Generar
                        </button>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={resettingPassword}
                      className="w-full text-xs px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      {resettingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                  </div>
                )}
              </div>

              {/* Gestión de Contactos - Solo para clientes */}
              {editingUser.role === 'client_enterprise' && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Contactos del Cliente</h4>
                  
                  {/* Emails */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Emails ({userContacts.filter(c => c.type === 'email').length + 1}/6)
                        </span>
                        <span className="text-xs text-gray-400">(1 principal + hasta 5 adicionales)</span>
                      </div>
                      {userContacts.filter(c => c.type === 'email').length < 5 && (
                        <button
                          type="button"
                          onClick={() => handleAddContact('email')}
                          className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Agregar Email
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {/* Email principal del usuario (de la tabla User) */}
                      <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-200 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{editingUser.email}</span>
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded">Principal</span>
                          <span className="text-xs text-gray-500">(Login)</span>
                        </div>
                        <span className="text-xs text-gray-400">Tabla: User</span>
                      </div>
                      {/* Emails adicionales (de la tabla ClientContact) */}
                      {userContacts.filter(c => c.type === 'email').map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 text-sm">
                          <div className="flex items-center gap-2">
                            <span>{contact.value}</span>
                            {contact.label && <span className="text-xs text-gray-500">({contact.label})</span>}
                            {contact.isPrimary && <span className="text-xs text-purple-600 bg-purple-100 px-1 rounded">Principal</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Tabla: ClientContact</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteContact(contact.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {userContacts.filter(c => c.type === 'email').length === 0 && (
                        <p className="text-xs text-gray-400 italic pl-2">No hay emails adicionales</p>
                      )}
                    </div>
                  </div>

                  {/* Teléfonos */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Teléfonos ({userContacts.filter(c => c.type === 'phone').length + (editingUser.phone ? 1 : 0)}/6)
                        </span>
                        <span className="text-xs text-gray-400">(1 principal + hasta 5 adicionales)</span>
                      </div>
                      {userContacts.filter(c => c.type === 'phone').length < 5 && (
                        <button
                          type="button"
                          onClick={() => handleAddContact('phone')}
                          className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Agregar Teléfono
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {/* Teléfono principal del usuario (de la tabla User) */}
                      {editingUser.phone && (
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-200 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{editingUser.phone}</span>
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded">Principal</span>
                          </div>
                          <span className="text-xs text-gray-400">Tabla: User</span>
                        </div>
                      )}
                      {/* Teléfonos adicionales (de la tabla ClientContact) */}
                      {userContacts.filter(c => c.type === 'phone').map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 text-sm">
                          <div className="flex items-center gap-2">
                            <span>{contact.value}</span>
                            {contact.label && <span className="text-xs text-gray-500">({contact.label})</span>}
                            {contact.isPrimary && <span className="text-xs text-purple-600 bg-purple-100 px-1 rounded">Principal</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Tabla: ClientContact</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteContact(contact.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {!editingUser.phone && userContacts.filter(c => c.type === 'phone').length === 0 && (
                        <p className="text-xs text-gray-400 italic pl-2">No hay teléfonos registrados</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedUser(null)
                  }}
                  disabled={updating}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Actualizando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showContactModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Agregar {contactType === 'email' ? 'Email' : 'Teléfono'}
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {contactType === 'email' ? 'Email' : 'Teléfono'} <span className="text-red-500">*</span>
                </label>
                <input
                  type={contactType === 'email' ? 'email' : 'tel'}
                  required
                  value={newContact.value}
                  onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder={contactType === 'email' ? 'email@ejemplo.com' : '+1 (555) 123-4567'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etiqueta (opcional)
                </label>
                <input
                  type="text"
                  value={newContact.label}
                  onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Trabajo, Personal, WhatsApp"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newContact.isPrimary}
                    onChange={(e) => setNewContact({ ...newContact, isPrimary: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Marcar como principal</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Si se marca como principal, este será el contacto principal de este tipo
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
