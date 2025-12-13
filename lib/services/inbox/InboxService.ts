// Inbox Service - Orquestador principal del módulo de Inbox

import { prisma } from '@/lib/prisma'
import { ContentExtractor, type ExtractedContent } from './ContentExtractor'
import { ClassificationService, type ClassificationResult } from './ClassificationService'
import type { RequestSource, RequestStatus, PipelineStage } from '@/lib/types/request'
import { REQUEST_STATUSES, PIPELINE_STAGES } from '@/lib/utils/constants'
import { RequestRuleEngine } from './RequestRuleEngine'
import { AutoReplyService } from './AutoReplyService'
import { CompletionMessageService } from './CompletionMessageService'

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
    // Para emails, el input.content puede incluir el subject
    // Necesitamos extraer solo el cuerpo para guardarlo en el mensaje
    let messageContent = input.content
    let contentForAnalysis = input.content
    
    // Si es un email y el contenido incluye el subject al inicio, separarlo
    if (input.source === 'email' && input.metadata?.subject) {
      const subject = input.metadata.subject
      // Si el contenido empieza con el subject, removerlo
      if (messageContent.startsWith(subject)) {
        messageContent = messageContent.substring(subject.length).trim()
        // Si empieza con saltos de línea, removerlos
        messageContent = messageContent.replace(/^\n+\s*/, '')
      }
      // Si el contenido es exactamente el subject, está vacío
      if (messageContent === subject || messageContent.trim().length === 0) {
        // El contenido del email está vacío, usar solo el subject
        messageContent = input.metadata.subject
      }
    }
    
    // Extraer información del contenido (usar el contenido completo para análisis)
    const extracted = ContentExtractor.extract(contentForAnalysis)
    
    // Clasificar el request
    const classification = ClassificationService.classify(
      contentForAnalysis,
      input.source,
      input.metadata
    )

    // Analizar reglas por categoría para determinar campos faltantes
    // Pasar el contenido original para búsqueda directa de keywords si no se encuentra categoría
    const ruleAnalysis = RequestRuleEngine.analyze(extracted, classification, contentForAnalysis)
    
    // Determinar estado inicial
    const { status, pipelineStage } = this.determineInitialStatus(
      extracted,
      classification,
      ruleAnalysis.completeness,
      ruleAnalysis // Pasar el análisis completo para verificar campos faltantes
    )
    
    // Crear request en la base de datos
    // Construir el objeto data, incluyendo sourceId solo si está definido
    const requestData: any = {
      source: input.source,
      clientId: input.clientId,
      status,
      pipelineStage,
      rawContent: contentForAnalysis, // Para análisis completo
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
          content: messageContent, // Guardar solo el contenido del cuerpo (sin subject)
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

    // Si el request está completo desde el inicio, generar mensaje de confirmación
    if (status === REQUEST_STATUSES.READY_FOR_SUPPLIER_MATCHING) {
      try {
        await CompletionMessageService.maybeSendCompletionMessage(
          request.id,
          '', // No hay estado anterior
          status
        )
      } catch (error) {
        console.warn('[InboxService] Error al generar mensaje de confirmación inicial:', error)
      }
    }

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
    rulesCompleteness: number,
    ruleAnalysis?: { missingFields: any[]; categoryRule: any } // Agregar análisis de reglas
  ): { status: RequestStatus; pipelineStage: PipelineStage } {
    // Si tenemos reglas aplicables, usar la lógica de reglas
    if (ruleAnalysis?.categoryRule) {
      const hasMissingRequiredFields = ruleAnalysis.missingFields.length > 0
      
      // Si faltan campos requeridos, está incompleto (sin importar el porcentaje)
      if (hasMissingRequiredFields) {
        return {
          status: REQUEST_STATUSES.INCOMPLETE_INFORMATION,
          pipelineStage: PIPELINE_STAGES.NEEDS_INFO,
        }
      }
      
      // Si no faltan campos requeridos, está completo
      // (pero aún validamos que tenga al menos 80% de completitud para seguridad)
      if (rulesCompleteness >= 0.8) {
        return {
          status: REQUEST_STATUSES.READY_FOR_SUPPLIER_MATCHING,
          pipelineStage: PIPELINE_STAGES.FINDING_SUPPLIERS,
        }
      }
    }

    // Fallback si no hay reglas aplicables
    const hasCategory = !!classification.category
    const hasItems = extracted.items.length > 0
    const hasQuantities = extracted.quantities.length > 0
    
    // Solo considerar completo si tiene categoría Y tiene items/cantidades
    // Pero aún así, si hay reglas y faltan campos, NO está completo
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
   * Re-analiza el request completo y genera nuevo mensaje automático si faltan campos
   */
  static async addMessageToRequest(
    requestId: string,
    input: {
      source: RequestSource
      sourceId?: string
      content: string
      metadata?: {
        from?: string
        fromName?: string
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
    // Obtener el request existente con todos sus mensajes
    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!existingRequest) {
      throw new Error('Request no encontrado')
    }

    // Crear el mensaje asociado al request existente
    const message = await prisma.message.create({
      data: {
        requestId,
        source: input.source === 'file' || input.source === 'api' ? 'web' : input.source,
        sourceId: input.sourceId,
        direction: 'inbound',
        content: input.content,
        ...(input.metadata?.from && { from: input.metadata.from }),
        ...(input.metadata?.fromName && !input.metadata?.from && { from: input.metadata.fromName }),
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

    // Reconstruir el contenido completo concatenando todos los mensajes inbound
    const allMessages = [...existingRequest.messages, message].filter(m => m.direction === 'inbound')
    const fullContent = allMessages
      .map(m => {
        // Para emails, incluir subject si existe
        if (m.subject && m.source === 'email') {
          return `${m.subject}\n\n${m.content}`
        }
        return m.content
      })
      .join('\n\n')

    console.log('[InboxService] Re-analizando request con nuevo mensaje:', {
      requestId,
      totalMessages: allMessages.length,
      contentLength: fullContent.length,
    })

    // Re-analizar el contenido completo
    const extracted = ContentExtractor.extract(fullContent)
    const classification = ClassificationService.classify(
      fullContent,
      existingRequest.source as RequestSource,
      input.metadata
    )
    const ruleAnalysis = RequestRuleEngine.analyze(extracted, classification, fullContent)

    // Determinar nuevo estado basado en el análisis actualizado
    const { status, pipelineStage } = this.determineInitialStatus(
      extracted,
      classification,
      ruleAnalysis.completeness,
      ruleAnalysis // Pasar el análisis completo para verificar campos faltantes
    )

    // Guardar el estado anterior para detectar cambios
    const previousStatus = existingRequest.status

    // Actualizar el request con el nuevo análisis
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        updatedAt: new Date(),
        rawContent: fullContent, // Actualizar con contenido completo
        status,
        pipelineStage,
        category: classification.category || existingRequest.category || undefined,
        subcategory: classification.subcategory || existingRequest.subcategory || undefined,
        urgency: classification.urgency || existingRequest.urgency,
        normalizedContent: {
          extracted,
          classification,
          rules: {
            categoryRuleId: ruleAnalysis.categoryRule?.id || null,
            presentFields: ruleAnalysis.presentFields,
            missingFields: ruleAnalysis.missingFields,
            completeness: ruleAnalysis.completeness,
            // Mantener el estado de autoReplyEnabled existente
            autoReplyEnabled: (existingRequest.normalizedContent as any)?.rules?.autoReplyEnabled !== false,
          },
        } as any,
      },
    })

    // Si cambió de INCOMPLETE a READY_FOR_SUPPLIER_MATCHING, generar mensaje de confirmación
    if (previousStatus !== status) {
      try {
        await CompletionMessageService.maybeSendCompletionMessage(
          requestId,
          previousStatus,
          status
        )
      } catch (error) {
        console.warn('[InboxService] Error al generar mensaje de confirmación:', error)
      }
    }

    // Si aún faltan campos, generar nuevo mensaje automático
    try {
      console.log('[InboxService] Verificando si generar nuevo mensaje automático:', {
        missingFields: ruleAnalysis.missingFields.length,
        completeness: ruleAnalysis.completeness,
      })
      
      await AutoReplyService.maybeSendAutoReply(updatedRequest)
    } catch (error) {
      console.warn('[InboxService] No se pudo generar respuesta automática para el request actualizado:', error)
    }

    return message
  }
}

