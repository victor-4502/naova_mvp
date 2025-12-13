/**
 * Plantillas para mensajes de confirmación cuando un request está completo
 * Las plantillas se rotan para variar el mensaje
 */

export interface CompletionMessageData {
  clientName?: string | null
  clientCompany?: string | null
  category?: string | null
}

/**
 * Plantillas de mensajes de confirmación
 * Se rotan según el número de mensajes enviados al cliente
 */
const COMPLETION_TEMPLATES = [
  // Plantilla 1
  (data: CompletionMessageData) => {
    const greeting = data.clientName 
      ? `Hola ${data.clientName},` 
      : data.clientCompany 
      ? `Hola ${data.clientCompany},`
      : 'Hola,'
    
    return `${greeting}

¡Perfecto! Ya tenemos toda la información que necesitamos para tu requerimiento${data.category ? ` de ${data.category}` : ''}.

Estamos en proceso de hacer la cotización con nuestros proveedores. Te mantendremos informado del progreso.

¡Gracias por confiar en Naova!`
  },

  // Plantilla 2
  (data: CompletionMessageData) => {
    const greeting = data.clientName 
      ? `Hola ${data.clientName},` 
      : data.clientCompany 
      ? `Estimado/a ${data.clientCompany},`
      : 'Hola,'
    
    return `${greeting}

Excelente, ya contamos con toda la información necesaria${data.category ? ` sobre tu requerimiento de ${data.category}` : ''}.

Nuestro equipo está trabajando en obtener las mejores cotizaciones para ti. Te contactaremos pronto con las opciones disponibles.

Saludos cordiales,
Equipo Naova`
  },

  // Plantilla 3
  (data: CompletionMessageData) => {
    const greeting = data.clientName 
      ? `${data.clientName},` 
      : data.clientCompany 
      ? `${data.clientCompany},`
      : 'Hola,'
    
    return `${greeting}

¡Listo! Ya tenemos todos los datos necesarios${data.category ? ` para tu solicitud de ${data.category}` : ''}.

Procederemos a contactar a nuestros proveedores para obtener las mejores cotizaciones. Te estaremos informando a medida que avancemos.

¡Quedamos atentos!`
  },

  // Plantilla 4
  (data: CompletionMessageData) => {
    const greeting = data.clientName 
      ? `Hola ${data.clientName},` 
      : data.clientCompany 
      ? `Estimado/a equipo de ${data.clientCompany},`
      : 'Hola,'
    
    return `${greeting}

Perfecto, ya tenemos toda la información requerida${data.category ? ` para tu requerimiento relacionado con ${data.category}` : ''}.

Ahora estamos en proceso de cotización con proveedores. Tan pronto como tengamos las opciones disponibles, te las compartiremos.

¡Gracias por tu paciencia!`
  },

  // Plantilla 5
  (data: CompletionMessageData) => {
    const greeting = data.clientName 
      ? `${data.clientName},` 
      : data.clientCompany 
      ? `${data.clientCompany},`
      : 'Hola,'
    
    return `${greeting}

¡Excelente! Ya contamos con toda la información${data.category ? ` para procesar tu solicitud de ${data.category}` : ''}.

Estamos trabajando en obtener las mejores opciones de cotización para ti. Pronto recibirás nuestras propuestas.

¡Estamos a tus órdenes!`
  },
]

/**
 * Genera un mensaje de confirmación cuando un request está completo
 * @param data Datos del cliente y request
 * @param messageCount Número de mensajes previos enviados (para rotar plantillas)
 */
export function generateCompletionMessage(
  data: CompletionMessageData,
  messageCount: number = 0
): string {
  // Rotar entre plantillas usando el número de mensajes
  const templateIndex = messageCount % COMPLETION_TEMPLATES.length
  const template = COMPLETION_TEMPLATES[templateIndex]
  
  return template(data)
}

