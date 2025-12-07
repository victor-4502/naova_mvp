/**
 * Configuración de información de contacto de Naova
 * Estos son los correos y números donde los clientes pueden enviar requerimientos
 */

export const NAOVA_CONTACT_INFO = {
  // Email donde los clientes pueden enviar requerimientos
  email: {
    primary: process.env.NAOVA_EMAIL_PRIMARY || 'compras@naova.com',
    alternatives: [
      process.env.NAOVA_EMAIL_ALT_1 || 'pedidos@naova.com',
      process.env.NAOVA_EMAIL_ALT_2 || 'contacto@naova.com',
    ].filter(Boolean),
  },
  
  // Número de WhatsApp donde los clientes pueden enviar requerimientos
  whatsapp: {
    primary: process.env.NAOVA_WHATSAPP_PRIMARY || '+52 33 1608 3075',
    display: process.env.NAOVA_WHATSAPP_DISPLAY || '+52 33 1608 3075',
    // Formato sin espacios para webhooks (ej: 523316083075)
    normalized: process.env.NAOVA_WHATSAPP_NORMALIZED || '523316083075',
  },
  
  // URL del webhook (para configuración de proveedores externos)
  webhooks: {
    email: process.env.WEBHOOK_EMAIL_URL || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/inbox/webhook/email`,
    whatsapp: process.env.WEBHOOK_WHATSAPP_URL || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/inbox/webhook/whatsapp`,
  },
}

/**
 * Obtiene todos los emails válidos de Naova (incluyendo alternativos)
 */
export function getAllNaovaEmails(): string[] {
  return [
    NAOVA_CONTACT_INFO.email.primary,
    ...NAOVA_CONTACT_INFO.email.alternatives,
  ]
}

/**
 * Obtiene el número de WhatsApp en formato legible
 */
export function getWhatsAppDisplay(): string {
  return NAOVA_CONTACT_INFO.whatsapp.display
}

/**
 * Obtiene el número de WhatsApp normalizado (sin espacios, +, etc.)
 */
export function getWhatsAppNormalized(): string {
  return NAOVA_CONTACT_INFO.whatsapp.normalized
}

