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
    
    // Crear request
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
}

