# 🔑 Configurar RESEND_API_KEY para Obtener Contenido de Emails

## 🔍 Problema

Resend **NO envía el contenido del email** en el webhook por diseño. Solo envía metadata (subject, from, to, message_id).

Para obtener el contenido completo, necesitamos hacer una llamada adicional a la API de Resend usando el `email_id`.

---

## ✅ Solución

### Paso 1: Obtener API Key de Resend

1. Ve a: https://resend.com
2. Inicia sesión
3. Ve a **"API Keys"** o **"Settings"** → **"API Keys"**
4. Haz clic en **"Create API Key"** o busca una existente
5. **Copia la API Key** (empieza con `re_`)

---

### Paso 2: Agregar a Variables de Entorno

#### En `.env.local` (local):
```env
RESEND_API_KEY=re_tu_api_key_aqui
```

#### En Vercel (producción):
1. Ve a: https://vercel.com
2. Selecciona tu proyecto `naova`
3. Ve a **"Settings"** → **"Environment Variables"**
4. Agrega:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Tu API key de Resend
   - **Environment**: Production, Preview, Development (marcar todos)
5. Haz clic en **"Save"**

---

## 🔧 Cómo Funciona Ahora

1. **Webhook recibe el evento** de Resend con metadata
2. **Extrae el `email_id`** del payload
3. **Hace una llamada a Resend API** para obtener el contenido completo
4. **Procesa el email** con el contenido completo

---

## ✅ Después de Configurar

1. **Espera el deploy** en Vercel (si agregaste la variable)
2. **Envía un email de prueba** a `test@naova.mx`
3. **Verifica** que ahora aparece el contenido completo

---

## 📋 Verificar que Funciona

En los logs de Vercel deberías ver:

```
[Email Webhook] 🔄 Obteniendo contenido desde Resend API usando email_id: ...
[Email Webhook] ✅ Contenido obtenido desde API: { hasText: true, hasHtml: true, ... }
```

---

## ⚠️ Nota

Si no configuras `RESEND_API_KEY`, el código seguirá funcionando pero solo guardará el subject (como está ahora).

Con la API key configurada, obtendrá el contenido completo del email.

