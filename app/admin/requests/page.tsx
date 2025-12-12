'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Inbox, Filter, RefreshCcw, ArrowLeft, Clock, TrendingUp, Calendar } from 'lucide-react'
import { generateFollowUpMessage } from '@/lib/services/inbox/FollowUpGenerator'
import { findCategoryRule, type FieldId } from '@/lib/rules/requestSchemas'
import { getConversationStatus } from '@/lib/utils/conversationStatus'
import { MessageCircle, User, Bot } from 'lucide-react'

type RequestSource = 'whatsapp' | 'email' | 'web' | 'chat' | 'file' | 'api'

interface RequestRulesInfo {
  categoryRuleId?: string | null
  presentFields?: FieldId[]
  missingFields?: FieldId[]
  completeness?: number
  autoReplyEnabled?: boolean
}

interface MessagePreview {
  id: string
  direction: 'inbound' | 'outbound'
  content: string
  subject?: string | null
  source?: string
  createdAt: string
  from?: string | null
  to?: string | null
}

interface Request {
  id: string
  source: RequestSource
  clientId?: string | null
  status: string
  pipelineStage: string
  rawContent: string
  category?: string | null
  urgency: string
  createdAt: string
  updatedAt?: string
  client?: {
    id: string
    name: string | null
    email: string
    company?: string | null
  } | null
  rules?: RequestRulesInfo | null
  messages?: MessagePreview[]
}

const SOURCE_LABELS: Record<RequestSource, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  web: 'Plataforma',
  chat: 'Chat',
  file: 'Archivo',
  api: 'API',
}

