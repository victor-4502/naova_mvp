// Email Processor - Procesa emails entrantes

import { prisma } from '@/lib/prisma'
import type { RequestSource } from '@/lib/types/request'
import { InboxService, type CreateRequestInput } from './InboxService'
import { analyzeRequestContinuation, type RequestContext } from '@/lib/services/ai/RequestContinuationAnalyzer'

export interface EmailWebhookPayload {
  from: {
    email: string
    name?: string
  }
  to: string[]
  subject: string
  text: string
  html?: string
  messageId: string
  timestamp: string
  attachments?: Array<{
    filename: string
    mimeType: string
    size: number
    url: string
  }>
}

export class EmailProcessor {
  /**
   * Procesa un email entrante desde el webhook
   */
  static async processEmail(
    payload: EmailWebhookPayload,
    clientId?: string  // Opcional: puede ser undefined si no se identifica cliente
  ) {
    // Extraer contenido del email (preferir texto plano, luego HTML)
    // IMPORTANTE: payload.text y payload.html pueden venir vacíos o undefined
    let content = ''
    
    console.log('[EmailProcessor] 📧 Payload completo recibido:', {
      subject: payload.subject,
      hasText: !!payload.text,
      hasHtml: !!payload.html,
      textValue: payload.text || '(vacío)',
      htmlValue: payload.html ? payload.html.substring(0, 200) : '(vacío)',
      textLength: payload.text?.length || 0,
      htmlLength: payload.html?.length || 0,
    })
    
    // Prioridad 1: Usar texto plano si existe y no está vacío
    if (payload.text && payload.text.trim().length > 0) {
      content = payload.text.trim()
      console.log('[EmailProcessor] ✅ Usando texto plano:', content.substring(0, 100))
    }
    // Prioridad 2: Si no hay texto, extraer de HTML
    else if (payload.html && payload.html.trim().length > 0) {
      console.log('[EmailProcessor] 📄 Extrayendo texto desde HTML...')
      // Remover tags HTML y limpiar
      content = payload.html
        .replace(/<style[^>]*>.*?<\/style>/gi, ' ') // Remover estilos
        .replace(/<script[^>]*>.*?<\/script>/gi, ' ') // Remover scripts
        .replace(/<head[^>]*>.*?<\/head>/gi, ' ') // Remover head
        .replace(/<[^>]+>/g, ' ') // Remover tags HTML
        .replace(/&nbsp;/g, ' ') // Reemplazar &nbsp;
        .replace(/&amp;/g, '&') // Reemplazar &amp;
        .replace(/&lt;/g, '<') // Reemplazar &lt;
        .replace(/&gt;/g, '>') // Reemplazar &gt;
        .replace(/&quot;/g, '"') // Reemplazar &quot;
        .replace(/&#39;/g, "'") // Reemplazar &#39;
        .replace(/&apos;/g, "'") // Reemplazar &apos;
        .replace(/\s+/g, ' ') // Normalizar espacios múltiples
        .trim()
      
      console.log('[EmailProcessor] ✅ Texto extraído desde HTML:', content.substring(0, 100))
    }
    
    // Si el contenido sigue vacío después de todo, usar el subject como fallback
    if (!content || content.trim().length === 0) {
      console.warn('[EmailProcessor] ⚠️ Contenido vacío después de procesar, usando subject como fallback')
      content = payload.subject || 'Sin contenido'
    }
    
    // Para el análisis completo, combinar subject y body
    // PERO para mostrar al usuario, solo usar el contenido del cuerpo
    const fullContent = payload.subject && !content.includes(payload.subject)
      ? `${payload.subject}\n\n${content}`
      : content
    
    console.log('[EmailProcessor] 📝 Contenido final:', {
      contentLength: content.length,
      fullContentLength: fullContent.length,
      contentPreview: content.substring(0, 150),
      fullContentPreview: fullContent.substring(0, 150),
    })
    
    // IMPORTANTE: Guardar el contenido del cuerpo (sin subject) en el mensaje
    // El subject se guarda por separado en metadata
    const messageContent = content // Solo el cuerpo del email, sin subject
    
    // ANTES DE CREAR UN NUEVO REQUEST, verificar si hay un request activo/reciente
    // para este email (continuación de conversación)
    // Ahora con análisis de IA para determinar si es continuación o nuevo requerimiento
    const activeRequest = await this.findActiveRequest(payload.from.email, clientId, messageContent)
    
    if (activeRequest) {
      console.log(`[EmailProcessor] Mensaje agregado a request existente: ${activeRequest.id}`)
      
      // Agregar el mensaje al request existente
      // IMPORTANTE: Usar messageContent (solo cuerpo) no fullContent (con subject)
      const message = await InboxService.addMessageToRequest(activeRequest.id, {
        source: 'email',
        sourceId: payload.messageId,
        content: messageContent, // Solo el cuerpo del email
        metadata: {
          from: payload.from.email,
          fromName: payload.from.name,
          to: Array.isArray(payload.to) ? payload.to.join(', ') : payload.to,
          subject: payload.subject,
          timestamp: payload.timestamp,
        },
        attachments: payload.attachments,
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
    console.log(`[EmailProcessor] Creando nuevo request para: ${payload.from.email}`)
    // Para createRequest, usar fullContent (con subject) para el análisis
    // Pero el mensaje individual usará messageContent (solo cuerpo)
    const request = await InboxService.createRequest({
      source: 'email',
      sourceId: payload.messageId,
      clientId,
      content: fullContent, // Para análisis completo (incluye subject)
      attachments: payload.attachments,
      metadata: {
        from: payload.from.email,
        fromName: payload.from.name,
        to: Array.isArray(payload.to) ? payload.to.join(', ') : payload.to,
        subject: payload.subject,
        timestamp: payload.timestamp,
      },
    })
    
    return request
  }

  /**
   * Identifica el cliente desde un email
   * Busca en email principal y en contactos adicionales
   */
  static async identifyClient(email: string): Promise<string | null> {
    // Normalizar email (minúsculas, trim)
    const normalizedEmail = email.toLowerCase().trim()
    
    // Primero buscar por email principal
    const userByEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    })
    
    if (userByEmail && userByEmail.role === 'client_enterprise') {
      return userByEmail.id
    }
    
    // Si no se encuentra, buscar en contactos adicionales
    const contact = await prisma.clientContact.findFirst({
      where: {
        type: 'email',
        value: {
          equals: normalizedEmail,
          mode: 'insensitive',
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
   * Busca un request activo/reciente para un email
   * Ahora usa IA para determinar si el nuevo mensaje es continuación o un nuevo requerimiento
   * 
   * Un request se considera "activo" si:
   * - Tiene el mismo email en algún mensaje
   * - Es del mismo canal (email)
   * - No está cerrado, o fue cerrado recientemente (últimos 7 días)
   * - Tiene actividad reciente (últimos 7 días)
   * 
   * Y ahora también verifica con IA que el nuevo mensaje sea continuación del mismo tema
   */
  static async findActiveRequest(
    email: string,
    clientId?: string,
    newMessageContent?: string // Contenido del nuevo mensaje para análisis con IA
  ): Promise<{ id: string } | null> {
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim()
    
    // Fecha límite: últimos 7 días para considerar un request "activo"
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Buscar requests de email que:
    // 1. Tengan el mismo cliente (si clientId está disponible)
    // 2. Tengan un mensaje entrante con el mismo email
    // 3. No estén cerrados, o fueron cerrados recientemente
    // 4. Tengan actividad reciente

    const whereClause: any = {
      source: 'email',
      ...(clientId ? { clientId } : {}),
      messages: {
        some: {
          direction: 'inbound',
          from: {
            equals: normalizedEmail,
            mode: 'insensitive',
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
        
        console.log('[EmailProcessor] Análisis de continuación con IA:', {
          requestId: request.id,
          isContinuation: analysis.isContinuation,
          confidence: analysis.confidence,
          reason: analysis.reason,
        })
        
        // Solo continuar si la IA dice que es continuación con confianza >= 0.6
        if (analysis.isContinuation && analysis.confidence >= 0.6) {
          console.log(`[EmailProcessor] ✅ Request activo confirmado por IA: ${request.id}`)
          return { id: request.id }
        } else {
          console.log(`[EmailProcessor] ❌ IA determinó que es nuevo requerimiento. Creando nuevo request.`)
          return null
        }
      } else {
        // Si no hay contenido del nuevo mensaje, usar lógica original
        console.log(`[EmailProcessor] Request activo encontrado (sin análisis IA): ${request.id}`)
        return { id: request.id }
      }
    }

    // Si no encontramos por cliente, buscar solo por email
    if (!clientId) {
      const requestsByEmail = await prisma.request.findMany({
        where: {
          source: 'email',
          messages: {
            some: {
              direction: 'inbound',
              from: {
                equals: normalizedEmail,
                mode: 'insensitive',
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
                equals: normalizedEmail,
                mode: 'insensitive',
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

      if (requestsByEmail.length > 0) {
        const request = requestsByEmail[0]
        
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
            
            console.log('[EmailProcessor] Análisis de continuación con IA (por email):', {
              requestId: request.id,
              isContinuation: analysis.isContinuation,
              confidence: analysis.confidence,
              reason: analysis.reason,
            })
            
            // Solo continuar si la IA dice que es continuación con confianza >= 0.6
            if (analysis.isContinuation && analysis.confidence >= 0.6) {
              console.log(`[EmailProcessor] ✅ Request activo confirmado por IA (por email): ${request.id}`)
              return { id: request.id }
            } else {
              console.log(`[EmailProcessor] ❌ IA determinó que es nuevo requerimiento (por email). Creando nuevo request.`)
              return null
            }
          }
        }
        
        // Si no hay contenido del nuevo mensaje, usar lógica original
        console.log(`[EmailProcessor] Request activo encontrado por email (sin análisis IA): ${request.id}`)
        return { id: request.id }
      }
    }

    return null
  }
}

