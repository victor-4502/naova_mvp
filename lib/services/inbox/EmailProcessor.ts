// Email Processor - Procesa emails entrantes (stub para integración futura)

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
  attachments?: Array<{
    filename: string
    mimeType: string
    size: number
    content: string // Base64
  }>
  messageId: string
  timestamp: string
}

export class EmailProcessor {
  /**
   * Procesa un email entrante
   */
  static async processEmail(
    payload: EmailWebhookPayload,
    clientId: string
  ) {
    // Extraer contenido (preferir texto plano, fallback a HTML)
    let content = payload.text || ''
    
    if (!content && payload.html) {
      // TODO: Convertir HTML a texto plano
      content = payload.html.replace(/<[^>]*>/g, ' ').trim()
    }
    
    // Procesar attachments
    const attachments: CreateRequestInput['attachments'] = []
    
    if (payload.attachments) {
      for (const att of payload.attachments) {
        // TODO: Subir attachment a storage y obtener URL
        attachments.push({
          filename: att.filename,
          mimeType: att.mimeType,
          size: att.size,
          url: '', // TODO: URL del storage
        })
      }
    }
    
    if (!content) {
      throw new Error('No se pudo extraer contenido del email')
    }
    
    // Crear request
    const request = await InboxService.createRequest({
      source: 'email',
      sourceId: payload.messageId,
      clientId,
      content: `${payload.subject}\n\n${content}`,
      attachments: attachments.length > 0 ? attachments : undefined,
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
   */
  static async identifyClient(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
        role: 'client_enterprise',
      },
    })
    
    return user?.id || null
  }
}

// Importar prisma
import { prisma } from '@/lib/prisma'