const SOURCE_COLORS: Record<RequestSource, string> = {
  whatsapp: 'bg-green-100 text-green-800',
  email: 'bg-blue-100 text-blue-800',
  web: 'bg-purple-100 text-purple-800',
  chat: 'bg-indigo-100 text-indigo-800',
  file: 'bg-gray-100 text-gray-800',
  api: 'bg-orange-100 text-orange-800',
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedSource, setSelectedSource] = useState<RequestSource | 'all'>('all')
  const [sortBy, setSortBy] = useState<'recent_activity' | 'oldest' | 'newest'>('recent_activity')
  const [autoReplyState, setAutoReplyState] = useState<Record<string, boolean>>({})
  const [updatingAutoReply, setUpdatingAutoReply] = useState<Record<string, boolean>>({})
  const [suggestedMessages, setSuggestedMessages] = useState<Record<string, string>>({})
  const [generatingMessages, setGeneratingMessages] = useState<Record<string, boolean>>({})

  const loadRequests = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/requests?sortBy=${sortBy}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar requerimientos')
      }

      const loadedRequests: Request[] = data.requests || []
      setRequests(loadedRequests)

      const initialAutoReply: Record<string, boolean> = {}
      loadedRequests.forEach((r) => {
        if (r.rules && typeof r.rules.autoReplyEnabled === 'boolean') {
          initialAutoReply[r.id] = r.rules.autoReplyEnabled
        }
      })
      setAutoReplyState(initialAutoReply)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar requerimientos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [sortBy])

  const handleToggleAutoReply = async (request: Request, enabled: boolean) => {
    setUpdatingAutoReply((prev) => ({ ...prev, [request.id]: true }))
    try {
      const response = await fetch(`/api/admin/requests/${request.id}/auto-reply`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ enabled }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar auto-reply')
      }
      setAutoReplyState((prev) => ({ ...prev, [request.id]: enabled }))
    } catch (err) {
      console.error('Error toggling auto-reply:', err)
      alert(
        `No se pudo actualizar la respuesta automática. ${
          err instanceof Error ? err.message : ''
        }`,
      )
    } finally {
      setUpdatingAutoReply((prev) => ({ ...prev, [request.id]: false }))
    }
  }

  // Filtrar por fuente
  const filteredRequests =
    selectedSource === 'all'
      ? requests
      : requests.filter((req) => req.source === selectedSource)
  
  // Ordenar según el criterio seleccionado (el API ya ordena, pero esto es un respaldo)
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === 'recent_activity') {
      // Ordenar por última actividad (updatedAt) - más reciente primero
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime()
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime()
      return bTime - aTime
    } else if (sortBy === 'oldest') {
      // Ordenar por fecha de creación - más antiguos primero
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else {
      // newest: Ordenar por fecha de creación - más nuevos primero
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="flex items-center text-gray-600 hover:text-primary transition-colors"
                title="Volver al Dashboard"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Link>
              <Inbox className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Requerimientos (Inbox)</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="hidden md:flex items-center px-3 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={loadRequests}
                disabled={loading}
                className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filtros y Ordenamiento */}
        <div className="mb-6 space-y-4">
          {/* Filtro por canal */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtrar por canal:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedSource('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  selectedSource === 'all'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Todos
              </button>
              {(Object.keys(SOURCE_LABELS) as RequestSource[]).map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setSelectedSource(source)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                    selectedSource === source
                      ? `${SOURCE_COLORS[source]} border-transparent`
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {SOURCE_LABELS[source]}
                </button>
              ))}
            </div>
          </div>
          
          {/* Ordenamiento */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Ordenar por:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSortBy('recent_activity')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  sortBy === 'recent_activity'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="Mensajes con actividad más reciente primero"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Actividad Reciente
              </button>
              <button
                type="button"
                onClick={() => setSortBy('oldest')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  sortBy === 'oldest'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="Requests más antiguos primero (necesitan seguimiento)"
              >
                <Clock className="h-3.5 w-3.5" />
                Más Antiguos
              </button>
              <button
                type="button"
                onClick={() => setSortBy('newest')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  sortBy === 'newest'
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="Requests más nuevos primero"
              >
                <Calendar className="h-3.5 w-3.5" />
                Más Nuevos
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Lista */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
              <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay requerimientos aún
              </h3>
              <p className="text-gray-600 max-w-lg mx-auto">
                Cuando un cliente envíe un requerimiento por WhatsApp, email o desde la plataforma,
                aparecerá aquí con su canal de origen.
              </p>
            </div>
          ) : (
            sortedRequests.map((req) => {
              const rules = req.rules
              const categoryRule = rules?.categoryRuleId
                ? findCategoryRule(rules.categoryRuleId)
                : null
              
              // Generar mensaje sugerido de forma async si no está generado
              const needsMessage = rules && categoryRule && rules.missingFields && rules.missingFields.length > 0 &&
                (req.status === 'incomplete_information' || req.pipelineStage === 'needs_info')
              
              if (needsMessage && !suggestedMessages[req.id] && !generatingMessages[req.id]) {
                setGeneratingMessages(prev => ({ ...prev, [req.id]: true }))
                generateFollowUpMessage({
                  categoryRule,
                  missingFields: rules.missingFields || [],
                  requestContent: req.rawContent,
                  clientInfo: req.client ? {
                    name: req.client.name,
                    company: req.client.company || undefined,
                  } : undefined,
                  channel: req.source === 'whatsapp' ? 'whatsapp' : req.source === 'email' ? 'email' : 'web',
                }).then((message) => {
                  if (message) {
                    setSuggestedMessages(prev => ({ ...prev, [req.id]: message }))
                  }
                  setGeneratingMessages(prev => {
                    const updated = { ...prev }
                    delete updated[req.id]
                    return updated
                  })
                }).catch((error) => {
                  console.error('Error generando mensaje sugerido:', error)
                  setGeneratingMessages(prev => {
                    const updated = { ...prev }
                    delete updated[req.id]
                    return updated
                  })
                })
              }
              
              const suggestedMessage = suggestedMessages[req.id] || ''
              const isGenerating = generatingMessages[req.id]

              const showFollowUpSection = needsMessage && (!!suggestedMessage || isGenerating)

              // Obtener estado de conversación
              const conversationStatus = getConversationStatus({
                status: req.status,
                pipelineStage: req.pipelineStage,
                messages: req.messages || [],
                rules: req.rules || null,
              })

              // Ordenar mensajes por fecha (más reciente primero) para previsualización
              const sortedMessages = [...(req.messages || [])].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )
              const previewMessages = sortedMessages.slice(0, 3) // Últimos 3 mensajes

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SOURCE_COLORS[req.source]}`}
                        >
                          {SOURCE_LABELS[req.source]}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${conversationStatus.color}`}
                          title={conversationStatus.description}
                        >
                          {conversationStatus.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(req.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Previsualización de conversación */}
                      {previewMessages.length > 0 && (
                        <div className="mb-3 space-y-2 border-l-2 border-gray-200 pl-3">
                          {previewMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex items-start gap-2 text-xs ${
                                msg.direction === 'inbound'
                                  ? 'text-gray-700'
                                  : 'text-gray-600'
                              }`}
                            >
                              {msg.direction === 'inbound' ? (
                                <User className="h-3 w-3 mt-0.5 text-gray-400 flex-shrink-0" />
                              ) : (
                                <Bot className="h-3 w-3 mt-0.5 text-purple-400 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-medium text-gray-600">
                                    {msg.direction === 'inbound' ? 'Cliente' : 'Naova'}
                                  </span>
                                  <span className="text-gray-400">
                                    {new Date(msg.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                {/* Mostrar asunto si es email y tiene subject */}
                                {msg.source === 'email' && msg.subject && (
                                  <div className="mb-1">
                                    <span className="text-xs font-semibold text-gray-800">
                                      {msg.subject}
                                    </span>
                                  </div>
                                )}
                                <p className="line-clamp-2 text-gray-700">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="block text-sm text-gray-800 whitespace-pre-line line-clamp-2 hover:text-primary transition-colors"
                      >
                        <span className="font-medium">Mensaje original:</span> {req.rawContent}
                      </Link>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {req.status.replace(/_/g, ' ')}
                      </span>
                      {req.client && (
                        <div className="text-xs text-gray-500">
                          <div className="font-medium">
                            {req.client.name || req.client.company || 'Cliente'}
                          </div>
                          <div>{req.client.email}</div>
                        </div>
                      )}
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="inline-flex items-center mt-2 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                      >
                        Ver detalles →
                      </Link>
                    </div>
                  </div>
                  {req.category && (
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span>Categoría: {req.category}</span>
                      <span>Urgencia: {req.urgency}</span>
                    </div>
                  )}

                  {showFollowUpSection && suggestedMessage && (
                    <div className="mt-4 border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          Mensaje sugerido para pedir información faltante
                        </span>
                        <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            checked={!!autoReplyState[req.id]}
                            disabled={!!updatingAutoReply[req.id]}
                            onChange={(e) => handleToggleAutoReply(req, e.target.checked)}
                          />
                          <span>
                            Activar respuesta automática por el mismo canal
                          </span>
                        </label>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        {isGenerating ? (
                          <div className="flex items-center justify-center py-4 text-xs text-gray-500">
                            <RefreshCcw className="h-3 w-3 mr-2 animate-spin" />
                            Generando mensaje personalizado...
                          </div>
                        ) : (
                          <>
                            <textarea
                              readOnly
                              className="w-full text-xs text-gray-800 bg-transparent border-none resize-none focus:ring-0"
                              value={suggestedMessage}
                              rows={Math.min(8, suggestedMessage.split('\n').length + 1)}
                            />
                            <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500">
                              <span>
                                Esta respuesta se enviará preferentemente por el mismo canal donde el
                                cliente escribió (WhatsApp, email o plataforma).
                              </span>
                              <button
                                type="button"
                                className="text-xs text-purple-600 hover:text-purple-800"
                                onClick={() => {
                                  navigator.clipboard.writeText(suggestedMessage)
                                  alert('Mensaje copiado al portapapeles.')
                                }}
                              >
                                Copiar texto
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}


