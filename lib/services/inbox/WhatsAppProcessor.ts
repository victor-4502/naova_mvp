// WhatsApp Processor - Procesa mensajes de WhatsApp (stub para integración futura)

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
    clientId: string
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
    
    // Crear request
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
   * TODO: Implementar lógica de identificación
   */
  static async identifyClient(whatsappNumber: string): Promise<string | null> {
    // Por ahora, buscar por número de teléfono en usuarios
    const user = await prisma.user.findFirst({
      where: {
        phone: whatsappNumber,
        role: 'client_enterprise',
      },
    })
    
    return user?.id || null
  }
}

// Importar prisma
import { prisma } from '@/lib/prisma'

