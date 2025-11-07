'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Gavel, 
  Plus, 
  Upload, 
  Eye, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Building2,
  Calendar,
  TrendingUp,
  ArrowLeft,
  LogOut,
  Star,
  X,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { appStore, type Tender } from '@/lib/store'

// Helper function for status text
const getStatusText = (status: string) => {
  switch (status) {
    case 'processing': return 'En Proceso'
    case 'active': return 'Activa'
    case 'selected': return 'Seleccionada'
    case 'closed': return 'Cerrada'
    case 'cancelled': return 'Cancelada'
    default: return status
  }
}

interface Provider {
  id: string
  name: string
  email: string
  phone: string
  company: string
  rating: number
  specialties: string[]
}

interface QuoteForm {
  providerId: string
  totalAmount: number
  validUntil: string
  notes: string
  productOffers: Array<{
    productId: string
    unitPrice: number
    quantity: number
    subtotal: number
  }>
}

// Lista de proveedores dados de alta
const mockProviders: Provider[] = [
  {
    id: 'provider-001',
    name: 'Juan Pérez',
    email: 'juan.perez@aceroindustrial.com',
    phone: '+52 55 1234 5678',
    company: 'Acero Industrial S.A.',
    rating: 4.8,
    specialties: ['Acero', 'Materiales de Construcción', 'Herramientas']
  },
  {
    id: 'provider-002',
    name: 'María González',
    email: 'maria.gonzalez@seguridadpro.com',
    phone: '+52 55 2345 6789',
    company: 'Seguridad Pro México',
    rating: 4.6,
    specialties: ['Equipos de Seguridad', 'Protección Personal', 'Señalización']
  },
  {
    id: 'provider-003',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@tornillosmx.com',
    phone: '+52 55 3456 7890',
    company: 'Tornillos México S.A.',
    rating: 4.7,
    specialties: ['Tornillos', 'Sujetadores', 'Fijaciones']
  },
  {
    id: 'provider-004',
    name: 'Ana Martínez',
    email: 'ana.martinez@herramientasplus.com',
    phone: '+52 55 4567 8901',
    company: 'Herramientas Plus',
    rating: 4.5,
    specialties: ['Herramientas', 'Equipos Industriales', 'Maquinaria']
  },
  {
    id: 'provider-005',
    name: 'Roberto Silva',
    email: 'roberto.silva@materialesconstruccion.com',
    phone: '+52 55 5678 9012',
    company: 'Materiales de Construcción Silva',
    rating: 4.9,
    specialties: ['Materiales de Construcción', 'Cemento', 'Arena', 'Grava']
  }
]

