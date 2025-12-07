# 🔄 Cómo Funciona el Flujo de Webhooks

## ✅ Flujo Correcto:

```
1. Mensaje llega desde WhatsApp/Email externo
   ↓
2. Webhook recibe en: /api/inbox/webhook/whatsapp o /api/inbox/webhook/email
   (Estos son ENDPOINTS API que reciben HTTP POST)
   ↓
3. El endpoint procesa el mensaje y CREA un Request en la BASE DE DATOS
   ↓
4. Tú vas a /admin/requests (página web en tu navegador)
   ↓
5. /admin/requests LEE los requests desde la base de datos y los MUESTRA
```

## 📍 Endpoints Diferentes:

- **`/api/inbox/webhook/whatsapp`** → **Recibe** mensajes de WhatsApp (POST HTTP)
- **`/api/inbox/webhook/email`** → **Recibe** mensajes de Email (POST HTTP)
- **`/admin/requests`** → **Muestra** los requests (GET HTTP, página web)

**IMPORTANTE:** `/admin/requests` NO recibe webhooks. Solo muestra lo que ya está guardado.

---

## ❌ El Problema Actual:

El error dice:
```
The table `public.Attachment` does not exist in the current database.
```

Esto significa que falta crear la tabla `Attachment` en Supabase.

---

## 🔧 Solución:

1. **Crear la tabla Attachment** en Supabase (SQL abajo)
2. El código ya está listo, solo falta la tabla

---

## 📝 SQL para Crear la Tabla:

Ver archivo: `SQL_CREAR_TABLA_ATTACHMENT.sql`

