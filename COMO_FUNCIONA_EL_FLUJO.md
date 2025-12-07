# 🔄 Cómo Funciona el Flujo de Webhooks

## ✅ Flujo Correcto:

```
1. Mensaje llega (WhatsApp/Email)
   ↓
2. Webhook recibe en: /api/inbox/webhook/whatsapp o /api/inbox/webhook/email
   ↓
3. El webhook procesa el mensaje y CREA un Request en la BASE DE DATOS
   ↓
4. Tú vas a /admin/requests (página web)
   ↓
5. /admin/requests LEE los requests desde la base de datos y los muestra
```

## 📍 Endpoints:

- **`/api/inbox/webhook/whatsapp`** → Recibe mensajes de WhatsApp
- **`/api/inbox/webhook/email`** → Recibe mensajes de Email
- **`/admin/requests`** → Solo MUESTRA los requests (no recibe webhooks)

## ⚠️ El Problema Actual:

La tabla `Attachment` no existe en la base de datos, y el código intenta trabajar con ella.

---

## 🔧 Solución:

Opciones:
1. **Crear la tabla Attachment** (recomendado)
2. **Hacer que el código no falle si no hay attachments**

Vamos a hacer ambas: crear la tabla Y hacer el código más robusto.

