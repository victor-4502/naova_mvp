# 📧 Cómo Recibir Emails en Naova (Guía Simple)

## 🔍 El Problema

Ya puedes **ENVIAR** emails desde Naova (configuraste SMTP con Gmail).  
Pero para **RECIBIR** emails y que aparezcan como requests, necesitas un servicio que:
1. Reciba emails dirigidos a una dirección (ej: `compras@naova.com.mx`)
2. Los convierta en un webhook POST
3. Los envíe a tu endpoint: `https://www.naova.com.mx/api/inbox/webhook/email`

---

## ✅ Opción 1: Resend (La Más Simple)

**Resend** es un servicio moderno y fácil de usar. Tiene plan gratuito.

### Paso 1: Crear Cuenta
1. Ve a: https://resend.com
2. Crea cuenta gratuita (verifica tu email)

### Paso 2: Agregar Dominio
1. En Resend, ve a **"Domains"**
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio: `naova.com.mx`
4. Resend te dará registros DNS para agregar

### Paso 3: Configurar DNS
1. Ve a tu proveedor de dominio (GoDaddy, Cloudflare, etc.)
2. Agrega los registros DNS que Resend te proporcionó
   - Usualmente incluyen: MX, TXT, CNAME
3. Espera a que se propaguen (puede tomar hasta 24 horas, pero normalmente es rápido)

### Paso 4: Verificar Dominio
1. En Resend, espera a que el dominio se verifique (aparecerá un check verde)
2. Puede tomar desde minutos hasta horas

### Paso 5: Configurar Inbound Email
1. En Resend, ve a **"Domains"** → Selecciona tu dominio
2. Busca la sección **"Inbound Email"** o **"Webhooks"**
3. Agrega el webhook:
   - **URL**: `https://www.naova.com.mx/api/inbox/webhook/email`
   - **Eventos**: Selecciona "email.received" o "inbound"

### Paso 6: Probar
1. Envía un email a cualquier dirección en tu dominio (ej: `test@naova.com.mx`)
2. Verifica en Vercel logs que el webhook se recibió
3. Verifica en `/admin/requests` que apareció el request

---

## ✅ Opción 2: SendGrid (Alternativa)

### Paso 1: Crear Cuenta
1. Ve a: https://sendgrid.com
2. Crea cuenta gratuita

### Paso 2: Configurar Inbound Parse
1. En SendGrid, ve a **"Settings"** → **"Inbound Parse"**
2. Haz clic en **"Add Host & URL"**
3. Configura:
   - **Subdomain**: `compras` (opcional, para usar `compras@naova.com.mx`)
   - **Destination URL**: `https://www.naova.com.mx/api/inbox/webhook/email`
4. SendGrid te dará registros DNS para agregar

### Paso 3: Configurar DNS
1. Agrega los registros DNS en tu proveedor de dominio
2. Espera la verificación

---

## ✅ Opción 3: Mailgun (Otra Alternativa)

### Paso 1: Crear Cuenta
1. Ve a: https://www.mailgun.com
2. Crea cuenta (tiene plan gratuito limitado)

### Paso 2: Agregar Dominio
1. En Mailgun, ve a **"Sending"** → **"Domains"**
2. Agrega tu dominio
3. Configura DNS como te indican

### Paso 3: Configurar Routes
1. Ve a **"Receiving"** → **"Routes"**
2. Crea una ruta que reenvíe a: `https://www.naova.com.mx/api/inbox/webhook/email`

---

## 🎯 Opción Más Rápida (Sin Configurar Dominio)

Si quieres probar **AHORA MISMO** sin configurar DNS:

### Usar Email de Prueba de Resend
1. Resend te da una dirección temporal: `tu-usuario@resend.dev`
2. Configura el webhook para recibir emails a esa dirección
3. Prueba enviando un email a esa dirección temporal
4. Cuando quieras usar tu dominio real, sigue los pasos de arriba

---

## 📋 Formato que Espera el Webhook

Tu endpoint `/api/inbox/webhook/email` espera recibir un POST con este formato:

```json
{
  "from": {
    "email": "cliente@example.com",
    "name": "Juan Pérez"
  },
  "to": ["compras@naova.com.mx"],
  "subject": "Solicitud de cotización",
  "text": "Hola, necesito cotización para...",
  "html": "<p>Hola, necesito cotización para...</p>",
  "messageId": "unique-id-123",
  "timestamp": "2024-12-07T12:00:00Z",
  "attachments": [
    {
      "filename": "documento.pdf",
      "mimeType": "application/pdf",
      "size": 12345,
      "url": "https://..."
    }
  ]
}
```

**Nota:** Cada proveedor (Resend, SendGrid, etc.) puede enviar el formato de forma ligeramente diferente. Si tu endpoint no funciona, puede que necesitemos adaptar el código para el formato específico del proveedor que elijas.

---

## 🧪 Probar el Webhook Manualmente

Mientras configuras el servicio, puedes probar el endpoint enviando un POST manual:

```bash
curl -X POST https://www.naova.com.mx/api/inbox/webhook/email \
  -H "Content-Type: application/json" \
  -d '{
    "from": {
      "email": "test@example.com",
      "name": "Test User"
    },
    "to": ["compras@naova.com.mx"],
    "subject": "Test email",
    "text": "Este es un email de prueba",
    "messageId": "test-123",
    "timestamp": "2024-12-07T12:00:00Z"
  }'
```

O desde Postman/Thunder Client con el mismo JSON.

---

## ❓ ¿Cuál Elegir?

- **Resend**: Moderno, fácil, buena documentación, plan gratuito generoso
- **SendGrid**: Más establecido, más funciones, pero más complejo
- **Mailgun**: Buena alternativa, similar a SendGrid

**Recomendación**: Empieza con **Resend** por simplicidad.

---

## 🔧 Si el Webhook No Funciona

1. **Verifica los logs en Vercel**:
   - Ve a tu proyecto en Vercel
   - Pestaña "Logs"
   - Busca errores relacionados con `/api/inbox/webhook/email`

2. **Verifica que el formato sea correcto**:
   - Cada proveedor puede enviar formatos ligeramente diferentes
   - Puede que necesitemos adaptar `EmailProcessor` para el formato específico

3. **Prueba el endpoint manualmente** (ver arriba)

---

## 📞 Próximos Pasos

1. **Elige un proveedor** (Recomiendo Resend)
2. **Configura el dominio y DNS**
3. **Configura el webhook**
4. **Prueba enviando un email**
5. **Si hay problemas, comparte los logs de Vercel**

