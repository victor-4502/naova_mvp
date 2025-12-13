# ✅ Respuesta Rápida: ¿Por qué no aparecen los emails como requests?

## 🔍 El Problema

**Ya tienes:**
- ✅ SMTP configurado → Puedes **ENVIAR** emails desde la plataforma
- ✅ Webhook endpoint listo → `/api/inbox/webhook/email` está funcionando

**Lo que falta:**
- ❌ Un servicio que **RECIBA** emails y los envíe a tu webhook

---

## 🎯 La Solución

Necesitas configurar un servicio como **Resend** o **SendGrid** que:

1. **Reciba emails** dirigidos a una dirección (ej: `compras@naova.com.mx`)
2. **Convierta el email en un webhook** (HTTP POST)
3. **Lo envíe a tu endpoint**: `https://www.naova.com.mx/api/inbox/webhook/email`

---

## 🚀 Opción Más Rápida: Resend (Recomendado)

### ¿Por qué Resend?
- ✅ Plan gratuito generoso (3,000 emails/mes)
- ✅ Muy fácil de configurar
- ✅ Buena documentación

### Pasos Rápidos:

1. **Crear cuenta en Resend** (2 minutos)
   - Ve a: https://resend.com
   - Crea cuenta gratuita

2. **Agregar tu dominio** (5 minutos)
   - En Resend → "Domains" → "Add Domain"
   - Ingresa: `naova.com.mx`
   - Resend te dará registros DNS para agregar

3. **Configurar DNS** (10 minutos)
   - Ve a tu proveedor de dominio (GoDaddy, Cloudflare, etc.)
   - Agrega los registros DNS que Resend te dio
   - Espera a que se verifique (puede tomar minutos u horas)

4. **Configurar Webhook** (2 minutos)
   - En Resend → "Webhooks" o busca "Inbound Email"
   - Agrega webhook:
     - **URL**: `https://www.naova.com.mx/api/inbox/webhook/email`
     - **Eventos**: "email.received" o "inbound"

5. **Probar**
   - Envía un email a cualquier dirección en tu dominio (ej: `test@naova.com.mx`)
   - Debe aparecer como request en `/admin/requests`

---

## 📋 Alternativa: SendGrid

Si prefieres SendGrid (similar proceso):

1. Ve a: https://sendgrid.com
2. Crea cuenta gratuita
3. Ve a "Settings" → "Inbound Parse"
4. Agrega "Host & URL":
   - **Destination URL**: `https://www.naova.com.mx/api/inbox/webhook/email`
5. Configura DNS como te indique SendGrid

---

## 🔧 Si Quieres Probar AHORA (Sin Configurar Dominio)

Resend te da una dirección temporal para probar:

1. En Resend, busca "Test Email" o dirección temporal
2. Usa esa dirección temporal para pruebas
3. Cuando quieras usar tu dominio real, sigue los pasos de arriba

---

## ⚠️ Nota Importante

Cada proveedor (Resend, SendGrid, etc.) puede enviar el formato del webhook de forma ligeramente diferente.

**Si después de configurar el webhook no funciona**, puede que necesitemos adaptar el código en `EmailProcessor.ts` para el formato específico del proveedor que elijas.

**Para eso:**
1. Comparte los logs de Vercel cuando llegue un email
2. Veré el formato exacto que está enviando
3. Adaptaré el código si es necesario

---

## 📝 Resumen

| Qué necesitas | Estado | Siguiente paso |
|---------------|--------|----------------|
| **Enviar emails** | ✅ Ya configurado (SMTP) | Nada |
| **Recibir emails** | ❌ Falta configurar | Configurar Resend o SendGrid |
| **Webhook endpoint** | ✅ Ya existe | Nada |

---

## 🎯 Próximos Pasos

1. **Elige**: Resend (recomendado) o SendGrid
2. **Configura**: Dominio y DNS
3. **Configura**: Webhook con tu URL
4. **Prueba**: Envía un email y verifica que aparezca como request
5. **Si no funciona**: Comparte logs de Vercel y adapto el código

---

## ❓ ¿Tienes tu dominio configurado?

Si ya tienes `naova.com.mx`, puedes empezar con Resend ahora mismo.

Si no tienes dominio aún, puedes:
- Probar con la dirección temporal de Resend
- O configurar el dominio después

