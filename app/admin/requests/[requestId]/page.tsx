'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Mail,
  Phone,
  Globe,
  Clock,
  User,
  Loader2,
  Search,
  FileText,
  Users,
  Eye,
  BarChart,
  ShoppingCart,
  Package,
  CheckCircle,
} from 'lucide-react'
import { RequestPipeline } from '@/components/RequestPipeline'
import { getAvailableActions } from '@/lib/utils/pipelineActions'

type MessageDirection = 'inbound' | 'outbound'
type MessageSource = 'whatsapp' | 'email' | 'web' | 'chat' | 'file' | 'api'

interface Message {
  id: string
  source: MessageSource
  direction: MessageDirection
  content: string
  from?: string | null
  to?: string | null
  subject?: string | null
  processed: boolean
  processedAt?: string | null
  createdAt: string
  attachments?: any[]
}

interface RequestDetail {
  id: string
  source: MessageSource
  status: string
  pipelineStage: string
  rawContent: string
  category?: string | null
  urgency: string
  createdAt: string
  updatedAt: string
  client?: {
    id: string
    name: string | null
    email: string
    company?: string | null
  } | null
  messages: Message[]
  attachments?: any[]
}

const SOURCE_LABELS: Record<MessageSource, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  web: 'Plataforma',
  chat: 'Chat',
  file: 'Archivo',
  api: 'API',
}

