// Email Processor - Procesa emails entrantes

import { prisma } from '@/lib/prisma'
import type { RequestSource } from '@/lib/types/request'
import { InboxService, type CreateRequestInput } from './InboxService'

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
    let content = payload.text || payload.html || ''
    
    // Si hay HTML, limpiarlo un poco para extraer texto
    if (!payload.text && payload.html) {
      // Remover tags HTML básicos (puedes mejorar esto con una librería)
      content = payload.html
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    }
    
    // Combinar subject y body para análisis completo
    const fullContent = payload.subject ? `${payload.subject}\n\n${content}` : content
    
    // ANTES DE CREAR UN NUEVO REQUEST, verificar si hay un request activo/reciente
    // para este email (continuación de conversación)
    const activeRequest = await this.findActiveRequest(payload.from.email, clientId)
    
    if (activeRequest) {
      console.log(`[EmailProcessor] Mensaje agregado a request existente: ${activeRequest.id}`)
      
      // Agregar el mensaje al request existente
      const message = await InboxService.addMessageToRequest(activeRequest.id, {
        source: 'email',
        sourceId: payload.messageId,
        content: fullContent,
        metadata: {
          from: payload.from.email,
          fromName: payload.from.name,
          to: payload.to,
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
    const request = await InboxService.createRequest({
      source: 'email',
      sourceId: payload.messageId,
      clientId,
      content: fullContent,
      attachments: payload.attachments,
      metadata: {
        from: payload.from.email,
        fromName: payload.from.name,
        to: payload.to,
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
   * Un request se considera "activo" si:
   * - Tiene el mismo email en algún mensaje
   * - Es del mismo canal (email)
   * - No está cerrado, o fue cerrado recientemente (últimos 7 días)
   * - Tiene actividad reciente (últimos 7 días)
   */
  static async findActiveRequest(
    email: string,
    clientId?: string
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
      take: 1, // Solo el más reciente
    })

    if (activeRequests.length > 0) {
      const request = activeRequests[0]
      console.log(`[EmailProcessor] Request activo encontrado: ${request.id}`)
      return { id: request.id }
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
        console.log(`[EmailProcessor] Request activo encontrado por email: ${request.id}`)
        return { id: request.id }
      }
    }

    return null
  }
}

