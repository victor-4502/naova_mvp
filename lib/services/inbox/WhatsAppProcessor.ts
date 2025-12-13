// WhatsApp Processor - Procesa mensajes de WhatsApp (stub para integración futura)

import { prisma } from '@/lib/prisma'
import type { RequestSource } from '@/lib/types/request'
import { InboxService, type CreateRequestInput } from './InboxService'
import { analyzeRequestContinuation, type RequestContext } from '@/lib/services/ai/RequestContinuationAnalyzer'

export interface WhatsAppWebhookPayload {
  from: string
  to: string
  message: {
    id: string
    type: 'text' | 'image' | 'document' | 'audio' | 'video'
    text?: {
      body: string
    }
    image?: {
      caption?: string
      mime_type: string
      sha256: string
      id: string
    }
    document?: {
      caption?: string
      filename: string
      mime_type: string
      sha256: string
      id: string
    }
  }
  timestamp: string
}

export class WhatsAppProcessor {
  /**
   * Procesa un webhook de WhatsApp
   */
  static async processWebhook(
    payload: WhatsAppWebhookPayload,
    clientId?: string  // Opcional: puede ser undefined si no se identifica cliente
  ) {
    // Extraer contenido del mensaje
    let content = ''
    const attachments: CreateRequestInput['attachments'] = []
    
    if (payload.message.type === 'text' && payload.message.text) {
      content = payload.message.text.body
    } else if (payload.message.type === 'image' && payload.message.image) {
      content = payload.message.image.caption || 'Imagen recibida'
      // TODO: Descargar imagen y subirla a storage
      attachments.push({
        filename: `image_${payload.message.image.id}.jpg`,
        mimeType: payload.message.image.mime_type,
        size: 0, // TODO: Obtener tamaño real
        url: '', // TODO: URL del storage
      })
    } else if (payload.message.type === 'document' && payload.message.document) {
      content = payload.message.document.caption || 'Documento recibido'
      // TODO: Descargar documento y subirla a storage
      attachments.push({
        filename: payload.message.document.filename,
        mimeType: payload.message.document.mime_type,
        size: 0, // TODO: Obtener tamaño real
        url: '', // TODO: URL del storage
      })
    }
    
    if (!content) {
      throw new Error('No se pudo extraer contenido del mensaje de WhatsApp')
    }
    
    // ANTES DE CREAR UN NUEVO REQUEST, verificar si hay un request activo/reciente
    // para este número de teléfono (continuación de conversación)
    // Ahora con análisis de IA para determinar si es continuación o nuevo requerimiento
    const activeRequest = await this.findActiveRequest(payload.from, clientId, content)
    
    if (activeRequest) {
      console.log(`[WhatsAppProcessor] Mensaje agregado a request existente: ${activeRequest.id}`)
      
      // Agregar el mensaje al request existente
      const message = await InboxService.addMessageToRequest(activeRequest.id, {
        source: 'whatsapp',
        sourceId: payload.message.id,
        content,
        metadata: {
          from: payload.from,
          to: payload.to,
          timestamp: payload.timestamp,
          messageType: payload.message.type,
        },
        attachments: attachments.length > 0 ? attachments : undefined,
      })
      
      // Obtener el request actualizado para retornarlo
      const request = await prisma.request.findUnique({
        where: { id: activeRequest.id },
      })
      
      if (!request) {
        throw new Error('Request no encontrado después de agregar mensaje')
      }
      
      return request
    }
    
    // Si no hay request activo, crear uno nuevo
    console.log(`[WhatsAppProcessor] Creando nuevo request para: ${payload.from}`)
    const request = await InboxService.createRequest({
      source: 'whatsapp',
      sourceId: payload.message.id,
      clientId,
      content,
      attachments: attachments.length > 0 ? attachments : undefined,
      metadata: {
        from: payload.from,
        to: payload.to,
        timestamp: payload.timestamp,
        messageType: payload.message.type,
      },
    })
    
    return request
  }

