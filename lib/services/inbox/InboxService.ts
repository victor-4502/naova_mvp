// Inbox Service - Orquestador principal del módulo de Inbox

import { prisma } from '@/lib/prisma'
import { ContentExtractor, type ExtractedContent } from './ContentExtractor'
import { ClassificationService, type ClassificationResult } from './ClassificationService'
import type { RequestSource, RequestStatus, PipelineStage } from '@/lib/types/request'
import { REQUEST_STATUSES, PIPELINE_STAGES } from '@/lib/utils/constants'
import { RequestRuleEngine } from './RequestRuleEngine'
import { AutoReplyService } from './AutoReplyService'

export interface CreateRequestInput {
  source: RequestSource
  sourceId?: string
  clientId?: string  // Opcional: puede ser null si no se identifica cliente
  content: string
  attachments?: Array<{
    filename: string
    mimeType: string
    size: number
    url: string
  }>
  metadata?: Record<string, any>
}

export interface RequestWithDetails {
  id: string
  source: RequestSource
  sourceId?: string
  clientId?: string  // Opcional: puede ser null
  status: RequestStatus
  pipelineStage: PipelineStage
  rawContent: string
  normalizedContent?: Record<string, any>
  category?: string
  subcategory?: string
  urgency: string
  createdAt: Date
  updatedAt: Date
  messages: Array<{
    id: string
    content: string
    source: string
    direction: string
    createdAt: Date
  }>
  attachments: Array<{
    id: string
    filename: string
    mimeType: string
    size: number
    url: string
  }>
}

export class InboxService {
  /**
   * Crea un nuevo request desde un mensaje entrante
   */
  static async createRequest(input: CreateRequestInput) {
    // Extraer información del contenido
    const extracted = ContentExtractor.extract(input.content)
    
    // Clasificar el request
    const classification = ClassificationService.classify(
      input.content,
      input.source,
      input.metadata
    )

    // Analizar reglas por categoría para determinar campos faltantes
    // Pasar el contenido original para búsqueda directa de keywords si no se encuentra categoría
    const ruleAnalysis = RequestRuleEngine.analyze(extracted, classification, input.content)
    
    // Determinar estado inicial
    const { status, pipelineStage } = this.determineInitialStatus(
      extracted,
      classification,
      ruleAnalysis.completeness
    )
    
    // Crear request en la base de datos
    // Construir el objeto data, incluyendo sourceId solo si está definido
    const requestData: any = {
      source: input.source,
      clientId: input.clientId,
      status,
      pipelineStage,
      rawContent: input.content,
      normalizedContent: {
        extracted,
        classification,
        rules: {
          categoryRuleId: ruleAnalysis.categoryRule?.id || null,
          presentFields: ruleAnalysis.presentFields,
          missingFields: ruleAnalysis.missingFields,
          completeness: ruleAnalysis.completeness,
          // Por defecto activamos la auto-respuesta; se puede cambiar en /admin/requests
          autoReplyEnabled: true,
        },
      } as any,
      category: classification.category || undefined,
      subcategory: classification.subcategory || undefined,
      urgency: classification.urgency,
      messages: {
        create: {
          source: input.source === 'file' || input.source === 'api' ? 'web' : input.source,
          sourceId: input.sourceId,
          direction: 'inbound',
          content: input.content,
          // Agregar campos from, to, subject desde metadata si están disponibles
          ...(input.metadata?.from && { from: input.metadata.from }),
          ...(input.metadata?.fromName && !input.metadata?.from && { from: input.metadata.fromName }),
          ...(input.metadata?.to && {
            to: Array.isArray(input.metadata.to) ? input.metadata.to.join(', ') : input.metadata.to
          }),
          ...(input.metadata?.subject && { subject: input.metadata.subject }),
          processed: true,
          processedAt: new Date(),
        },
      },
      attachments: input.attachments
        ? {
            create: input.attachments.map(att => ({
              filename: att.filename,
              mimeType: att.mimeType,
              size: att.size,
              url: att.url,
            })),
          }
        : undefined,
    }

    // Agregar sourceId solo si está definido (para evitar errores si la columna no existe en la BD)
    if (input.sourceId) {
      requestData.sourceId = input.sourceId
    }

    // Construir el include de forma condicional para evitar errores si la tabla Attachment no existe
    const includeOptions: any = {
      messages: {
        orderBy: { createdAt: 'desc' as const },
        take: 10,
      },
    }

    // Solo incluir attachments si hay attachments en el input
    if (input.attachments && input.attachments.length > 0) {
      includeOptions.attachments = true
    }

    const request = await prisma.request.create({
      data: requestData,
      include: includeOptions,
    })

    // Intentar generar una respuesta automática si el request quedó incompleto
    try {
      await AutoReplyService.maybeSendAutoReply(request)
    } catch (error) {
      console.warn('No se pudo generar respuesta automática para el request:', error)
    }

    return request
  }

