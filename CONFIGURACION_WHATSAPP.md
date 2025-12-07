# 📱 Configuración de WhatsApp Business API

Esta guía te ayudará a configurar la integración de WhatsApp con la plataforma Naova.

## 🔑 Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env.local` o `.env`:

```env
# WhatsApp Business API - Meta
WHATSAPP_PHONE_NUMBER_ID=924879940701959
WHATSAPP_ACCESS_TOKEN=EAAKDvvPfrr4BQCb479ZCB9xYM4Ng4vjx4crbWArUWewZBtWZBg6EE5SaEhxPzsxxvBhaVcn9Pzo3IMMDSNgi0UTs5ZB43wVkj4adc0k318eXnYc4595H9cbMdVlkFnERTPMnLPifzbAJOSmvvrcGCiDvlaFTNG67izUloZCNPanhbcYfdkEi3nQUPnZCQNovrrE2C1lYquWhMrqH4u1OB8Swydvb2WmITbLHHUkPTmT3nR1ZCwVbiitrOFkH5uK1XTt6K0IWOhLUKCBddvZC9hZCh
WHATSAPP_VERIFY_TOKEN=tu_token_de_verificacion_secreto
```

### Explicación de cada variable:

- **`WHATSAPP_PHONE_NUMBER_ID`**: El ID del número de teléfono de WhatsApp Business (ej: `924879940701959`)
- **`WHATSAPP_ACCESS_TOKEN`**: El token de acceso de la API de Meta (Bearer token)
- **`WHATSAPP_VERIFY_TOKEN`**: Un token secreto que usarás para verificar el webhook en Meta (puede ser cualquier string, pero debe coincidir con el que configures en Meta)

## 🔧 Configuración en Meta Business Manager

### 1. Configurar Webhook

1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Selecciona tu aplicación
3. Ve a **WhatsApp > Configuration**
4. En **Webhook**, haz clic en **Edit**
5. Ingresa la URL de tu webhook: `https://tu-dominio.com/api/inbox/webhook/whatsapp`
6. Ingresa el **Verify Token** (debe ser el mismo que `WHATSAPP_VERIFY_TOKEN`)
7. Suscríbete a los eventos: `messages`

### 2. Obtener Credenciales

**Phone Number ID:**
- Ve a **WhatsApp > API Setup**
- Copia el **Phone number ID**

**Access Token:**
- Ve a **WhatsApp > API Setup**
- Copia el **Temporary access token** (o crea un token permanente)
- Para producción, crea un **System User Token** con permisos de WhatsApp

## 📤 Enviar Mensajes

### Mensajes de Texto Libre

Para enviar mensajes de texto libre, el cliente debe haber iniciado la conversación en las últimas 24 horas.

```typescript
import { WhatsAppService } from '@/lib/services/whatsapp/WhatsAppService'

// Enviar mensaje de texto
const result = await WhatsAppService.sendTextMessage({
  to: '523312283639', // Número sin +, espacios, guiones
  message: 'Hola, este es un mensaje de prueba'
})

if (result.success) {
  console.log('Mensaje enviado:', result.messageId)
} else {
  console.error('Error:', result.error)
}
```

### Mensajes con Template

Para enviar mensajes cuando ha pasado más de 24 horas o para iniciar conversaciones:

```typescript
// Enviar template
const result = await WhatsAppService.sendTemplateMessage({
  to: '523312283639',
  templateName: 'hello_world',
  languageCode: 'es'
})
```

### Con Fallback Automático

El sistema intenta enviar texto libre primero, y si falla (ventana de 24h cerrada), usa un template:

```typescript
const result = await WhatsAppService.sendMessageWithFallback(
  '523312283639',
  'Tu mensaje aquí',
  'hello_world' // Template de respaldo
)
```

## 📥 Recibir Mensajes

Los mensajes entrantes se procesan automáticamente a través del webhook:

1. Meta envía un POST a `/api/inbox/webhook/whatsapp`
2. El sistema identifica al cliente por su número de teléfono
3. Crea un Request en la base de datos
4. Si el cliente no está registrado, el Request se crea sin cliente (requiere asignación manual)

## 🧪 Probar la Integración

### 1. Verificar Webhook

Meta enviará un GET a tu webhook para verificar:

```bash
GET /api/inbox/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=TU_TOKEN&hub.challenge=123456
```

Debe responder con el `challenge` si el token coincide.

### 2. Enviar Mensaje de Prueba

Puedes usar curl (como en tu ejemplo):

```bash
curl -i -X POST \
  https://graph.facebook.com/v22.0/924879940701959/messages \
  -H 'Authorization: Bearer TU_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "messaging_product": "whatsapp",
    "to": "523312283639",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "es"
      }
    }
  }'
```

### 3. Enviar desde la Plataforma

1. Ve a `/admin/requests/[id]`
2. Envía un mensaje de respuesta
3. Si el request es de WhatsApp, el sistema intentará enviarlo automáticamente

## 📋 Templates Aprobados

Para usar templates, deben estar aprobados en Meta Business Manager:

1. Ve a **WhatsApp > Message Templates**
2. Crea o usa un template existente
3. Usa el nombre del template en `sendTemplateMessage`

## 🔒 Seguridad

- **Nunca commits el `.env`** con tus tokens
- Los tokens tienen fecha de expiración
- Para producción, usa **System User Tokens** en lugar de tokens temporales
- Configura la verificación de firma del webhook (TODO pendiente)

## 🐛 Troubleshooting

### Error: "WHATSAPP_PHONE_NUMBER_ID no está configurado"
- Verifica que la variable de entorno esté en `.env.local`
- Reinicia el servidor después de agregar variables

### Error: "Error desconocido al enviar mensaje"
- Verifica que el Access Token sea válido
- Verifica que el número de teléfono esté correcto (sin +, espacios, etc.)
- Revisa los logs del servidor para más detalles

### El mensaje no se envía (texto libre)
- El cliente debe haber iniciado la conversación en las últimas 24 horas
- Usa `sendTemplateMessage` o `sendMessageWithFallback` como alternativa

### Webhook no recibe mensajes
- Verifica que el webhook esté suscrito en Meta
- Verifica que la URL sea accesible públicamente
- Revisa los logs del servidor

## 📚 Recursos

- [Meta WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)

