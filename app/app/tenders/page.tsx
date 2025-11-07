'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gavel, Clock, CheckCircle, XCircle, TrendingUp, Building2, LogOut, Package, DollarSign, Eye, Star, X } from 'lucide-react'
import Link from 'next/link'
import { appStore, type Tender } from '@/lib/store'

// Tender interface is now imported from store

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'processing' | 'active' | 'closed'>('all')
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [showProductsModal, setShowProductsModal] = useState(false)
  const [showQuotesModal, setShowQuotesModal] = useState(false)
  const [showSelectOfferModal, setShowSelectOfferModal] = useState(false)

  // Datos de ejemplo para licitaciones
  const mockTenders: Tender[] = [
    {
      id: '1',
      title: 'Compra de Materiales para Proyecto X',
      status: 'active',
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      requirement: {
        title: 'Compra de Materiales para Proyecto X',
        category: 'Materia Prima',
        quantity: 100,
        unit: 'kg'
      },
      products: [
        {
          id: '1',
          name: 'Acero Inoxidable 316L',
          description: 'Placa de acero inoxidable grado 316L, 3mm de espesor',
          category: 'Materia Prima',
          quantity: 50,
          unit: 'kg',
          specifications: 'ASTM A240, acabado 2B',
          budget: 15.50
        },
        {
          id: '2',
          name: 'Tornillos M8x30',
          description: 'Tornillos de acero inoxidable M8x30mm',
          category: 'Sujetadores',
          quantity: 1000,
          unit: 'pcs',
          specifications: 'Acero inoxidable A4, cabeza hexagonal',
          budget: 0.25
        },
        {
          id: '3',
          name: 'Soldadura TIG',
          description: 'Electrodo de soldadura TIG 316L, 2.4mm',
          category: 'Consumibles',
          quantity: 20,
          unit: 'kg',
          specifications: 'AWS ER316L, diámetro 2.4mm',
          budget: 45.00
        },
        {
          id: '4',
          name: 'Gas Argón',
          description: 'Cilindro de gas argón industrial, 50L',
          category: 'Gases',
          quantity: 2,
          unit: 'cilindros',
          specifications: 'Pureza 99.99%, presión 200 bar',
          budget: 180.00
        }
      ],
      offers: [
        {
          id: '1',
          provider: {
            id: '1',
            name: 'Proveedor ABC',
            email: 'contacto@proveedora.com',
            phone: '+52 55 1234 5678',
            rating: 4.5
          },
          totalAmount: 2285.00,
          validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          notes: 'Precio especial por volumen',
          productOffers: [
            { productId: '1', unitPrice: 15.50, quantity: 50, subtotal: 775.00 },
            { productId: '2', unitPrice: 0.25, quantity: 1000, subtotal: 250.00 },
            { productId: '3', unitPrice: 45.00, quantity: 20, subtotal: 900.00 },
            { productId: '4', unitPrice: 180.00, quantity: 2, subtotal: 360.00 }
          ]
        },
        {
          id: '2',
          provider: {
            id: '2',
            name: 'Industrial XYZ',
            email: 'ventas@industrialxyz.com',
            phone: '+52 55 9876 5432',
            rating: 4.2
          },
          totalAmount: 2160.00,
          validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          notes: 'Entrega en 48 horas',
          productOffers: [
            { productId: '1', unitPrice: 15.00, quantity: 50, subtotal: 750.00 },
            { productId: '2', unitPrice: 0.22, quantity: 1000, subtotal: 220.00 },
            { productId: '3', unitPrice: 42.00, quantity: 20, subtotal: 840.00 },
            { productId: '4', unitPrice: 175.00, quantity: 2, subtotal: 350.00 }
          ]
        }
      ],
      clientId: 'client-001',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Equipos de Seguridad Industrial',
      status: 'active',
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      requirement: {
        title: 'Equipos de Seguridad Industrial',
        category: 'Equipos de Seguridad',
        quantity: 50,
        unit: 'unidades'
      },
      products: [
        {
          id: '5',
          name: 'Cascos de Seguridad',
          description: 'Cascos de seguridad industrial clase A',
          category: 'Equipos de Seguridad',
          quantity: 30,
          unit: 'unidades',
          specifications: 'ANSI Z89.1, color blanco',
          budget: 25.00
        },
        {
          id: '6',
          name: 'Guantes de Seguridad',
          description: 'Guantes de seguridad anti-corte',
          category: 'Equipos de Seguridad',
          quantity: 20,
          unit: 'pares',
          specifications: 'Nivel 5 de protección',
          budget: 15.00
        },
        {
          id: '7',
          name: 'Lentes de Seguridad',
          description: 'Lentes de protección contra impactos',
          category: 'Equipos de Seguridad',
          quantity: 25,
          unit: 'unidades',
          specifications: 'ANSI Z87.1, protección UV',
          budget: 12.00
        }
      ],
      offers: [
        {
          id: '3',
          provider: {
            id: '3',
            name: 'Seguridad Pro',
            email: 'ventas@seguridadpro.com',
            phone: '+52 55 5555 1234',
            rating: 4.8
          },
          totalAmount: 1350.00,
          validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          notes: 'Certificación ISO 9001',
          productOffers: [
            { productId: '5', unitPrice: 25.00, quantity: 30, subtotal: 750.00 },
            { productId: '6', unitPrice: 15.00, quantity: 20, subtotal: 300.00 },
            { productId: '7', unitPrice: 12.00, quantity: 25, subtotal: 300.00 }
          ]
        }
      ],
      clientId: 'client-001',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Tornillos de Acero Inoxidable',
      status: 'processing',
      startAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      requirement: {
        title: 'Tornillos de Acero Inoxidable',
        category: 'Sujetadores',
        quantity: 1000,
        unit: 'pcs'
      },
      products: [
        {
          id: '5',
          name: 'Tornillos M6x20',
          description: 'Tornillos de acero inoxidable M6x20mm',
          category: 'Sujetadores',
          quantity: 500,
          unit: 'pcs',
          specifications: 'Acero inoxidable A4, cabeza Phillips',
          budget: 0.12
        },
        {
          id: '6',
          name: 'Tornillos M8x25',
          description: 'Tornillos de acero inoxidable M8x25mm',
          category: 'Sujetadores',
          quantity: 500,
          unit: 'pcs',
          specifications: 'Acero inoxidable A4, cabeza hexagonal',
          budget: 0.15
        }
      ],
      offers: [],
      clientId: 'client-001',
      createdAt: new Date().toISOString()
    }
  ]

  useEffect(() => {
    fetchTenders()
    
    // Suscribirse a cambios en el store
    const unsubscribe = appStore.subscribe(() => {
      fetchTenders()
    })
    
    return unsubscribe
  }, [filter])

  const fetchTenders = async () => {
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Obtener licitaciones del store
      let allTenders = appStore.getTenders()
      
      // Actualizar estados de licitaciones existentes
      allTenders = allTenders.map(tender => {
        // Si tiene cotizaciones pero está en 'processing', cambiar a 'active'
        if (tender.status === 'processing' && tender.offers.length > 0) {
          console.log(`[Cliente] Actualizando licitación ${tender.id} de 'processing' a 'active' (tiene ${tender.offers.length} cotizaciones)`)
          appStore.updateTender(tender.id, { status: 'active' })
          return { ...tender, status: 'active' as const }
        }
        return tender
      })
      
      // Si no hay licitaciones en el store, usar las de ejemplo
      if (allTenders.length === 0) {
        allTenders = mockTenders
        // Agregar las de ejemplo al store
        mockTenders.forEach(tender => appStore.addTender(tender))
      } else {
        // Verificar si las licitaciones existentes tienen la nueva estructura
        const hasNewStructure = allTenders.some(tender => 
          tender.offers && tender.offers.length > 0 && 
          tender.offers.some(offer => offer.productOffers && offer.productOffers.length > 0)
        )
        if (!hasNewStructure) {
          // Limpiar y recargar con datos de ejemplo actualizados
          localStorage.removeItem('naova_tenders')
          allTenders = mockTenders
          mockTenders.forEach(tender => appStore.addTender(tender))
        }
      }
      
      // Filtrar por estado
      let filteredTenders = allTenders
      if (filter !== 'all') {
        filteredTenders = allTenders.filter(tender => tender.status === filter)
      }
      
      setTenders(filteredTenders)
    } catch (error) {
      console.error('Error fetching tenders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'active':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Gavel className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'Borrador',
      processing: 'En Proceso',
      active: 'Activa',
      closed: 'Cerrada',
      cancelled: 'Cancelada',
    }
    return statusMap[status] || status
  }

  const getBestOffer = (offers: Tender['offers']) => {
    if (offers.length === 0) return null
    return offers.reduce((best, current) => 
      (current.totalAmount || 0) < (best.totalAmount || 0) ? current : best
    )
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const handleViewProducts = (tender: Tender) => {
    console.log('Tender products:', tender.products)
    setSelectedTender(tender)
    setShowProductsModal(true)
  }

  const handleViewQuotes = (tender: Tender) => {
    setSelectedTender(tender)
    setShowQuotesModal(true)
  }

  const closeModals = () => {
    setShowProductsModal(false)
    setShowQuotesModal(false)
    setShowSelectOfferModal(false)
    setSelectedTender(null)
  }

  const handleSelectOffer = (tender: Tender) => {
    setSelectedTender(tender)
    setShowSelectOfferModal(true)
  }

  const handleAcceptOffer = async (tenderId: string, offerId: string) => {
    try {
      // Actualizar el estado de la oferta a 'accepted'
      const updatedTenders = tenders.map(tender => {
        if (tender.id === tenderId) {
          return {
            ...tender,
            offers: tender.offers.map(offer => 
              offer.id === offerId 
                ? { ...offer, status: 'accepted' as const }
                : { ...offer, status: 'rejected' as const }
            ),
            status: 'selected' as const
          }
        }
        return tender
      })
      
      setTenders(updatedTenders)
      appStore.updateTender(tenderId, updatedTenders.find(t => t.id === tenderId)!)
      setShowSelectOfferModal(false)
      setSelectedTender(null)
      
      // Notificar selección
      alert('¡Oferta seleccionada! El administrador será notificado. Una vez que completes el pago, el administrador cambiará el estado a "Cerrada".')
    } catch (error) {
      console.error('Error accepting offer:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer">Naova</h1>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/app/dashboard" className="text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/app/requirements" className="text-gray-600 hover:text-primary">
                  Requerimientos
                </Link>
                <Link href="/app/tenders" className="text-primary font-semibold">
                  Licitaciones
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
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Licitaciones</h2>
              <p className="text-gray-600 mt-1">Revisa el estado de tus licitaciones y ofertas</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('naova_tenders')
                localStorage.removeItem('naova_requirements')
                window.location.reload()
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Recargar Datos
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {['all', 'processing', 'active', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              {status === 'all' ? 'Todas' : 
               status === 'processing' ? 'En Proceso' :
               status === 'active' ? 'Activas' : 'Cerradas'}
            </button>
          ))}
        </div>

        {/* Tenders List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : tenders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft p-12 text-center">
            <Gavel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay licitaciones
            </h3>
            <p className="text-gray-600">
              {filter === 'active' 
                ? 'No hay licitaciones activas en este momento'
                : 'Aún no tienes licitaciones'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tenders.map((tender) => {
              const bestOffer = getBestOffer(tender.offers)
              const isActive = tender.status === 'active'

              return (
                <motion.div
                  key={tender.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-soft hover:shadow-medium transition overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(tender.status)}
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {tender.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {tender.requirement.title}
                          </p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        isActive 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {getStatusText(tender.status)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-primary font-medium rounded-full">
                        {tender.requirement.category}
                      </span>
                      <span>
                        Cantidad: {tender.requirement.quantity} {tender.requirement.unit}
                      </span>
                      {tender.endAt && (
                        <>
                          <span>•</span>
                          <span>
                            Cierra: {new Date(tender.endAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Offers Summary */}
                    {tender.offers.length > 0 ? (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">
                            {tender.offers.length} {tender.offers.length === 1 ? 'Oferta' : 'Ofertas'}
                          </h4>
                          {bestOffer && (
                            <div className="flex items-center gap-2 text-green-600">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Mejor oferta: ${(bestOffer.totalAmount || 0).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Top 3 Offers */}
                        <div className="space-y-3">
                          {tender.offers.slice(0, 3).map((offer, index) => (
                            <div
                              key={offer.id}
                              className={`flex items-center justify-between p-4 rounded-lg ${
                                index === 0 
                                  ? 'bg-green-50 border-2 border-green-200'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  index === 0 
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium text-gray-900">
                                      {offer.provider?.name || `Proveedor ${index + 1}`}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ⭐ {(offer.provider?.rating || 0).toFixed(1)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Válida hasta: {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'N/A'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">
                                  ${(offer.totalAmount || 0).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  total
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : tender.status === 'processing' ? (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="text-center py-6">
                          <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Licitación en Preparación
                          </h3>
                          <p className="text-gray-500">
                            Estamos preparando esta licitación. Se publicará pronto para que los proveedores puedan enviar sus ofertas.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-500 text-center py-4">
                          Aún no hay ofertas para esta licitación
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {tender.status !== 'processing' && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleViewProducts(tender)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 text-primary rounded-lg hover:bg-purple-200 transition-colors"
                          >
                            <Package className="h-4 w-4" />
                            Ver Productos
                          </button>
                          <button
                            onClick={() => handleViewQuotes(tender)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <DollarSign className="h-4 w-4" />
                            Ver Cotizaciones
                          </button>
                          {tender.status === 'active' && tender.offers.length > 0 && (
                            <button
                              onClick={() => handleSelectOffer(tender)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Seleccionar Oferta
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal de Productos */}
      {showProductsModal && selectedTender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Productos de la Licitación
                </h2>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedTender.title}
                </h3>
                
                <div className="grid gap-4">
                  {(selectedTender.products || []).length > 0 ? (
                    (selectedTender.products || []).map((product, index) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {product.name}
                          </h4>
                          <span className="px-3 py-1 bg-purple-100 text-primary text-sm font-medium rounded-full">
                            {product.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{product.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Cantidad:</span>
                            <p className="text-gray-900">{product.quantity} {product.unit}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Presupuesto:</span>
                            <p className="text-gray-900">${product.budget.toFixed(2)}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700">Especificaciones:</span>
                            <p className="text-gray-900">{product.specifications || 'No especificadas'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay productos detallados
                      </h3>
                      <p className="text-gray-500">
                        Esta licitación no tiene información detallada de productos.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Cotizaciones */}
      {showQuotesModal && selectedTender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Cotizaciones de la Licitación
                </h2>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedTender.title}
                </h3>
                
                {selectedTender.offers.length > 0 ? (
                  <div className="space-y-6">
                    {selectedTender.offers.map((offer, index) => (
                      <div key={offer.id} className={`border rounded-lg p-6 ${
                        index === 0 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 bg-white'
                      }`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                              index === 0 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900">
                                {offer.provider?.name || `Proveedor ${index + 1}`}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">
                                  {(offer.provider?.rating || 0).toFixed(1)} / 5.0
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {offer.provider?.email || 'Sin email'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {offer.provider?.phone || 'Sin teléfono'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-gray-900">
                              ${offer.totalAmount?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-xs text-gray-500">
                              Válida hasta: {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        {offer.notes && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Notas:</strong> {offer.notes}
                            </p>
                          </div>
                        )}

                        {/* Tabla de productos como Excel */}
                        {offer.productOffers && offer.productOffers.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900">
                                    Producto
                                  </th>
                                  <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-900">
                                    Cantidad
                                  </th>
                                  <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-900">
                                    Precio Unit.
                                  </th>
                                  <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-900">
                                    Subtotal
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {offer.productOffers.map((productOffer, pIndex) => {
                                  const product = selectedTender.products?.find(p => p.id === productOffer.productId)
                                  return (
                                    <tr key={pIndex} className={pIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                                        <div>
                                          <div className="font-medium">{product?.name || 'Producto desconocido'}</div>
                                          <div className="text-xs text-gray-500">{product?.specifications || ''}</div>
                                        </div>
                                      </td>
                                      <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900">
                                        {productOffer.quantity} {product?.unit || ''}
                                      </td>
                                      <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900">
                                        ${productOffer.unitPrice.toFixed(2)}
                                      </td>
                                      <td className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-900">
                                        ${productOffer.subtotal.toFixed(2)}
                                      </td>
                                    </tr>
                                  )
                                })}
                                <tr className="bg-gray-100 font-bold">
                                  <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right text-sm text-gray-900">
                                    TOTAL:
                                  </td>
                                  <td className="border border-gray-300 px-4 py-2 text-right text-lg text-green-600">
                                    ${offer.totalAmount?.toFixed(2) || '0.00'}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        {index === 0 && (
                          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                            <p className="text-green-800 font-medium text-center">
                              🏆 Mejor oferta - Recomendada
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aún no hay cotizaciones
                    </h3>
                    <p className="text-gray-500">
                      Los proveedores pueden enviar sus ofertas hasta el cierre de la licitación.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Selección de Ofertas */}
      {showSelectOfferModal && selectedTender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Seleccionar Oferta - {selectedTender.title}
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedTender.offers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {offer.provider?.name || 'Proveedor'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {offer.provider?.email || 'email@proveedor.com'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${offer.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Válida hasta: {new Date(offer.validUntil).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {offer.productOffers && offer.productOffers.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Detalle por Producto:</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2">Producto</th>
                                <th className="text-right py-2">Precio Unit.</th>
                                <th className="text-right py-2">Cantidad</th>
                                <th className="text-right py-2">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {offer.productOffers.map((productOffer) => {
                                const product = selectedTender.products.find(p => p.id === productOffer.productId)
                                return (
                                  <tr key={productOffer.productId} className="border-b border-gray-100">
                                    <td className="py-2">{product?.name || 'Producto'}</td>
                                    <td className="text-right py-2">${productOffer.unitPrice.toFixed(2)}</td>
                                    <td className="text-right py-2">{productOffer.quantity}</td>
                                    <td className="text-right py-2 font-medium">${productOffer.subtotal.toFixed(2)}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {offer.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Notas:</strong> {offer.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleAcceptOffer(selectedTender.id, offer.id)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Seleccionar esta Oferta
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

