'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  CheckCircle,
  AlertCircle,
  X,
  Send
} from 'lucide-react'
import { generateExcelTemplate, parseExcelFile, ExcelProduct } from '@/lib/excel'
import { appStore, type Requirement } from '@/lib/store'

interface Product {
  id: string
  name: string
  description: string
  category: string
  quantity: number
  unit: string
  specifications: string
  budget?: number
}

// Requirement interface is now imported from store

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showExcelUpload, setShowExcelUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Cargar requerimientos del store al montar el componente
  useEffect(() => {
    const storeRequirements = appStore.getRequirements()
    setRequirements(storeRequirements)
    
    // Suscribirse a cambios en el store
    const unsubscribe = appStore.subscribe(() => {
      const updatedRequirements = appStore.getRequirements()
      setRequirements(updatedRequirements)
    })
    
    return unsubscribe
  }, [])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    products: [
      {
        id: '1',
        name: '',
        description: '',
        category: '',
        quantity: 1,
        unit: 'pcs',
        specifications: '',
        budget: 0
      }
    ] as Product[]
  })

  // Agregar producto al formulario
  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      description: '',
      category: '',
      quantity: 1,
      unit: 'pcs',
      specifications: '',
      budget: 0
    }
    setFormData({
      ...formData,
      products: [...formData.products, newProduct]
    })
  }

  // Eliminar producto del formulario
  const removeProduct = (productId: string) => {
    if (formData.products.length > 1) {
      setFormData({
        ...formData,
        products: formData.products.filter(p => p.id !== productId)
      })
    }
  }

  // Actualizar producto
  const updateProduct = (productId: string, field: keyof Product, value: any) => {
    setFormData({
      ...formData,
      products: formData.products.map(p => 
        p.id === productId ? { ...p, [field]: value } : p
      )
    })
  }

  // Guardar como borrador
  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validación básica para borrador
    if (!formData.title.trim()) {
      setError('El título del requerimiento es obligatorio.')
      setLoading(false)
      return
    }

    try {
      const newRequirement: Requirement = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        products: formData.products.filter(p => p.name.trim() !== ''),
        status: 'DRAFT',
        createdAt: new Date().toISOString()
      }

      // Aquí iría la llamada a la API
      setRequirements([...requirements, newRequirement])
      setSuccess('Borrador guardado exitosamente! Puedes editarlo o enviarlo a licitación.')
      setShowForm(false)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        deadline: '',
        products: [{
          id: '1',
          name: '',
          description: '',
          category: '',
          quantity: 1,
          unit: 'pcs',
          specifications: '',
          budget: 0
        }]
      })
    } catch (err) {
      setError('Error al guardar el borrador')
    } finally {
      setLoading(false)
    }
  }

  // Enviar a licitación
  const handleSendToTender = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validación completa para licitación
    if (!formData.title.trim()) {
      setError('El título del requerimiento es obligatorio.')
      setLoading(false)
      return
    }
    if (!formData.deadline) {
      setError('La fecha límite es obligatoria para enviar a licitación.')
      setLoading(false)
      return
    }
    if (formData.products.length === 0) {
      setError('Debe agregar al menos un producto.')
      setLoading(false)
      return
    }
    for (const product of formData.products) {
      if (!product.name.trim() || !product.description.trim() || !product.category.trim() || product.quantity <= 0 || !product.unit.trim()) {
        setError('Todos los campos de producto (nombre, descripción, categoría, cantidad, unidad) son obligatorios y la cantidad debe ser mayor a 0.')
        setLoading(false)
        return
      }
    }

    try {
      const newRequirement: Requirement = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        products: formData.products.filter(p => p.name.trim() !== ''),
        status: 'ACTIVE', // Cambiar a ACTIVE para licitación
        createdAt: new Date().toISOString()
      }

      // Agregar al store
      appStore.addRequirement(newRequirement)
      
      // Crear licitación automáticamente
      const tender = appStore.createTenderFromRequirement(newRequirement)
      appStore.addTender(tender)
      
      // Actualizar estado local
      setRequirements([...requirements, newRequirement])
      setSuccess('¡Requerimiento enviado a licitación exitosamente! Ya está visible para proveedores.')
      setShowForm(false)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        deadline: '',
        products: [{
          id: '1',
          name: '',
          description: '',
          category: '',
          quantity: 1,
          unit: 'pcs',
          specifications: '',
          budget: 0
        }]
      })
    } catch (err) {
      setError('Error al enviar a licitación')
    } finally {
      setLoading(false)
    }
  }

  // Descargar plantilla Excel
  const downloadTemplate = () => {
    generateExcelTemplate()
  }

  // Procesar archivo Excel
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const excelData = await parseExcelFile(file)
      
      // Convertir datos del Excel a productos
      const products: Product[] = excelData.map((row, index) => ({
        id: (index + 1).toString(),
        name: row['Nombre del Producto'] || '',
        description: row['Descripción'] || '',
        category: row['Categoría'] || '',
        quantity: row['Cantidad'] || 1,
        unit: row['Unidad'] || 'pcs',
        specifications: row['Especificaciones'] || '',
        budget: row['Presupuesto (opcional)'] || 0
      }))

      setFormData({
        ...formData,
        products: products
      })
      setShowExcelUpload(false)
      setShowForm(true)
      setSuccess(`Se cargaron ${products.length} productos desde Excel`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo Excel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/app/dashboard'}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Volver al dashboard"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-primary">Requerimientos</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={downloadTemplate}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-primary transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Plantilla Excel
              </button>
              <button
                onClick={() => setShowExcelUpload(true)}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir Excel
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Requerimiento
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded"
          >
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">{success}</p>
              <button
                onClick={() => setSuccess('')}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Requirements List */}
        <div className="space-y-6">
          {requirements.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay requerimientos
              </h3>
              <p className="text-gray-600 mb-6">
                Crea tu primer requerimiento o sube un archivo Excel
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  Crear Requerimiento
                </button>
                <button
                  onClick={() => setShowExcelUpload(true)}
                  className="btn-secondary"
                >
                  Subir Excel
                </button>
              </div>
            </div>
          ) : (
            requirements.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{req.title}</h3>
                    <p className="text-gray-600">{req.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    req.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    req.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {req.status === 'ACTIVE' ? 'Activo' : req.status === 'CLOSED' ? 'Cerrado' : 'Borrador'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Productos:</span>
                    <p className="text-gray-900">{req.products.length}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Fecha límite:</span>
                    <p className="text-gray-900">{req.deadline}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Creado:</span>
                    <p className="text-gray-900">{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Productos:</h4>
                  <div className="space-y-2">
                    {req.products.map((product, index) => (
                      <div key={product.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div>
                          <span className="font-medium">{product.name}</span>
                          <span className="text-gray-600 ml-2">({product.quantity} {product.unit})</span>
                        </div>
                        <span className="text-sm text-gray-500">{product.category}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-4">
                    {req.status === 'DRAFT' && (
                      <>
                        <button
                          onClick={() => {
                            // Aquí iría la lógica para editar
                            console.log('Editar requerimiento:', req.id)
                          }}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            // Actualizar estado en el store
                            appStore.updateRequirement(req.id, { status: 'ACTIVE' })
                            
                            // Crear licitación automáticamente
                            const tender = appStore.createTenderFromRequirement({ ...req, status: 'ACTIVE' })
                            appStore.addTender(tender)
                            
                            // Actualizar estado local
                            setRequirements(prev => 
                              prev.map(r => 
                                r.id === req.id ? { ...r, status: 'ACTIVE' } : r
                              )
                            )
                            setSuccess('Requerimiento enviado a licitación exitosamente!')
                          }}
                          className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-purple-700 transition-colors"
                        >
                          Enviar a Licitación
                        </button>
                      </>
                    )}
                    {req.status === 'ACTIVE' && (
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
                        En Licitación
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Nuevo Requerimiento</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Requerimiento
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="Ej: Compra de herramientas para taller"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Límite
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Describe los detalles del requerimiento..."
                  />
                </div>

                {/* Products */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Productos</h3>
                    <button
                      type="button"
                      onClick={addProduct}
                      className="flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Producto
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.products.map((product, index) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-900">Producto {index + 1}</h4>
                          {formData.products.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nombre *
                            </label>
                            <input
                              type="text"
                              required
                              value={product.name}
                              onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                              placeholder="Ej: Tornillos M6x20"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Categoría *
                            </label>
                            <select
                              required
                              value={product.category}
                              onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            >
                              <option value="">Seleccionar...</option>
                              <option value="Herramientas">Herramientas</option>
                              <option value="Materiales">Materiales</option>
                              <option value="Equipos">Equipos</option>
                              <option value="Insumos">Insumos</option>
                              <option value="Otros">Otros</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cantidad *
                            </label>
                            <input
                              type="number"
                              min="1"
                              required
                              value={product.quantity}
                              onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Unidad *
                            </label>
                            <select
                              required
                              value={product.unit}
                              onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            >
                              <option value="pcs">Piezas</option>
                              <option value="kg">Kilogramos</option>
                              <option value="m">Metros</option>
                              <option value="m2">Metros cuadrados</option>
                              <option value="l">Litros</option>
                              <option value="unidad">Unidad</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Presupuesto (opcional)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={product.budget || ''}
                              onChange={(e) => updateProduct(product.id, 'budget', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                              placeholder="0.00"
                            />
                          </div>

                          <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Descripción
                            </label>
                            <input
                              type="text"
                              value={product.description}
                              onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                              placeholder="Descripción del producto..."
                            />
                          </div>

                          <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Especificaciones
                            </label>
                            <textarea
                              rows={2}
                              value={product.specifications}
                              onChange={(e) => updateProduct(product.id, 'specifications', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                              placeholder="Especificaciones técnicas, materiales, etc..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-between pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={loading}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {loading ? 'Guardando...' : 'Guardar Borrador'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSendToTender}
                      disabled={loading}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? 'Enviando...' : 'Enviar a Licitación'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Excel Upload Modal */}
      {showExcelUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Subir Excel</h2>
              <button
                onClick={() => setShowExcelUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Descarga la plantilla Excel, complétala con tus productos y súbela aquí.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Arrastra tu archivo Excel aquí o haz clic para seleccionar
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Seleccionar Archivo
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={downloadTemplate}
                  className="text-primary hover:text-purple-700 text-sm"
                >
                  Descargar plantilla Excel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}