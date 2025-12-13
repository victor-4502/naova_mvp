# 🔍 Diagnóstico: Webhook No Funciona

## 🔍 Paso 1: Verificar Logs de Vercel

### 1.1. Ir a Vercel

1. Ve a: https://vercel.com
2. Selecciona tu proyecto `naova`
3. Ve a la pestaña **"Logs"**

### 1.2. Buscar Logs del Webhook

Busca líneas que contengan:
- `/api/inbox/webhook/email`
- `Error en webhook Email`
- `email.received`
- `inbound.email`

### 1.3. ¿Qué Encontraste?

**Opción A: NO hay ningún log**
- ❌ El webhook no llegó a tu endpoint
- **Causa posible**: URL incorrecta, webhook no activo, o Resend no envió el webhook

**Opción B: Hay un log con error**
- ⚠️ El webhook llegó pero hay un error
- **Causa posible**: Formato diferente del payload, error en el código

**Opción C: Hay un log con éxito (200)**
- ✅ El webhook llegó correctamente
- **Causa posible**: El formato del payload es diferente y no se procesó correctamente

---

## 🔍 Paso 2: Verificar en Resend

### 2.1. Verificar Logs de Resend

1. Ve al dashboard de Resend
2. Busca la sección de **"Logs"** o **"Activity"**
3. Busca el email que enviaste
4. Verifica si se intentó enviar el webhook

### 2.2. Verificar Webhook

1. Ve a **"Webhooks"** en Resend
2. Verifica que el webhook está **"Active"**
3. Verifica que la URL es correcta: `https://www.naova.com.mx/api/inbox/webhook/email`
4. Haz clic en el webhook para ver detalles o logs

---

## 🔍 Paso 3: Verificar el Endpoint

### 3.1. Probar el Endpoint Manualmente

Puedes probar el endpoint directamente para ver si funciona:

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
    "timestamp": "2024-12-07T12:00:00Z"
  }'
```

O desde Postman/Thunder Client con el mismo JSON.

**Si esto funciona**, el endpoint está bien pero el formato de Resend es diferente.

**Si esto NO funciona**, hay un problema con el endpoint.

---

## 🔍 Paso 4: Verificar Formato del Webhook

### 4.1. Ver Documentación de Resend

Resend puede enviar el webhook en un formato diferente. Busca en:
- Documentación de Resend: https://resend.com/docs
- Busca "inbound email webhook" o "email.received webhook"

### 4.2. Formato Posible de Resend

Resend puede enviar el webhook así:

```json
{
  "type": "email.received",
  "data": {
    "from": "test@example.com",
    "to": ["test@naova.com.mx"],
    "subject": "Test email",
    "text": "Este es un email de prueba",
    "html": "<p>Este es un email de prueba</p>",
    "message_id": "test-123",
    "created_at": "2024-12-07T12:00:00Z"
  }
}
```

O así:

```json
{
  "event": "email.received",
  "payload": {
    "from": {
      "email": "test@example.com",
      "name": "Test User"
    },
    "to": ["test@naova.com.mx"],
    "subject": "Test email",
    "text": "...",
    "html": "..."
  }
}
```

**El código actual espera:**
```json
{
  "from": {
    "email": "...",
    "name": "..."
  },
  "to": ["..."],
  "subject": "...",
  "text": "...",
  "messageId": "...",
  "timestamp": "..."
}
```

**Si el formato es diferente**, necesitamos adaptar el código.

---

## 🚀 Solución: Adaptar el Código

Una vez que veamos el formato exacto que Resend está enviando, podemos adaptar el código.

### Necesito de Ti:

1. **Logs de Vercel**:
   - ¿Hay algún log relacionado con `/api/inbox/webhook/email`?
   - Si hay error, copia el error completo

2. **Logs de Resend**:
   - ¿Se intentó enviar el webhook?
   - ¿Hay algún error en Resend?

3. **Prueba manual del endpoint**:
   - Prueba con curl/Postman el endpoint
   - ¿Funciona o da error?

4. **Formato del payload** (si tienes acceso):
   - Si puedes ver el payload que Resend está enviando, compártelo

---

## 📋 Checklist de Diagnóstico

- [ ] Revisé los logs de Vercel
- [ ] Busqué logs relacionados con `/api/inbox/webhook/email`
- [ ] Revisé los logs de Resend
- [ ] Verifiqué que el webhook está activo
- [ ] Verifiqué que la URL es correcta
- [ ] Probé el endpoint manualmente
- [ ] Compartí los resultados contigo

---

## 💡 Pasos Inmediatos

1. **Ve a Vercel logs** y busca cualquier cosa relacionada con el webhook
2. **Ve a Resend logs** y verifica si se intentó enviar el webhook
3. **Compárteme**:
   - ¿Qué encontraste en los logs de Vercel?
   - ¿Qué encontraste en los logs de Resend?
   - ¿El webhook está activo?

Con esa información puedo adaptar el código exactamente como necesitas.