  /**
   * Determina el estado inicial del request
   */
  private static determineInitialStatus(
    extracted: ExtractedContent,
    classification: ClassificationResult,
    rulesCompleteness: number
  ): { status: RequestStatus; pipelineStage: PipelineStage } {
    // Si no hay información suficiente, marcar como incompleto
    const hasCategory = !!classification.category
    const hasItems = extracted.items.length > 0
    const hasQuantities = extracted.quantities.length > 0

    // Usar reglas si tenemos completitud calculada (>0 indica que había alguna regla aplicable)
    let isComplete: boolean
    if (rulesCompleteness > 0) {
      // Por ahora consideramos "suficientemente completo" si tiene al menos 80% de campos requeridos
      isComplete = rulesCompleteness >= 0.8
    } else {
      // Fallback simple anterior
      isComplete = hasCategory && (hasItems || hasQuantities)
    }

    if (!isComplete) {
      return {
        status: REQUEST_STATUSES.INCOMPLETE_INFORMATION,
        pipelineStage: PIPELINE_STAGES.NEEDS_INFO,
      }
    }
    
    // Si está completo, está listo para matching
    return {
      status: REQUEST_STATUSES.READY_FOR_SUPPLIER_MATCHING,
      pipelineStage: PIPELINE_STAGES.FINDING_SUPPLIERS,
    }
  }

  /**
   * Obtiene todos los requests de un cliente
   */
  static async getClientRequests(clientId: string) {
    return prisma.request.findMany({
      where: { clientId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        attachments: true,
        specs: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Obtiene un request por ID
   */
  static async getRequestById(requestId: string): Promise<RequestWithDetails | null> {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
        },
        attachments: true,
        specs: {
          include: {
            items: true,
          },
        },
      },
    })
    
    if (!request) return null
    
    return {
      id: request.id,
      source: request.source as RequestSource,
      sourceId: request.sourceId || undefined,
      clientId: request.clientId || undefined,
      status: request.status as RequestStatus,
      pipelineStage: request.pipelineStage as PipelineStage,
      rawContent: request.rawContent,
      normalizedContent: request.normalizedContent as Record<string, any> | undefined,
      category: request.category || undefined,
      subcategory: request.subcategory || undefined,
      urgency: request.urgency,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      messages: request.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        source: msg.source,
        direction: msg.direction,
        createdAt: msg.createdAt,
      })),
      attachments: request.attachments.map(att => ({
        id: att.id,
        filename: att.filename,
        mimeType: att.mimeType,
        size: att.size,
        url: att.url,
      })),
    }
  }

  /**
   * Actualiza el estado de un request
   */
  static async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    pipelineStage: PipelineStage
  ) {
    return prisma.request.update({
      where: { id: requestId },
      data: {
        status,
        pipelineStage,
        updatedAt: new Date(),
      },
    })
  }

  /**
   * Agrega un mensaje entrante a un request existente
   */
  static async addMessageToRequest(
    requestId: string,
    input: {
      source: RequestSource
      sourceId?: string
      content: string
      metadata?: {
        from?: string
        to?: string
        subject?: string
        timestamp?: string
        messageType?: string
      }
      attachments?: Array<{
        filename: string
        mimeType: string
        size: number
        url: string
      }>
    }
  ) {
    // Crear el mensaje asociado al request existente
    const message = await prisma.message.create({
      data: {
        requestId,
        source: input.source === 'file' || input.source === 'api' ? 'web' : input.source,
        sourceId: input.sourceId,
        direction: 'inbound',
        content: input.content,
        ...(input.metadata?.from && { from: input.metadata.from }),
        ...(input.metadata?.to && {
          to: Array.isArray(input.metadata.to) ? input.metadata.to.join(', ') : input.metadata.to
        }),
        ...(input.metadata?.subject && { subject: input.metadata.subject }),
        processed: true,
        processedAt: new Date(),
        attachments: input.attachments
          ? {
              create: input.attachments.map(att => ({
                filename: att.filename,
                mimeType: att.mimeType,
                size: att.size,
                url: att.url,
              })),
            }
          : undefined,
      },
      include: {
        request: true,
        attachments: true,
      },
    })

    // Actualizar el rawContent del request con el nuevo contenido
    // (opcional: podemos mantener solo el primero o concatenar)
    await prisma.request.update({
      where: { id: requestId },
      data: {
        updatedAt: new Date(),
      },
    })

    return message
  }
}

