// WhatsApp Processor - Procesa mensajes de WhatsApp (stub para integración futura)

import { prisma } from '@/lib/prisma'
import type { RequestSource } from '@/lib/types/request'
import { InboxService, type CreateRequestInput } from './InboxService'

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
    const activeRequest = await this.findActiveRequest(payload.from, clientId)
    
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
   * Un request se considera "activo" si:
   * - Tiene el mismo número de teléfono en algún mensaje
   * - Es del mismo canal (whatsapp)
   * - No está cerrado, o fue cerrado recientemente (últimos 7 días)
   * - Tiene actividad reciente (últimos 7 días)
   */
  static async findActiveRequest(
    whatsappNumber: string,
    clientId?: string
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
      take: 1, // Solo el más reciente
    })

    if (activeRequests.length > 0) {
      const request = activeRequests[0]
      
      // Verificar que el mensaje es realmente del mismo número
      const matchingMessage = request.messages[0]
      if (matchingMessage?.from) {
        const messageFrom = matchingMessage.from.replace(/[\s\+\-\(\)]/g, '')
        // Comparar números (pueden tener diferentes formatos)
        if (messageFrom.includes(normalizedNumber.slice(-10)) || normalizedNumber.includes(messageFrom.slice(-10))) {
          console.log(`[WhatsAppProcessor] Request activo encontrado: ${request.id}`)
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
        console.log(`[WhatsAppProcessor] Request activo encontrado por número: ${request.id}`)
        return { id: request.id }
      }
    }

    return null
  }
}

