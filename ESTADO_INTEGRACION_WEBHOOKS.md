# 🔌 Estado de Integración de Webhooks

## ⚠️ Estado Actual

### ✅ Lo que YA está listo:

1. **Código de webhooks implementado:**
   - `/api/inbox/webhook/email` - Recibe y procesa emails
   - `/api/inbox/webhook/whatsapp` - Recibe y procesa mensajes de WhatsApp

2. **UI para clientes:**
   - Los clientes ven el email y WhatsApp en `/app/requests`
   - Enlaces directos para enviar mensajes

3. **Procesamiento de mensajes:**
   - El sistema identifica clientes automáticamente
   - Crea requests en la base de datos
   - Genera auto-respuestas si es necesario

### ❌ Lo que FALTA para producción:

**Los clientes NO pueden enviar mensajes todavía** porque falta la integración con proveedores externos.

---

## 🔧 Qué se necesita para que funcione

### Para Email:

1. **Configurar un servicio de email** (SendGrid, AWS SES, Mailgun, etc.)
2. **Configurar el dominio** `naova.com` para recibir emails
3. **Configurar el webhook** en el servicio para que envíe emails entrantes a:
   ```
   https://tu-dominio.com/api/inbox/webhook/email
   ```
4. **Configurar el email** `compras@naova.com` (y alternativos) en el servicio

### Para WhatsApp:

1. **Configurar WhatsApp Business API** (Meta/Facebook) o **Twilio**
2. **Verificar el número** `+52 33 1608 3075` en el servicio
3. **Configurar el webhook** en el servicio para que envíe mensajes entrantes a:
   ```
   https://tu-dominio.com/api/inbox/webhook/whatsapp
   ```
4. **Configurar el token de verificación** (variable `WHATSAPP_VERIFY_TOKEN`)

---

## 🧪 Cómo probar AHORA (sin integración real)

### Opción 1: Scripts de prueba

```bash
# Probar webhook de email (simula un email entrante)
npm run tsx scripts/probar-webhook-email.ts

# Probar webhook de WhatsApp (simula un mensaje entrante)
npm run tsx scripts/probar-webhook-whatsapp.ts
```

Estos scripts:
- Buscan un cliente registrado
- Simulan un mensaje/email entrante
- Llaman al webhook directamente
- Crean el request en la base de datos
- Generan auto-respuestas si es necesario

### Opción 2: Desde la plataforma web

Los clientes **SÍ pueden** crear requerimientos desde `/app/requests` directamente en la plataforma. Esto funciona sin integración externa.

---

## 📋 Pasos para Activar en Producción

### Paso 1: Email (Ejemplo con SendGrid)

1. **Crear cuenta en SendGrid**
2. **Verificar dominio** `naova.com`
3. **Configurar Inbound Parse Webhook:**
   - URL: `https://tu-dominio.com/api/inbox/webhook/email`
   - Método: POST
   - Formato: JSON
4. **Configurar emails:**
   - `compras@naova.com` → Redirige al webhook
   - `pedidos@naova.com` → Redirige al webhook
   - `contacto@naova.com` → Redirige al webhook

### Paso 2: WhatsApp (Ejemplo con Twilio)

1. **Crear cuenta en Twilio**
2. **Configurar WhatsApp Sandbox** o **WhatsApp Business API**
3. **Configurar webhook:**
   - URL: `https://tu-dominio.com/api/inbox/webhook/whatsapp`
   - Método: POST
   - Formato: JSON
4. **Configurar número:**
   - Número: `+52 33 1608 3075`
   - Webhook de mensajes entrantes: URL configurada arriba

### Paso 3: Variables de Entorno

Agregar a `.env`:

```env
# WhatsApp
WHATSAPP_VERIFY_TOKEN=tu_token_secreto_aqui

# URLs de webhooks (si son diferentes)
WEBHOOK_EMAIL_URL=https://tu-dominio.com/api/inbox/webhook/email
WEBHOOK_WHATSAPP_URL=https://tu-dominio.com/api/inbox/webhook/whatsapp
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

### Paso 4: Verificar Seguridad

Los webhooks actualmente tienen `TODO: Agregar verificación de firma`. Debes:

1. **Para Email:** Verificar la firma del webhook (cada proveedor tiene su método)
2. **Para WhatsApp:** Ya hay verificación básica con `WHATSAPP_VERIFY_TOKEN`, pero puedes mejorarla

---

## 🎯 Resumen

| Componente | Estado | Acción Requerida |
|------------|--------|------------------|
| Código de webhooks | ✅ Listo | Ninguna |
| UI para clientes | ✅ Listo | Ninguna |
| Procesamiento de mensajes | ✅ Listo | Ninguna |
| Integración Email | ❌ Falta | Configurar SendGrid/AWS SES/etc. |
| Integración WhatsApp | ❌ Falta | Configurar Twilio/WhatsApp Business API |
| Pruebas locales | ✅ Disponible | Usar scripts de prueba |

---

## 💡 Recomendaciones

1. **Para desarrollo/pruebas:**
   - Usa los scripts de prueba (`scripts/probar-webhook-*.ts`)
   - Prueba desde la plataforma web (`/app/requests`)

2. **Para producción:**
   - Configura primero un servicio (recomiendo SendGrid para email y Twilio para WhatsApp)
   - Prueba con mensajes reales antes de activar para todos los clientes
   - Monitorea los logs para verificar que los webhooks funcionan

3. **Alternativa temporal:**
   - Puedes usar servicios como **ngrok** para exponer `localhost` y probar webhooks localmente
   - Útil para desarrollo pero no para producción

---

## 📚 Documentación Adicional

- `CONFIGURACION_CONTACTO_CLIENTES.md` - Cómo configurar correos/números
- `COMO_PROBAR_AUTO_RESPUESTA.md` - Cómo probar el sistema completo
- `scripts/probar-webhook-email.ts` - Script de prueba para email
- `scripts/probar-webhook-whatsapp.ts` - Script de prueba para WhatsApp

