/**
 * Utilidad para determinar el estado de la conversación de un request
 */

export type ConversationStatus =
  | 'esperando_naova'
  | 'falta_informacion_cliente'
  | 'contactar_proveedor'
  | 'contactando_proveedor'
  | 'completado'

export interface ConversationStatusInfo {
  status: ConversationStatus
  label: string
  color: string
  description: string
}

interface Message {
  direction: 'inbound' | 'outbound'
  createdAt: string
}

interface RequestInfo {
  status: string
  pipelineStage: string
  messages: Message[]
  rules?: {
    missingFields?: string[]
    completeness?: number
  } | null
}

/**
 * Determina el estado de la conversación basado en:
 * - Si hay mensajes sin responder
 * - Si falta información
 * - Si ya tenemos la información completa
 * - Etapa del pipeline
 */
export function getConversationStatus(request: RequestInfo): ConversationStatusInfo {
  const { status, pipelineStage, messages, rules } = request

  // Ordenar mensajes por fecha (más reciente primero)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Verificar si el último mensaje es del cliente (inbound) y no hemos respondido
  const lastMessage = sortedMessages[0]
  const hasUnansweredClientMessage =
    lastMessage && lastMessage.direction === 'inbound'

  // Verificar si hay mensajes outbound después del último inbound
  // Si el último mensaje es inbound, verificamos si hay algún outbound después
  let hasOutboundResponse = false
  if (lastMessage && lastMessage.direction === 'inbound') {
    // El último mensaje es del cliente (inbound)
    // Verificamos si hay algún mensaje outbound (nuestra respuesta) más reciente
    // Como los mensajes están ordenados por fecha descendente, buscamos en los siguientes índices
    // Si encontramos un outbound antes del último inbound, significa que respondimos antes del último mensaje del cliente
    // Necesitamos ver si hay un outbound DESPUÉS (más reciente) que el último inbound
    // Como están ordenados descendente, buscamos en índices anteriores (mensajes más antiguos)
    // Pero en realidad, si el último es inbound, entonces no hay outbound más reciente
    hasOutboundResponse = false // Si el último mensaje es inbound, no hemos respondido aún
  } else if (lastMessage && lastMessage.direction === 'outbound') {
    // El último mensaje es nuestro (outbound), así que sí respondimos
    hasOutboundResponse = true
  }

  // Verificar si falta información
  const missingFields = rules?.missingFields || []
  const hasMissingInfo = missingFields.length > 0
  const completeness = rules?.completeness || 0
  const isComplete = completeness >= 0.8 // Consideramos completo si tiene 80% o más

  // Determinar estado basado en prioridad

  // 1. Si el cliente envió un mensaje y no hemos respondido
  if (hasUnansweredClientMessage && !hasOutboundResponse) {
    return {
      status: 'esperando_naova',
      label: 'Esperando Naova',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'El cliente envió un mensaje y está esperando respuesta',
    }
  }

  // 2. Si falta información del cliente
  if (hasMissingInfo && !isComplete) {
    return {
      status: 'falta_informacion_cliente',
      label: 'Falta información - Cliente',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      description: 'Necesitamos más información del cliente para continuar',
    }
  }

  // 3. Si ya tenemos la información pero no hemos contactado proveedores
  if (
    isComplete &&
    (pipelineStage === 'needs_info' ||
      pipelineStage === 'new_request' ||
      status === 'incomplete_information')
  ) {
    return {
      status: 'contactar_proveedor',
      label: 'Contactar proveedor',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Toda la información está completa, listo para contactar proveedores',
    }
  }

  // 4. Buscando proveedores
  if (pipelineStage === 'finding_suppliers' || status === 'supplier_matching') {
    return {
      status: 'contactando_proveedor',
      label: 'Buscando proveedores',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      description: 'Identificando los mejores proveedores para esta solicitud',
    }
  }

  // 5. Solicitando cotizaciones
  if (
    pipelineStage === 'quotes_in_progress' ||
    status === 'rfq_sent' ||
    status === 'quotes_received'
  ) {
    return {
      status: 'contactando_proveedor',
      label: 'Solicitando cotizaciones',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Enviando RFQ a proveedores y esperando respuestas',
    }
  }

  // 6. Cliente eligiendo cotización
  if (pipelineStage === 'selecting_quote' || status === 'selecting_quote') {
    return {
      status: 'contactando_proveedor',
      label: 'Cliente eligiendo',
      color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      description: 'Mostrando cotizaciones al cliente para que elija',
    }
  }

  // 7. Orden de compra en proceso
  if (
    pipelineStage === 'purchase_in_progress' ||
    status === 'quote_selected' ||
    status === 'po_created' ||
    status === 'in_progress'
  ) {
    return {
      status: 'contactando_proveedor',
      label: 'Orden de compra',
      color: 'bg-green-100 text-green-800 border-green-300',
      description: 'Procesando la orden de compra seleccionada',
    }
  }

  // 5. Por defecto (completado o en otra etapa avanzada)
  return {
    status: 'completado',
    label: 'En proceso',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    description: 'Request en proceso',
  }
}

