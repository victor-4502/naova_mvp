'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Star, LogOut } from 'lucide-react'
import Link from 'next/link'

interface Provider {
  id: string
  name: string
  category: string
  contact: string | null
  email: string | null
  phone: string | null
  rating: number
  active: boolean
  createdAt: string
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - implement API endpoint later
    setTimeout(() => {
      setProviders([
        {
          id: '1',
          name: 'Proveedor Industrial ABC',
          category: 'supplies',
          contact: 'Juan Pérez',
          email: 'ventas@abc.com',
          phone: '+52 (555) 111-1111',
          rating: 4.5,
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Electrónica XYZ',
          category: 'electronics',
          contact: 'María López',
          email: 'contacto@xyz.com',
          phone: '+52 (555) 222-2222',
          rating: 4.8,
          active: true,
          createdAt: new Date().toISOString(),
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      supplies: 'Suministros',
      electronics: 'Electrónica',
      materials: 'Materiales',
      equipment: 'Equipos',
      services: 'Servicios',
    }
    return labels[category] || category
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer">Naova Admin</h1>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/admin/clients" className="text-gray-600 hover:text-primary">
                  Clientes
                </Link>
                <Link href="/admin/providers" className="text-primary font-semibold">
                  Proveedores
                </Link>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Proveedores</h2>
          <p className="text-gray-600 mt-1">Red de proveedores de Naova</p>
        </div>

        {/* Providers Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">
                      {provider.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {provider.name}
                </h3>

                <span className="inline-block px-3 py-1 bg-purple-100 text-primary text-sm font-medium rounded-full mb-4">
                  {getCategoryLabel(provider.category)}
                </span>

                <div className="space-y-2 text-sm text-gray-600">
                  {provider.contact && (
                    <p>
                      <strong>Contacto:</strong> {provider.contact}
                    </p>
                  )}
                  {provider.email && (
                    <p>
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${provider.email}`} className="text-primary hover:underline">
                        {provider.email}
                      </a>
                    </p>
                  )}
                  {provider.phone && (
                    <p>
                      <strong>Teléfono:</strong> {provider.phone}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className={`text-sm font-medium ${
                    provider.active ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {provider.active ? '✓ Activo' : '✗ Inactivo'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

