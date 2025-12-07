# 📊 Cómo Ver los Logs de Vercel

## 🎯 Método 1: Desde el Dashboard (Recomendado)

1. **Ve al Dashboard de Vercel**:
   - Abre: https://vercel.com/dashboard
   - Inicia sesión con tu cuenta

2. **Selecciona tu proyecto**:
   - Busca tu proyecto (probablemente `naova_mvp` o similar)
   - Haz clic en él

3. **Accede a los Logs**:
   - En el menú superior del proyecto, verás varias pestañas
   - Haz clic en **"Logs"** o **"Logs"** (icono de terminal/consola)

4. **Ver logs en tiempo real**:
   - Los logs aparecerán en tiempo real
   - Puedes filtrar por texto (busca "WhatsApp" o "webhook")
   - Puedes cambiar el tiempo (última hora, día, etc.)

## 🎯 Método 2: Desde un Deploy Específico

1. **Ve a tu proyecto en Vercel**
2. **Haz clic en el último deploy** (el más reciente, arriba de la lista)
3. **Haz clic en la pestaña "Logs"** dentro del deploy
4. Verás los logs específicos de ese deploy

## 🎯 Método 3: URL Directa

Si conoces tu nombre de usuario de Vercel:

```
https://vercel.com/[tu-usuario]/naova_mvp/logs
```

Reemplaza `[tu-usuario]` con tu nombre de usuario de Vercel.

## 🔍 Qué Buscar en los Logs

### Para verificar que el webhook está funcionando:

Busca estas líneas:
- `[WhatsApp Webhook] Verification request:` - Cuando Meta verifica el webhook
- `[WhatsApp Webhook] Verification successful` - Si la verificación fue exitosa
- `[WhatsApp Webhook] Received payload:` - Cuando recibes un mensaje
- `[WhatsApp Webhook] Procesando mensaje:` - Cuando se procesa un mensaje
- `[WhatsApp Webhook] Message processed:` - Cuando se guarda en la BD

### Filtrar los logs:

1. En la barra de búsqueda de logs, escribe: `WhatsApp` o `webhook`
2. Solo verás los logs relacionados con WhatsApp

## ⚠️ Si No Ves Nada

Si no ves logs de WhatsApp:

1. **Verifica que el webhook esté configurado en Meta**
2. **Envía un mensaje de prueba** por WhatsApp
3. **Espera unos segundos** y recarga los logs
4. **Verifica que estés viendo los logs del entorno correcto** (Production, no Preview)

## 📱 Probar el Webhook

1. **Envía un mensaje por WhatsApp** al número de Naova: `+52 33 1608 3075`
2. **Inmediatamente ve a los logs de Vercel**
3. **Busca** `[WhatsApp Webhook] Received payload`
4. Si aparece, el webhook está funcionando ✅
5. Si no aparece, el webhook no está recibiendo mensajes ❌

## 🆘 Troubleshooting

### No veo ningún log de WhatsApp

**Posibles causas:**
- El webhook no está configurado en Meta
- El webhook no está suscrito a eventos "messages"
- La URL del webhook es incorrecta
- El webhook no está activo en Meta

**Solución:**
- Verifica la configuración del webhook en Meta
- Asegúrate de estar suscrito a "messages"
- Verifica que la URL sea: `https://www.naova.com.mx/api/inbox/webhook/whatsapp`

### Veo logs de verificación pero no de mensajes

**Posible causa:**
- El webhook está verificado pero no está suscrito a eventos

**Solución:**
- Ve a Meta → WhatsApp → Configuration → Webhook
- Asegúrate de estar suscrito a "messages"

