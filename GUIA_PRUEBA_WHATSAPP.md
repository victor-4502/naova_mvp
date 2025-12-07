# 🧪 Guía para Probar WhatsApp

## 📋 Paso 1: Configurar Variables de Entorno

Crea o edita el archivo `.env.local` en la raíz del proyecto y agrega:

```env
WHATSAPP_PHONE_NUMBER_ID=924879940701959
WHATSAPP_ACCESS_TOKEN=EAAKDvvPfrr4BQCb479ZCB9xYM4Ng4vjx4crbWArUWewZBtWZBg6EE5SaEhxPzsxxvBhaVcn9Pzo3IMMDSNgi0UTs5ZB43wVkj4adc0k318eXnYc4595H9cbMdVlkFnERTPMnLPifzbAJOSmvvrcGCiDvlaFTNG67izUloZCNPanhbcYfdkEi3nQUPnZCQNovrrE2C1lYquWhMrqH4u1OB8Swydvb2WmITbLHHUkPTmT3nR1ZCwVbiitrOFkH5uK1XTt6K0IWOhLUKCBddvZC9hZCh
WHATSAPP_VERIFY_TOKEN=naova_verify_token_secreto
```

**⚠️ IMPORTANTE:**
- Reemplaza `naova_verify_token_secreto` con un token que tú elijas
- Este mismo token lo usarás al configurar el webhook en Meta

---

## 🧪 Paso 2: Probar Envío de Mensajes

### Opción A: Usando el Script de Prueba

```bash
# Enviar mensaje con texto predeterminado
npm run test:whatsapp -- 523312283639

# Enviar mensaje personalizado
npm run test:whatsapp -- 523312283639 "Hola, este es un mensaje de prueba"
```

**Nota:** Reemplaza `523312283639` con el número de teléfono real (sin `+`, espacios, guiones).

### Opción B: Usando curl (como tu ejemplo original)

```bash
curl -i -X POST \
  https://graph.facebook.com/v22.0/924879940701959/messages \
  -H 'Authorization: Bearer TU_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "messaging_product": "whatsapp",
    "to": "523312283639",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "es"
      }
    }
  }'
```

### Opción C: Desde la Plataforma

1. Asegúrate de tener un request de WhatsApp en `/admin/requests`
2. Si no tienes uno, crea un request manualmente o envía un mensaje a tu número de WhatsApp Business
3. Ve a `/admin/requests/[id]` donde `[id]` es el ID del request
4. Escribe un mensaje en el formulario de respuesta
5. Haz clic en "Enviar respuesta"
6. El sistema intentará enviarlo automáticamente por WhatsApp

---

## 📥 Paso 3: Probar Recepción de Mensajes (Webhook)

### 3.1. Configurar el Webhook en Meta

1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Selecciona tu aplicación de WhatsApp Business
3. Ve a **WhatsApp > Configuration**
4. En la sección **Webhook**, haz clic en **Edit** o **Configure**
5. Ingresa:
   - **Callback URL**: `https://tu-dominio.com/api/inbox/webhook/whatsapp`
     - Para desarrollo local, usa [ngrok](https://ngrok.com/) o similar
     - Ejemplo: `https://abc123.ngrok.io/api/inbox/webhook/whatsapp`
   - **Verify Token**: El mismo que pusiste en `WHATSAPP_VERIFY_TOKEN` (ej: `naova_verify_token_secreto`)
6. Haz clic en **Verify and Save**
7. Suscríbete a los eventos: `messages`

### 3.2. Probar con ngrok (Desarrollo Local)

```bash
# Instalar ngrok (si no lo tienes)
# Windows: choco install ngrok
# Mac: brew install ngrok
# O descarga desde: https://ngrok.com/download

# Iniciar tu servidor Next.js
npm run dev

# En otra terminal, iniciar ngrok
ngrok http 3000

# Copia la URL de ngrok (ej: https://abc123.ngrok.io)
# Úsala como Callback URL en Meta
```

### 3.3. Verificar que el Webhook Funciona

1. Envía un mensaje de WhatsApp al número de tu cuenta de WhatsApp Business
2. Verifica los logs del servidor - deberías ver:
   ```
   [WhatsApp Webhook] Received payload: ...
   [WhatsApp Webhook] Message processed: ...
   ```
3. Ve a `/admin/requests` - deberías ver un nuevo request creado automáticamente

---

## 🔍 Verificación de Configuración

### Verificar Variables de Entorno

El script de prueba verificará automáticamente si las variables están configuradas:

```bash
npm run test:whatsapp -- 523312283639
```

Si falta alguna variable, verás un error con instrucciones.

### Verificar Acceso a la API

Si el script funciona correctamente, verás:

```
✅ Mensaje enviado exitosamente!
   Message ID: wamid.xxx...
```

Si hay un error, verás el mensaje de error específico de la API de Meta.

---

## ⚠️ Errores Comunes

### Error: "WHATSAPP_PHONE_NUMBER_ID no está configurado"
- **Solución**: Agrega `WHATSAPP_PHONE_NUMBER_ID` a tu `.env.local`
- **Reinicia** el servidor después de agregar variables

### Error: "Invalid OAuth access token"
- **Solución**: El token puede haber expirado. Obtén uno nuevo en Meta for Developers
- Ve a **WhatsApp > API Setup** y genera un nuevo token

### Error: "Message template 'hello_world' not found"
- **Solución**: El template debe estar aprobado en Meta Business Manager
- Ve a **WhatsApp > Message Templates** y verifica que `hello_world` esté aprobado
- O usa otro template que tengas aprobado

### Error: "No matching template found"
- **Solución**: Usa un template que esté aprobado en tu cuenta de Meta
- Verifica el nombre del template en **WhatsApp > Message Templates**

### Webhook no recibe mensajes
- **Solución**: Verifica que:
  1. El webhook esté configurado en Meta
  2. La URL sea accesible públicamente (usa ngrok para desarrollo)
  3. El Verify Token coincida
  4. Estés suscrito al evento `messages`

---

## 📚 Próximos Pasos

1. ✅ Configurar variables de entorno
2. ✅ Probar envío de mensaje
3. ✅ Configurar webhook
4. ✅ Probar recepción de mensajes
5. ✅ Integrar con el flujo completo del proceso

---

## 🆘 Ayuda

Si tienes problemas:
1. Revisa los logs del servidor
2. Verifica la documentación de Meta: https://developers.facebook.com/docs/whatsapp
3. Consulta `CONFIGURACION_WHATSAPP.md` para más detalles

