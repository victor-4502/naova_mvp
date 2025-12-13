/**
 * Servicio para gestionar requests usando análisis de IA
 * Analiza requests y sugiere acciones (cerrar, eliminar, mantener, etc.)
 * Las acciones NO se aplican automáticamente - solo se sugieren para revisión manual
 */

import { prisma } from '@/lib/prisma'
import { analyzeRequestManagement, type RequestAnalysisContext } from '@/lib/services/ai/RequestManagementAnalyzer'
import { REQUEST_STATUSES } from '@/lib/utils/constants'
import type { RequestStatus, PipelineStage } from '@/lib/types/request'

export interface RequestManagementResult {
  action: 'keep' | 'close' | 'delete' | 'create_new' | 'merge'
  confidence: number
  reason: string
  updatedStatus?: RequestStatus
  updatedPipelineStage?: PipelineStage
  mergeWithRequestId?: string
}

/**
 * Analiza un request y retorna la acción recomendada por la IA
 * NO aplica acciones automáticamente - solo retorna sugerencias para revisión manual
 */
export async function analyzeAndManageRequest(requestId: string): Promise<RequestManagementResult | null> {
  // Obtener el request con todos sus detalles
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      client: {
        select: {
          name: true,
          company: true,
        },
      },
    },
  })

  if (!request) {
    throw new Error('Request no encontrado')
  }

  // Obtener otros requests activos del mismo cliente (para detectar duplicados)
  const allActiveRequests = request.clientId
    ? await prisma.request.findMany({
        where: {
          clientId: request.clientId,
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          client: {
            select: {
              name: true,
              company: true,
            },
          },
        },
      })
    : []

  // Construir contexto para la IA
  const context: RequestAnalysisContext = {
    id: request.id,
    category: request.category,
    subcategory: request.subcategory,
    status: request.status,
    pipelineStage: request.pipelineStage,
    rawContent: request.rawContent || '',
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    messages: request.messages.map(msg => ({
      direction: msg.direction as 'inbound' | 'outbound',
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
    })),
    client: request.client,
  }

  // Analizar con IA
  const analysis = await analyzeRequestManagement(context, allActiveRequests)

  console.log('[RequestManagementService] Análisis completado (solo sugerencia, no se aplica automáticamente):', {
    requestId,
    action: analysis.recommendedAction,
    confidence: analysis.confidence,
    reason: analysis.reason,
  })

  // Retornar solo la sugerencia, sin aplicar acciones
  return {
    action: analysis.recommendedAction,
    confidence: analysis.confidence,
    reason: analysis.reason,
    updatedStatus: analysis.recommendedStatus as RequestStatus | undefined,
    updatedPipelineStage: analysis.recommendedPipelineStage as PipelineStage | undefined,
    mergeWithRequestId: analysis.mergeWithRequestId,
  }
}

/**
 * Analiza un request sin aplicar acciones automáticamente
 * Útil para mostrar recomendaciones al admin antes de tomar acción
 */
export async function analyzeRequestOnly(requestId: string): Promise<RequestManagementResult> {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      client: {
        select: {
          name: true,
          company: true,
        },
      },
    },
  })

  if (!request) {
    throw new Error('Request no encontrado')
  }

  // Obtener otros requests activos del mismo cliente
  const allActiveRequests = request.clientId
    ? await prisma.request.findMany({
        where: {
          clientId: request.clientId,
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          client: {
            select: {
              name: true,
              company: true,
            },
          },
        },
      })
    : []

  const context: RequestAnalysisContext = {
    id: request.id,
    category: request.category,
    subcategory: request.subcategory,
    status: request.status,
    pipelineStage: request.pipelineStage,
    rawContent: request.rawContent || '',
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    messages: request.messages.map(msg => ({
      direction: msg.direction as 'inbound' | 'outbound',
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
    })),
    client: request.client,
  }

  const analysis = await analyzeRequestManagement(context, allActiveRequests)

  return {
    action: analysis.recommendedAction,
    confidence: analysis.confidence,
    reason: analysis.reason,
    updatedStatus: analysis.recommendedStatus as RequestStatus | undefined,
    updatedPipelineStage: analysis.recommendedPipelineStage as PipelineStage | undefined,
    mergeWithRequestId: analysis.mergeWithRequestId,
  }
}

/**
 * Aplica una acción específica a un request (llamada manual por el admin)
 */
export async function applyRequestAction(
  requestId: string,
  action: 'close' | 'delete' | 'update_status',
  data?: {
    status?: RequestStatus
    pipelineStage?: PipelineStage
    mergeWithRequestId?: string
  }
): Promise<void> {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
  })

  if (!request) {
    throw new Error('Request no encontrado')
  }

  switch (action) {
    case 'close':
      await prisma.request.update({
        where: { id: requestId },
        data: {
          status: REQUEST_STATUSES.CANCELLED,
          pipelineStage: 'closed' as PipelineStage,
          updatedAt: new Date(),
        },
      })
      console.log(`[RequestManagementService] ✅ Request ${requestId} cerrado manualmente`)
      break

    case 'delete':
      // Eliminar mensajes primero (para mantener integridad referencial)
      await prisma.message.deleteMany({
        where: { requestId },
      })
      // Eliminar attachments si existen
      await prisma.attachment.deleteMany({
        where: {
          message: {
            requestId,
          },
        },
      })
      // Eliminar el request
      await prisma.request.delete({
        where: { id: requestId },
      })
      console.log(`[RequestManagementService] ✅ Request ${requestId} eliminado manualmente`)
      break

    case 'update_status':
      if (data?.status || data?.pipelineStage) {
        await prisma.request.update({
          where: { id: requestId },
          data: {
            ...(data.status && { status: data.status }),
            ...(data.pipelineStage && { pipelineStage: data.pipelineStage }),
            updatedAt: new Date(),
          },
        })
        console.log(`[RequestManagementService] ✅ Request ${requestId} actualizado manualmente: estado=${data.status}, stage=${data.pipelineStage}`)
      }
      break
  }
}