const SOURCE_COLORS: Record<MessageSource, string> = {
  whatsapp: 'bg-green-100 text-green-800',
  email: 'bg-blue-100 text-blue-800',
  web: 'bg-purple-100 text-purple-800',
  chat: 'bg-indigo-100 text-indigo-800',
  file: 'bg-gray-100 text-gray-800',
  api: 'bg-orange-100 text-orange-800',
}

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = params.requestId as string

  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [replying, setReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [sendingMessages, setSendingMessages] = useState<Record<string, boolean>>({})

  const loadRequest = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar requerimiento')
      }

      setRequest(data.request)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar requerimiento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (requestId) {
      loadRequest()
    }
  }, [requestId])

  const handleSendPendingMessage = async (messageId: string) => {
    setSendingMessages((prev) => ({ ...prev, [messageId]: true }))
    try {
      const response = await fetch(
        `/api/admin/requests/${requestId}/messages/${messageId}/send`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar mensaje')
      }

      // Recargar el request para actualizar el estado del mensaje
      await loadRequest()
    } catch (err) {
      console.error('Error sending message:', err)
      alert(`No se pudo enviar el mensaje. ${err instanceof Error ? err.message : ''}`)
    } finally {
      setSendingMessages((prev) => {
        const newState = { ...prev }
        delete newState[messageId]
        return newState
      })
    }
  }

  const handleSendReply = async () => {
    if (!replyContent.trim()) {
      alert('Por favor ingresa un mensaje')
      return
    }

    setReplying(true)
    try {
      const response = await fetch(`/api/admin/requests/${requestId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: replyContent.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar mensaje')
      }

      // Limpiar y recargar
      setReplyContent('')
      await loadRequest()
    } catch (err) {
      console.error('Error sending reply:', err)
      alert(`No se pudo enviar el mensaje. ${err instanceof Error ? err.message : ''}`)
    } finally {
      setReplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Cargando requerimiento...</p>
        </div>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Link
            href="/admin/requests"
            className="inline-flex items-center text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a requerimientos
          </Link>
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error || 'Request no encontrado'}</p>
          </div>
        </div>
      </div>
    )
  }

  const inboundMessages = request.messages.filter((m) => m.direction === 'inbound')
  const outboundMessages = request.messages.filter((m) => m.direction === 'outbound')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/requests"
                className="flex items-center text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Link>
              <MessageSquare className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Requerimiento</h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SOURCE_COLORS[request.source]}`}
              >
                {SOURCE_LABELS[request.source]}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {request.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Pipeline Visual - Ocupa 2 columnas en desktop */}
          <div className="lg:col-span-2">
            <RequestPipeline currentStage={request.pipelineStage as any} />
          </div>

          {/* Acciones Rápidas - Ocupa 1 columna */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Disponibles</h3>
            <div className="space-y-3">
              {getAvailableActions(
                request.pipelineStage as any,
                request.status !== 'incomplete_information',
                false, // TODO: verificar si hay proveedores
                false, // TODO: verificar si hay RFQ
                false, // TODO: verificar si hay cotizaciones
              ).map((action) => {
                const IconComponent = {
                  MessageSquare,
                  Search,
                  FileText,
                  Users,
                  Send,
                  Eye,
                  BarChart,
                  Mail,
                  Clock,
                  ShoppingCart,
                  Package,
                  CheckCircle,
                }[action.icon] || MessageSquare

                return (
                  <button
                    key={action.id}
                    className={`w-full text-left px-4 py-3 rounded-lg text-white ${action.color} transition-all hover:shadow-md`}
                    title={action.description}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{action.label}</div>
                        <div className="text-xs opacity-90">{action.description}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Request Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleString()}
                </span>
              </div>
              {request.client && (
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {request.client.name || request.client.company || 'Cliente'}{' '}
                    {request.client.email && `(${request.client.email})`}
                  </span>
                </div>
              )}
              {request.category && (
                <div className="text-sm text-gray-500">
                  Categoría: <span className="font-medium">{request.category}</span> • Urgencia:{' '}
                  <span className="font-medium">{request.urgency}</span>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Mensaje original:</h3>
            <p className="text-sm text-gray-800 whitespace-pre-line bg-gray-50 rounded-md p-4">
              {request.rawContent}
            </p>
          </div>
        </div>

        {/* Messages Thread */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Conversación ({request.messages.length} mensajes)
          </h2>

          <div className="space-y-4">
            {request.messages.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No hay mensajes aún. Envía el primer mensaje desde abajo.
              </p>
            ) : (
              request.messages.map((message) => {
                const isOutbound = message.direction === 'outbound'
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        isOutbound
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {message.source === 'whatsapp' && (
                          <Phone className="h-3 w-3" />
                        )}
                        {message.source === 'email' && <Mail className="h-3 w-3" />}
                        {message.source === 'web' && <Globe className="h-3 w-3" />}
                        <span className="text-xs opacity-75">
                          {isOutbound ? 'Tú' : 'Cliente'} • {SOURCE_LABELS[message.source]}
                        </span>
                        <span className="text-xs opacity-75">
                          • {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {/* Mostrar asunto si es email y tiene subject */}
                      {message.source === 'email' && message.subject && (
                        <div className={`mb-2 pb-2 border-b ${isOutbound ? 'border-white/20' : 'border-gray-300'}`}>
                          <div className={`text-xs font-medium mb-1 ${isOutbound ? 'text-white/90' : 'text-gray-600'}`}>
                            Asunto:
                          </div>
                          <div className={`text-sm font-semibold ${isOutbound ? 'text-white' : 'text-gray-900'}`}>
                            {message.subject}
                          </div>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      {!message.processed && isOutbound && (
                        <div className="mt-2">
                          <button
                            onClick={() => handleSendPendingMessage(message.id)}
                            disabled={sendingMessages[message.id]}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
                          >
                            {sendingMessages[message.id] ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Send className="h-3 w-3" />
                                Enviar
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      {message.processed && message.processedAt && (
                        <div className="mt-2 text-xs text-gray-500">
                          ✓ Enviado {new Date(message.processedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* Reply Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enviar respuesta</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                id="reply"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                disabled={replying}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={replying}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                disabled={replying || !replyContent.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {replying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar respuesta
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Nota: El mensaje se registrará en el sistema. Para enviarlo realmente por{' '}
              {SOURCE_LABELS[request.source]}, se requiere integración con el proveedor externo.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

