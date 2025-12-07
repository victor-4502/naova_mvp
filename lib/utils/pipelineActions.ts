/**
 * Utilidades para determinar qué acciones están disponibles según la etapa del pipeline
 */

import type { PipelineStage } from '@/components/RequestPipeline'

export interface PipelineAction {
  id: string
  label: string
  description: string
  icon: string
  color: string
  endpoint?: string
  requiresConfirmation?: boolean
}

export function getAvailableActions(
  stage: PipelineStage,
  hasCompleteInfo: boolean,
  hasSuppliers: boolean,
  hasRFQ: boolean,
  hasQuotes: boolean,
): PipelineAction[] {
  const actions: PipelineAction[] = []

  switch (stage) {
    case 'new_request':
    case 'needs_info':
      if (!hasCompleteInfo) {
        actions.push({
          id: 'request_info',
          label: 'Solicitar Información',
          description: 'Enviar mensaje al cliente para obtener información faltante',
          icon: 'MessageSquare',
          color: 'bg-blue-500 hover:bg-blue-600',
        })
      } else {
        actions.push({
          id: 'find_suppliers',
          label: 'Buscar Proveedores',
          description: 'Identificar los mejores proveedores para esta solicitud',
          icon: 'Search',
          color: 'bg-purple-500 hover:bg-purple-600',
          endpoint: `/api/requests/${stage}/suppliers`,
        })
      }
      break

    case 'finding_suppliers':
      if (!hasSuppliers) {
        actions.push({
          id: 'find_suppliers',
          label: 'Buscar Proveedores',
          description: 'Identificar los mejores proveedores para esta solicitud',
          icon: 'Search',
          color: 'bg-purple-500 hover:bg-purple-600',
          endpoint: `/api/requests/${stage}/suppliers`,
        })
      } else if (!hasRFQ) {
        actions.push({
          id: 'create_rfq',
          label: 'Crear RFQ',
          description: 'Crear solicitud de cotización para enviar a proveedores',
          icon: 'FileText',
          color: 'bg-indigo-500 hover:bg-indigo-600',
          endpoint: `/api/rfqs`,
        })
        actions.push({
          id: 'view_suppliers',
          label: 'Ver Proveedores',
          description: 'Ver la lista de proveedores encontrados',
          icon: 'Users',
          color: 'bg-gray-500 hover:bg-gray-600',
        })
      }
      break

    case 'quotes_in_progress':
      if (!hasRFQ) {
        actions.push({
          id: 'create_rfq',
          label: 'Crear RFQ',
          description: 'Crear solicitud de cotización para enviar a proveedores',
          icon: 'FileText',
          color: 'bg-indigo-500 hover:bg-indigo-600',
        })
      } else {
        actions.push({
          id: 'send_rfq',
          label: 'Enviar RFQ a Proveedores',
          description: 'Enviar solicitud de cotización a los proveedores seleccionados',
          icon: 'Send',
          color: 'bg-green-500 hover:bg-green-600',
          requiresConfirmation: true,
        })
        actions.push({
          id: 'view_rfq',
          label: 'Ver RFQ',
          description: 'Ver detalles de la solicitud de cotización',
          icon: 'Eye',
          color: 'bg-gray-500 hover:bg-gray-600',
        })
      }
      break

    case 'selecting_quote':
      if (hasQuotes) {
        actions.push({
          id: 'compare_quotes',
          label: 'Comparar Cotizaciones',
          description: 'Ver y comparar todas las cotizaciones recibidas',
          icon: 'BarChart',
          color: 'bg-blue-500 hover:bg-blue-600',
        })
        actions.push({
          id: 'send_to_client',
          label: 'Enviar al Cliente',
          description: 'Enviar cotizaciones al cliente para que elija',
          icon: 'Mail',
          color: 'bg-purple-500 hover:bg-purple-600',
        })
      } else {
        actions.push({
          id: 'wait_quotes',
          label: 'Esperando Cotizaciones',
          description: 'Esperando respuestas de los proveedores',
          icon: 'Clock',
          color: 'bg-yellow-500 hover:bg-yellow-600',
        })
      }
      break

    case 'purchase_in_progress':
      actions.push({
        id: 'create_po',
        label: 'Crear Orden de Compra',
        description: 'Crear orden de compra con el proveedor seleccionado',
        icon: 'ShoppingCart',
        color: 'bg-green-500 hover:bg-green-600',
      })
      actions.push({
        id: 'track_order',
        label: 'Rastrear Orden',
        description: 'Ver estado de la orden de compra',
        icon: 'Package',
        color: 'bg-blue-500 hover:bg-blue-600',
      })
      break

    case 'delivered':
      actions.push({
        id: 'close_request',
        label: 'Cerrar Request',
        description: 'Marcar el request como completado',
        icon: 'CheckCircle',
        color: 'bg-gray-500 hover:bg-gray-600',
        requiresConfirmation: true,
      })
      break

    default:
      break
  }

  // Acción siempre disponible: responder mensaje
  actions.push({
    id: 'reply_message',
    label: 'Responder Mensaje',
    description: 'Enviar mensaje al cliente',
    icon: 'MessageSquare',
    color: 'bg-primary hover:bg-purple-700',
  })

  return actions
}