export default function AdminTendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadTenders = () => {
      const allTenders = appStore.getTenders()
      
      // Actualizar estados de licitaciones existentes
      const updatedTenders = allTenders.map(tender => {
        // Si tiene cotizaciones pero está en 'processing', cambiar a 'active'
        if (tender.status === 'processing' && tender.offers.length > 0) {
          console.log(`Actualizando licitación ${tender.id} de 'processing' a 'active' (tiene ${tender.offers.length} cotizaciones)`)
          appStore.updateTender(tender.id, { status: 'active' })
          return { ...tender, status: 'active' as const }
        }
        return tender
      })
      
      setTenders(updatedTenders)
    }

    loadTenders()

    const unsubscribe = appStore.subscribe(() => {
      loadTenders()
    })

    return unsubscribe
  }, [])

  const handleAddQuote = (tender: Tender) => {
    setSelectedTender(tender)
    setShowQuoteModal(true)
  }

  const handleViewTender = (tender: Tender) => {
    console.log('Abriendo modal de vista para tender:', tender.id, 'Ofertas:', tender.offers.length)
    setSelectedTender(tender)
    setShowViewModal(true)
  }

  const handleSubmitQuote = async (quoteData: QuoteForm) => {
    if (!selectedTender) return

    setLoading(true)
    try {
      // Buscar el proveedor seleccionado
      const selectedProvider = mockProviders.find(p => p.id === quoteData.providerId)
      if (!selectedProvider) {
        alert('Proveedor no encontrado')
        return
      }

      // Simular subida de cotización
      const newQuote = {
        id: `quote-${Date.now()}`,
        provider: {
          id: selectedProvider.id,
          name: selectedProvider.name,
          email: selectedProvider.email,
          phone: selectedProvider.phone,
          rating: selectedProvider.rating
        },
        totalAmount: quoteData.totalAmount,
        validUntil: quoteData.validUntil,
        status: 'pending' as const,
        notes: quoteData.notes,
        productOffers: quoteData.productOffers.map(offer => {
          // Buscar el producto para obtener el nombre
          const product = selectedTender.products.find(p => p.id === offer.productId)
          return {
            ...offer,
            productName: product?.name || 'Producto desconocido',
            price: offer.unitPrice // Asegurar que price esté definido
          }
        })
      }

      // Actualizar el tender con la nueva cotización
      const updatedOffers = [...selectedTender.offers, newQuote]
      
      // Si es la primera cotización, cambiar estado a 'active'
      const newStatus = selectedTender.offers.length === 0 ? 'active' : selectedTender.status

      console.log('Nueva cotización creada:', newQuote)
      console.log('Estado anterior:', selectedTender.status)
      console.log('Nuevo estado:', newStatus)

      appStore.updateTender(selectedTender.id, { 
        offers: updatedOffers,
        status: newStatus
      })
      
      // Guardar precios en el histórico
      quoteData.productOffers.forEach(offer => {
        const product = selectedTender.products.find(p => p.id === offer.productId)
        if (product && offer.unitPrice > 0) {
          appStore.addPriceHistory({
            id: `price-${Date.now()}-${offer.productId}-${selectedProvider.id}`,
            productName: product.name,
            productCategory: product.category,
            providerName: selectedProvider.name,
            providerId: selectedProvider.id,
            unitPrice: offer.unitPrice,
            quantity: offer.quantity,
            tenderId: selectedTender.id,
            tenderTitle: selectedTender.title,
            date: new Date().toISOString(),
            clientId: selectedTender.clientId
          })
        }
      })
      
      console.log('Precios guardados en histórico')
      
      setShowQuoteModal(false)
      setSelectedTender(null)
    } catch (error) {
      console.error('Error adding quote:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuote = (tenderId: string, quoteId: string) => {
    try {
      console.log('=== INICIANDO ELIMINACIÓN DE COTIZACIÓN ===')
      console.log('Tender ID:', tenderId)
      console.log('Quote ID:', quoteId)
      
      if (!confirm('¿Estás seguro de que quieres eliminar esta cotización?')) {
        console.log('Eliminación cancelada por el usuario')
        return
      }

      const allTenders = appStore.getTenders()
      console.log('Total de tenders:', allTenders.length)
      
      const tender = allTenders.find(t => t.id === tenderId)
      if (!tender) {
        console.error('Tender no encontrado:', tenderId)
        alert('Error: Licitación no encontrada')
        return
      }

      console.log('Tender encontrado:', tender.title)
      console.log('Ofertas actuales:', tender.offers.length)
      console.log('Ofertas:', tender.offers.map(o => ({ id: o.id, provider: o.provider?.name })))

      const updatedOffers = tender.offers.filter(offer => offer.id !== quoteId)
      console.log('Ofertas después de filtrar:', updatedOffers.length)
      
      if (updatedOffers.length === tender.offers.length) {
        console.error('No se encontró la cotización para eliminar')
        alert('Error: No se pudo encontrar la cotización para eliminar')
        return
      }
      
      // Si se elimina la última cotización, volver a 'processing'
      const newStatus = updatedOffers.length === 0 ? 'processing' : tender.status
      
      console.log('Estado anterior:', tender.status)
      console.log('Nuevo estado:', newStatus)
      
      appStore.updateTender(tenderId, { 
        offers: updatedOffers,
        status: newStatus
      })
      
      console.log('✅ Cotización eliminada exitosamente:', quoteId)
      alert('Cotización eliminada correctamente')
      
    } catch (error) {
      console.error('Error al eliminar cotización:', error)
      alert('Error al eliminar la cotización: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    }
  }


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-5 w-5 text-yellow-500" />
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'selected': return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'closed': return <CheckCircle className="h-5 w-5 text-gray-500" />
      case 'cancelled': return <X className="h-5 w-5 text-red-500" />
      default: return <Clock className="h-5 w-5 text-gray-500" />
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Licitaciones</h1>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Licitaciones Activas</h2>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <Gavel className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Licitaciones</p>
                  <p className="text-2xl font-bold text-gray-900">{tenders.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Proceso</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenders.filter(t => t.status === 'processing').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Activas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenders.filter(t => t.status === 'active').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cotizaciones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenders.reduce((acc, t) => acc + t.offers.length, 0)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tenders List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Licitación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cotizaciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tenders.map((tender) => (
                    <motion.tr
                      key={tender.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(tender.status)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{tender.title}</div>
                            <div className="text-sm text-gray-500">{tender.requirement.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tender.clientId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tender.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : tender.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusText(tender.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tender.offers.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(tender.endAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {(tender.status === 'active' || tender.status === 'processing') && (
                            <button
                              onClick={() => handleAddQuote(tender)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                              title="Agregar cotización"
                            >
                              <Plus className="h-4 w-4" />
                              Cotización
                            </button>
                          )}
                          <button
                            onClick={() => handleViewTender(tender)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {tenders.length === 0 && (
            <div className="text-center py-12">
              <Gavel className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay licitaciones</h3>
              <p className="text-gray-500">Las licitaciones aparecerán aquí cuando los clientes las envíen</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Quote Modal */}
      {showQuoteModal && selectedTender && (
        <QuoteModal
          tender={selectedTender}
          onClose={() => setShowQuoteModal(false)}
          onSubmit={handleSubmitQuote}
          loading={loading}
        />
      )}

      {showViewModal && selectedTender && (
        <ViewTenderModal
          tender={selectedTender}
          onClose={() => setShowViewModal(false)}
          onDeleteQuote={handleDeleteQuote}
        />
      )}
    </div>
  )
}

// Quote Modal Component
function QuoteModal({ 
  tender, 
  onClose, 
  onSubmit, 
  loading 
}: { 
  tender: Tender
  onClose: () => void
  onSubmit: (data: QuoteForm) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState<QuoteForm>({
    providerId: '',
    totalAmount: 0,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días desde hoy
    notes: '',
    productOffers: tender.products.map(product => ({
      productId: product.id,
      unitPrice: 0,
      quantity: product.quantity,
      subtotal: 0
    }))
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que se haya seleccionado un proveedor
    if (!formData.providerId) {
      alert('Por favor selecciona un proveedor')
      return
    }
    
    // Validar que se haya ingresado una fecha
    if (!formData.validUntil) {
      alert('Por favor ingresa una fecha de validez')
      return
    }
    
    // Las notas son opcionales, no validamos
    
    // Validar que todos los productos tengan precio
    const hasInvalidPrices = formData.productOffers.some(offer => offer.unitPrice <= 0)
    if (hasInvalidPrices) {
      alert('Por favor ingresa precios válidos para todos los productos')
      return
    }
    
    // Calcular el total antes de enviar
    const calculatedTotal = formData.productOffers.reduce((sum, offer) => sum + offer.subtotal, 0)
    
    // Actualizar el formData con el total calculado
    const updatedFormData = {
      ...formData,
      totalAmount: calculatedTotal
    }
    
    console.log('Datos del formulario enviados:', updatedFormData)
    console.log('Total calculado:', calculatedTotal)
    
    onSubmit(updatedFormData)
  }

  const updateProductOffer = (productId: string, field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      productOffers: prev.productOffers.map(offer => {
        if (offer.productId === productId) {
          const updated = { ...offer, [field]: value }
          if (field === 'unitPrice' || field === 'quantity') {
            updated.subtotal = updated.unitPrice * updated.quantity
          }
          console.log('Actualizando producto:', productId, field, value, 'subtotal:', updated.subtotal)
          return updated
        }
        return offer
      })
    }))
  }

  const totalAmount = formData.productOffers.reduce((sum, offer) => sum + offer.subtotal, 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Agregar Cotización - {tender.title}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Provider Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Proveedor <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.providerId}
              onChange={(e) => setFormData(prev => ({ ...prev, providerId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecciona un proveedor</option>
              {mockProviders.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} - {provider.company} ({provider.specialties.join(', ')})
                </option>
              ))}
            </select>
            {formData.providerId && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                {(() => {
                  const selectedProvider = mockProviders.find(p => p.id === formData.providerId)
                  return selectedProvider ? (
                    <div>
                      <p className="font-medium text-gray-900">{selectedProvider.name}</p>
                      <p className="text-sm text-gray-600">{selectedProvider.company}</p>
                      <p className="text-sm text-gray-600">{selectedProvider.email}</p>
                      <p className="text-sm text-gray-600">{selectedProvider.phone}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{selectedProvider.rating}/5</span>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}
          </div>

          {/* Product Offers */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Cotización por Producto</h4>
            <div className="space-y-3">
              {formData.productOffers.map((offer, index) => {
                const product = tender.products.find(p => p.id === offer.productId)
                return (
                  <div key={offer.productId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{product?.name}</h5>
                      <span className="text-sm text-gray-500">
                        Cantidad: {offer.quantity} {product?.unit}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Unitario
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={offer.unitPrice}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0
                            console.log('Input cambiado:', e.target.value, 'Valor parseado:', value)
                            updateProductOffer(offer.productId, 'unitPrice', value)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          required
                          value={offer.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0
                            console.log('Cantidad cambiada:', e.target.value, 'Valor parseado:', value)
                            updateProductOffer(offer.productId, 'quantity', value)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subtotal
                        </label>
                        <input
                          type="number"
                          readOnly
                          value={offer.subtotal}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Válida hasta
              </label>
              <input
                type="date"
                required
                value={formData.validUntil}
                onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Notas adicionales"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Agregar Cotización'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// View Tender Modal Component
function ViewTenderModal({ 
  tender, 
  onClose,
  onDeleteQuote
}: { 
  tender: Tender
  onClose: () => void
  onDeleteQuote: (tenderId: string, quoteId: string) => void
}) {
  const [currentTender, setCurrentTender] = useState(tender)

  // Actualizar el tender cuando cambie
  useEffect(() => {
    const updatedTender = appStore.getTenders().find(t => t.id === tender.id)
    if (updatedTender) {
      setCurrentTender(updatedTender)
    }
  }, [tender.id])

  // Suscribirse a cambios en el store
  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      const updatedTender = appStore.getTenders().find(t => t.id === tender.id)
      if (updatedTender) {
        setCurrentTender(updatedTender)
      }
    })
    return unsubscribe
  }, [tender.id])
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Detalles de la Licitación</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Información General</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Título</label>
                <p className="text-gray-900">{currentTender.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Cliente</label>
                <p className="text-gray-900">{currentTender.clientId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  currentTender.status === 'active' ? 'bg-green-100 text-green-800' :
                  currentTender.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  currentTender.status === 'selected' ? 'bg-blue-100 text-blue-800' :
                  currentTender.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getStatusText(currentTender.status)}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Vencimiento</label>
                <p className="text-gray-900">{new Date(currentTender.endAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Productos */}
          {currentTender.products && currentTender.products.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Productos Solicitados</h3>
              <div className="space-y-3">
                {currentTender.products.map((product, index) => (
                  <div key={product.id || index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Cantidad: {product.quantity}</p>
                        <p className="text-sm text-gray-600">Unidad: {product.unit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cotizaciones */}
          {currentTender.offers && currentTender.offers.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Cotizaciones Recibidas</h3>
              <div className="space-y-4">
                {currentTender.offers.map((offer, index) => (
                  <div key={offer.id || index} className="bg-white p-4 rounded border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{offer.provider?.name || 'Proveedor'}</h4>
                        <p className="text-sm text-gray-600">{offer.provider?.email}</p>
                        <p className="text-sm text-gray-600">{offer.provider?.phone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${offer.totalAmount?.toLocaleString() || '0'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Válida hasta: {new Date(offer.validUntil).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Botón de eliminar presionado')
                            console.log('Tender ID:', tender.id)
                            console.log('Offer ID:', offer.id)
                            console.log('Offer completo:', offer)
                            
                            if (offer.id) {
                              onDeleteQuote(currentTender.id, offer.id)
                            } else {
                              console.error('Offer ID no definido')
                              alert('Error: ID de cotización no definido')
                            }
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar cotización"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {offer.productOffers && offer.productOffers.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Detalle por Producto:</h5>
                        <div className="space-y-2">
                          {offer.productOffers.map((productOffer, pIndex) => (
                            <div key={pIndex} className="flex justify-between text-sm">
                              <span>{productOffer.productName || 'Producto'}</span>
                              <span>${(productOffer.unitPrice || 0).toLocaleString()} x {productOffer.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {offer.notes && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <strong>Notas:</strong> {offer.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!currentTender.offers || currentTender.offers.length === 0) && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">No hay cotizaciones disponibles</p>
            </div>
          )}

          {/* Oferta Seleccionada */}
          {currentTender.status === 'selected' && currentTender.offers && currentTender.offers.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-blue-900">✅ Oferta Seleccionada por el Cliente</h3>
                <button
                  onClick={() => {
                    if (confirm('¿El cliente ya completó el pago? Esto cambiará el estado a "Cerrada".')) {
                      appStore.updateTender(currentTender.id, { status: 'closed' })
                      alert('Estado cambiado a "Cerrada". El proceso está completo.')
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar como Pagada
                </button>
              </div>
              {(() => {
                const selectedOffer = currentTender.offers.find(offer => offer.status === 'accepted')
                return selectedOffer ? (
                  <div className="bg-white p-4 rounded border border-blue-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedOffer.provider?.name || 'Proveedor'}</h4>
                        <p className="text-sm text-gray-600">{selectedOffer.provider?.email}</p>
                        <p className="text-sm text-gray-600">{selectedOffer.provider?.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">
                          ${selectedOffer.totalAmount?.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Válida hasta: {new Date(selectedOffer.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {selectedOffer.notes && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <strong>Notas:</strong> {selectedOffer.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">No se encontró la oferta seleccionada</p>
                )
              })()}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
