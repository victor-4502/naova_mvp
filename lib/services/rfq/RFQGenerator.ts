// RFQ Generator - Genera contenido de RFQ automáticamente

import type { RFQ, RFQItem } from '@/lib/types/rfq'
import { formatDate } from '@/lib/utils/formatting'

export interface RFQContent {
  subject: string
  body: string
  htmlBody?: string
}

export class RFQGenerator {
  /**
   * Genera el contenido de un RFQ
   */
  static generateContent(rfq: RFQ, clientName: string): RFQContent {
    const subject = `RFQ - ${rfq.title}`
    
    const body = this.generateTextBody(rfq, clientName)
    const htmlBody = this.generateHtmlBody(rfq, clientName)
    
    return {
      subject,
      body,
      htmlBody,
    }
  }

  /**
   * Genera el cuerpo del email en texto plano
   */
  private static generateTextBody(rfq: RFQ, clientName: string): string {
    let body = `Estimado Proveedor,\n\n`
    body += `Le solicitamos su mejor cotización para el siguiente requerimiento:\n\n`
    body += `Título: ${rfq.title}\n`
    
    if (rfq.description) {
      body += `Descripción: ${rfq.description}\n`
    }
    
    body += `Fecha límite: ${formatDate(rfq.deadline)}\n\n`
    body += `Items solicitados:\n`
    body += `${'='.repeat(50)}\n\n`
    
    rfq.items.forEach((item, index) => {
      body += `${index + 1}. ${item.name}\n`
      if (item.description) {
        body += `   Descripción: ${item.description}\n`
      }
      body += `   Cantidad: ${item.quantity} ${item.unit}\n`
      body += `   Categoría: ${item.category}\n`
      if (item.specifications) {
        body += `   Especificaciones: ${JSON.stringify(item.specifications)}\n`
      }
      body += `\n`
    })
    
    body += `${'='.repeat(50)}\n\n`
    body += `Por favor, envíe su cotización antes de la fecha límite indicada.\n\n`
    body += `Saludos cordiales,\n`
    body += `Equipo Naova\n`
    body += `Cliente: ${clientName}\n`
    
    return body
  }

  /**
   * Genera el cuerpo del email en HTML
   */
  private static generateHtmlBody(rfq: RFQ, clientName: string): string {
    let html = `<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">`
    html += `<h2 style="color: #1D4ED8;">Solicitud de Cotización (RFQ)</h2>`
    html += `<p>Estimado Proveedor,</p>`
    html += `<p>Le solicitamos su mejor cotización para el siguiente requerimiento:</p>`
    
    html += `<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">`
    html += `<h3 style="margin-top: 0;">${rfq.title}</h3>`
    if (rfq.description) {
      html += `<p>${rfq.description}</p>`
    }
    html += `<p><strong>Fecha límite:</strong> ${formatDate(rfq.deadline)}</p>`
    html += `</div>`
    
    html += `<h3>Items solicitados:</h3>`
    html += `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">`
    html += `<thead>`
    html += `<tr style="background: #1D4ED8; color: white;">`
    html += `<th style="padding: 10px; text-align: left;">#</th>`
    html += `<th style="padding: 10px; text-align: left;">Producto</th>`
    html += `<th style="padding: 10px; text-align: left;">Cantidad</th>`
    html += `<th style="padding: 10px; text-align: left;">Categoría</th>`
    html += `</tr>`
    html += `</thead>`
    html += `<tbody>`
    
    rfq.items.forEach((item, index) => {
      html += `<tr style="border-bottom: 1px solid #ddd;">`
      html += `<td style="padding: 10px;">${index + 1}</td>`
      html += `<td style="padding: 10px;">`
      html += `<strong>${item.name}</strong>`
      if (item.description) {
        html += `<br><small style="color: #666;">${item.description}</small>`
      }
      html += `</td>`
      html += `<td style="padding: 10px;">${item.quantity} ${item.unit}</td>`
      html += `<td style="padding: 10px;">${item.category}</td>`
      html += `</tr>`
    })
    
    html += `</tbody>`
    html += `</table>`
    
    html += `<p style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">`
    html += `<strong>Importante:</strong> Por favor, envíe su cotización antes de la fecha límite indicada.`
    html += `</p>`
    
    html += `<p>Saludos cordiales,<br>`
    html += `<strong>Equipo Naova</strong><br>`
    html += `Cliente: ${clientName}</p>`
    
    html += `</body></html>`
    
    return html
  }
}

