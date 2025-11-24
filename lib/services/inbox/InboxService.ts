// Inbox Service - Orquestador principal del módulo de Inbox

import { prisma } from '@/lib/prisma'
import { ContentExtractor, type ExtractedContent } from './ContentExtractor'
import { ClassificationService, type ClassificationResult } from './ClassificationService'
import type { RequestSource, RequestStatus, PipelineStage } from '@/lib/types/request'
import { REQUEST_STATUSES, PIPELINE_STAGES } from '@/lib/utils/constants'

export interface CreateRequestInput {
  source: RequestSource
  sourceId?: string
  clientId: string
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
  clientId: string
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
    
    // Determinar estado inicial
    const { status, pipelineStage } = this.determineInitialStatus(
      extracted,
      classification
    )
    
    // Crear request en la base de datos
    const request = await prisma.request.create({
      data: {
        source: input.source,
        sourceId: input.sourceId,
        clientId: input.clientId,
        status,
        pipelineStage,
        rawContent: input.content,
        normalizedContent: {
          extracted,
          classification,
        } as any,
        category: classification.category || undefined,
        subcategory: classification.subcategory || undefined,
        urgency: classification.urgency,
        messages: {
          create: {
            source: input.source === 'file' ? 'web' : input.source,
            sourceId: input.sourceId,
            direction: 'inbound',
            content: input.content,
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
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        attachments: true,
      },
    })
    
    return request
  }

  /**
   * Determina el estado inicial del request
   */
  private static determineInitialStatus(
    extracted: ExtractedContent,
    classification: ClassificationResult
  ): { status: RequestStatus; pipelineStage: PipelineStage } {
    // Si no hay información suficiente, marcar como incompleto
    const hasCategory = !!classification.category
    const hasItems = extracted.items.length > 0
    const hasQuantities = extracted.quantities.length > 0
    
    const isComplete = hasCategory && (hasItems || hasQuantities)
    
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
      clientId: request.clientId,
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
}

