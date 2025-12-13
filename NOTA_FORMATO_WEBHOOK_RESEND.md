# ⚠️ Nota Importante: Formato del Webhook de Resend

## 📋 Lo que Esperamos

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

---

## 🔍 Lo que Resend Puede Enviar

**Resend puede enviar el formato de forma diferente.** Cada proveedor tiene su propio formato de webhook.

### Formato Posible de Resend:

```json
{
  "type": "email.received",
  "data": {
    "from": "cliente@example.com",
    "to": ["compras@naova.com.mx"],
    "subject": "Solicitud de cotización",
    "text": "Hola, necesito cotización...",
    "html": "<p>Hola, necesito cotización...</p>",
    "message_id": "unique-id-123",
    "created_at": "2024-12-07T12:00:00Z"
  }
}
```

O puede ser:

```json
{
  "event": "email.received",
  "payload": {
    "from": {
      "email": "cliente@example.com",
      "name": "Juan Pérez"
    },
    "to": ["compras@naova.com.mx"],
    "subject": "Solicitud",
    "text": "...",
    "html": "..."
  }
}
```

---

## ⚠️ Qué Hacer

### Si el Webhook No Funciona Después de Configurarlo:

1. **Envía un email de prueba** a `@naova.com.mx`
2. **Ve a los logs de Vercel**:
   - Vercel → Tu proyecto → Logs
   - Busca la línea que dice `Error en webhook Email:`
3. **Copia el log completo** del error
4. **Comparte el log** y yo adapto el código para el formato exacto de Resend

---

## 🔧 Adaptación del Código

Una vez que vea el formato exacto que Resend envía, puedo adaptar el endpoint para:

1. **Normalizar el formato** antes de procesarlo
2. **Extraer los campos correctos** (from, to, subject, text, etc.)
3. **Mapear al formato que EmailProcessor espera**

---

## 📝 Mientras Tanto

El código actual debería funcionar si Resend envía un formato similar al esperado. Si no funciona, no te preocupes, solo necesito ver el formato exacto que Resend está enviando para adaptarlo.

---

## ✅ Pasos si Hay Problemas

1. ✅ Configura Resend siguiendo la guía
2. ✅ Envía un email de prueba
3. ✅ Ve a los logs de Vercel
4. ✅ Si hay error, copia el log completo
5. ✅ Compártelo y adapto el código

**No te preocupes**, es normal que necesitemos ajustar el formato. Es parte del proceso. 😊

