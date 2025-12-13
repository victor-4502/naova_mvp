# 🔍 Verificar Configuración del Webhook en Resend

## ❌ Problema: No hay logs en Vercel

Si no aparecen logs de `/api/inbox/webhook/email`, significa que **Resend no está enviando el webhook** a tu endpoint.

---

## ✅ Checklist de Verificación

### 1. Verificar que Resend está Recibiendo Emails

**¿Resend recibió el email?**

1. Ve a: https://resend.com
2. Inicia sesión
3. Ve a **"Domains"** → Selecciona `naova.com.mx`
4. Busca una sección de **"Logs"**, **"Activity"**, o **"Inbound"**
5. **Verifica** si el email que enviaste aparece ahí

**Si NO aparece en Resend:**
- ❌ Resend no está recibiendo emails
- **Causa posible**: DNS no configurado correctamente o no propagado

**Si SÍ aparece en Resend:**
- ✅ Resend recibió el email
- **Problema**: El webhook no está configurado o no se está enviando

---

### 2. Verificar Configuración del Webhook

**Configurar el webhook en Resend:**

1. Ve a: https://resend.com
2. Inicia sesión
3. Ve a **"Webhooks"** o **"Settings"** → **"Webhooks"**
4. Busca si hay un webhook configurado

**Si NO hay webhook:**
- Necesitas crearlo (ver Pasos abajo)

**Si HAY webhook:**
- Verifica que esté **"Active"** o **"Enabled"**
- Verifica la URL: `https://www.naova.com.mx/api/inbox/webhook/email`
- Verifica el evento: debe estar suscrito a **"email.received"** o **"inbound.email"**

---

### 3. Crear/Configurar Webhook en Resend

**Si no existe el webhook:**

1. Ve a **"Webhooks"** en Resend
2. Haz clic en **"Add Webhook"** o **"Create Webhook"**
3. Configura:
   - **Name**: "Naova Email Webhook"
   - **URL**: `https://www.naova.com.mx/api/inbox/webhook/email`
   - **Events**: Selecciona **"email.received"** o **"inbound.email"**
   - **Status**: Debe estar **"Active"**
4. Guarda el webhook

---

### 4. Verificar DNS (Inbound)

**Verificar que el MX record está configurado:**

1. Ve a GoDaddy DNS
2. Verifica que existe el registro MX:
   - **Tipo**: MX
   - **Nombre**: `@`
   - **Valor**: `inbound-smtp.us-east-1.amazonaws.com`
   - **Prioridad**: 10

**Verificar propagación:**

1. Ve a: https://mxtoolbox.com/SuperTool.aspx
2. Ingresa: `naova.com.mx`
3. Selecciona: **"MX Lookup"**
4. Haz clic en **"MX Lookup"**
5. **Verifica** que aparezca: `inbound-smtp.us-east-1.amazonaws.com`

**Si NO aparece:**
- ❌ El DNS no está propagado
- Espera más tiempo (hasta 24 horas)

**Si SÍ aparece:**
- ✅ El DNS está correcto

---

### 5. Probar Endpoint Manualmente

**Verificar que el endpoint funciona:**

Usa curl o Postman para probar:

```bash
curl -X POST https://www.naova.com.mx/api/inbox/webhook/email \
  -H "Content-Type: application/json" \
  -d '{
    "from": {
      "email": "test@example.com",
      "name": "Test User"
    },
    "to": ["test@naova.com.mx"],
    "subject": "Test email",
    "text": "Este es un email de prueba",
    "messageId": "test-123",
    "timestamp": "2024-12-09T19:40:00Z"
  }'
```

**Si funciona:**
- ✅ El endpoint está bien
- El problema es que Resend no está enviando el webhook

**Si no funciona:**
- ❌ Hay un error en el endpoint
- Revisa los logs de Vercel para ver el error

---

### 6. Verificar Logs de Resend (Webhook)

**Revisar logs del webhook en Resend:**

1. Ve a **"Webhooks"** en Resend
2. Haz clic en el webhook que configuraste
3. Busca una sección de **"Logs"**, **"Events"**, o **"Activity"**
4. **Verifica** si hay intentos de enviar el webhook
5. **Verifica** si hay errores (4xx, 5xx)

**Si hay errores:**
- Copia el error y compártelo
- Los errores más comunes:
  - `404`: URL incorrecta
  - `500`: Error en el endpoint
  - `Timeout`: El endpoint tardó mucho en responder

**Si NO hay logs:**
- Resend no está intentando enviar el webhook
- Puede ser que el evento no esté suscrito correctamente

---

## 🔧 Problemas Comunes

### Problema 1: Resend no recibe emails

**Solución:**
- Verifica DNS (MX record)
- Espera propagación (hasta 24 horas)
- Verifica que el dominio esté verificado en Resend

---

### Problema 2: Webhook no configurado

**Solución:**
- Crea el webhook en Resend
- Configura la URL correcta
- Suscríbete al evento correcto

---

### Problema 3: Webhook configurado pero no se envía

**Solución:**
- Verifica que el webhook esté "Active"
- Verifica que el evento esté suscrito
- Verifica los logs del webhook en Resend

---

### Problema 4: URL incorrecta

**Solución:**
- Verifica que la URL sea: `https://www.naova.com.mx/api/inbox/webhook/email`
- Debe ser HTTPS (no HTTP)
- Debe incluir `www.` si tu dominio lo requiere

---

## 📋 Información que Necesito

Para ayudarte mejor, compárteme:

1. **¿El email aparece en los logs de Resend?**
   - Ve a Resend → Domains → `naova.com.mx` → Logs/Activity
   - ¿Ves el email que enviaste?

2. **¿Hay un webhook configurado en Resend?**
   - Ve a Resend → Webhooks
   - ¿Existe un webhook?
   - ¿Cuál es la URL configurada?
   - ¿Está activo?

3. **¿El webhook tiene logs/eventos?**
   - Haz clic en el webhook
   - ¿Hay intentos de enviar el webhook?
   - ¿Hay errores?

4. **¿El MX record está propagado?**
   - Ve a mxtoolbox.com
   - Busca: `naova.com.mx`
   - ¿Aparece `inbound-smtp.us-east-1.amazonaws.com`?

Con esta información puedo ayudarte a solucionar el problema exacto.