  /**
   * Identifica el cliente desde un número de WhatsApp
   * Busca en teléfono principal y en contactos adicionales
   */
  static async identifyClient(whatsappNumber: string): Promise<string | null> {
    // Normalizar número (quitar espacios, +, etc.)
    const normalizedNumber = whatsappNumber.replace(/[\s\+\-\(\)]/g, '')
    
    // Primero buscar por teléfono principal
    const userByPhone = await prisma.user.findFirst({
      where: {
        phone: {
          contains: normalizedNumber,
        },
      },
    })
    
    if (userByPhone && userByPhone.role === 'client_enterprise') {
      return userByPhone.id
    }
    
    // Si no se encuentra, buscar en contactos adicionales
    const contact = await prisma.clientContact.findFirst({
      where: {
        type: 'phone',
        value: {
          contains: normalizedNumber,
        },
      },
      include: {
        user: true,
      },
    })
    
    if (contact && contact.user.role === 'client_enterprise') {
      return contact.user.id
    }
    
    return null
  }

  /**
   * Busca un request activo/reciente para un número de WhatsApp
   * Ahora usa IA para determinar si el nuevo mensaje es continuación o un nuevo requerimiento
   * 
   * Un request se considera "activo" si:
   * - Tiene el mismo número de teléfono en algún mensaje
   * - Es del mismo canal (whatsapp)
   * - No está cerrado, o fue cerrado recientemente (últimos 7 días)
   * - Tiene actividad reciente (últimos 7 días)
   * 
   * Y ahora también verifica con IA que el nuevo mensaje sea continuación del mismo tema
   */
  static async findActiveRequest(
    whatsappNumber: string,
    clientId?: string,
    newMessageContent?: string // Contenido del nuevo mensaje para análisis con IA
  ): Promise<{ id: string } | null> {
    // Normalizar número
    const normalizedNumber = whatsappNumber.replace(/[\s\+\-\(\)]/g, '')
    
    // Fecha límite: últimos 7 días para considerar un request "activo"
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Buscar requests de WhatsApp que:
    // 1. Tengan el mismo cliente (si clientId está disponible)
    // 2. Tengan un mensaje entrante con el mismo número de teléfono
    // 3. No estén cerrados, o fueron cerrados recientemente
    // 4. Tengan actividad reciente (mensajes o actualizaciones en los últimos 7 días)

    // Buscar requests activos con una consulta más simple
    // Un request es activo si:
    // - Es de WhatsApp
    // - Tiene mensajes del mismo número
    // - No está cerrado O fue cerrado recientemente
    // - Tiene actividad reciente
    
    const whereClause: any = {
      source: 'whatsapp',
      ...(clientId ? { clientId } : {}),
      messages: {
        some: {
          direction: 'inbound',
          from: {
            contains: normalizedNumber,
          },
        },
      },
      AND: [
        {
          OR: [
            // Requests no cerrados
            {
              pipelineStage: {
                not: 'closed',
              },
            },
            // O cerrados recientemente (últimos 7 días)
            {
              pipelineStage: 'closed',
              updatedAt: {
                gte: sevenDaysAgo,
              },
            },
          ],
        },
        {
          OR: [
            // Request actualizado recientemente
            {
              updatedAt: {
                gte: sevenDaysAgo,
              },
            },
            // O tiene mensajes recientes
            {
              messages: {
                some: {
                  createdAt: {
                    gte: sevenDaysAgo,
                  },
                },
              },
            },
          ],
        },
      ],
    }

    const activeRequests = await prisma.request.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 1, // Solo el más reciente
    })

    if (activeRequests.length > 0) {
      const request = activeRequests[0]
      
      // Verificar que el mensaje es realmente del mismo número
      const matchingMessage = request.messages.find(m => 
        m.direction === 'inbound' && 
        m.from && 
        m.from.replace(/[\s\+\-\(\)]/g, '').includes(normalizedNumber.slice(-10))
      )
      
      if (matchingMessage) {
        // Si tenemos contenido del nuevo mensaje, usar IA para determinar si es continuación
        if (newMessageContent && newMessageContent.trim().length > 0) {
          // Construir contexto del request para análisis de IA
          const requestContext: RequestContext = {
            id: request.id,
            category: request.category,
            subcategory: request.subcategory,
            rawContent: request.rawContent || '',
            messages: request.messages.map(msg => ({
              direction: msg.direction as 'inbound' | 'outbound',
              content: msg.content,
              timestamp: msg.createdAt.toISOString(),
            })),
          }
          
          // Usar IA para analizar si es continuación
          const analysis = await analyzeRequestContinuation(newMessageContent, requestContext)
          
          console.log('[WhatsAppProcessor] Análisis de continuación con IA:', {
            requestId: request.id,
            isContinuation: analysis.isContinuation,
            confidence: analysis.confidence,
            reason: analysis.reason,
          })
          
          // Solo continuar si la IA dice que es continuación con confianza >= 0.6
          if (analysis.isContinuation && analysis.confidence >= 0.6) {
            console.log(`[WhatsAppProcessor] ✅ Request activo confirmado por IA: ${request.id}`)
            return { id: request.id }
          } else {
            console.log(`[WhatsAppProcessor] ❌ IA determinó que es nuevo requerimiento. Creando nuevo request.`)
            return null
          }
        } else {
          // Si no hay contenido del nuevo mensaje, usar lógica original
          console.log(`[WhatsAppProcessor] Request activo encontrado (sin análisis IA): ${request.id}`)
          return { id: request.id }
        }
      }
    }

    // Si no encontramos por cliente, buscar solo por número de teléfono
    if (!clientId) {
      const requestsByPhone = await prisma.request.findMany({
        where: {
          source: 'whatsapp',
          messages: {
            some: {
              direction: 'inbound',
              from: {
                contains: normalizedNumber,
              },
            },
          },
          AND: [
            {
              OR: [
                {
                  pipelineStage: {
                    not: 'closed',
                  },
                },
                {
                  pipelineStage: 'closed',
                  updatedAt: {
                    gte: sevenDaysAgo,
                  },
                },
              ],
            },
            {
              OR: [
                {
                  updatedAt: {
                    gte: sevenDaysAgo,
                  },
                },
                {
                  messages: {
                    some: {
                      createdAt: {
                        gte: sevenDaysAgo,
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
        include: {
          messages: {
            where: {
              from: {
                contains: normalizedNumber,
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 1,
      })

      if (requestsByPhone.length > 0) {
        const request = requestsByPhone[0]
        
        // Si tenemos contenido del nuevo mensaje, usar IA para determinar si es continuación
        if (newMessageContent && newMessageContent.trim().length > 0) {
          // Obtener todos los mensajes del request para el contexto
          const requestWithMessages = await prisma.request.findUnique({
            where: { id: request.id },
            include: {
              messages: {
                orderBy: { createdAt: 'asc' },
              },
            },
          })
          
          if (requestWithMessages) {
            // Construir contexto del request para análisis de IA
            const requestContext: RequestContext = {
              id: requestWithMessages.id,
              category: requestWithMessages.category,
              subcategory: requestWithMessages.subcategory,
              rawContent: requestWithMessages.rawContent || '',
              messages: requestWithMessages.messages.map(msg => ({
                direction: msg.direction as 'inbound' | 'outbound',
                content: msg.content,
                timestamp: msg.createdAt.toISOString(),
              })),
            }
            
            // Usar IA para analizar si es continuación
            const analysis = await analyzeRequestContinuation(newMessageContent, requestContext)
            
            console.log('[WhatsAppProcessor] Análisis de continuación con IA (por número):', {
              requestId: request.id,
              isContinuation: analysis.isContinuation,
              confidence: analysis.confidence,
              reason: analysis.reason,
            })
            
            // Solo continuar si la IA dice que es continuación con confianza >= 0.6
            if (analysis.isContinuation && analysis.confidence >= 0.6) {
              console.log(`[WhatsAppProcessor] ✅ Request activo confirmado por IA (por número): ${request.id}`)
              return { id: request.id }
            } else {
              console.log(`[WhatsAppProcessor] ❌ IA determinó que es nuevo requerimiento (por número). Creando nuevo request.`)
              return null
            }
          }
        }
        
        // Si no hay contenido del nuevo mensaje, usar lógica original
        console.log(`[WhatsAppProcessor] Request activo encontrado por número (sin análisis IA): ${request.id}`)
        return { id: request.id }
      }
    }

    return null
  }
}

