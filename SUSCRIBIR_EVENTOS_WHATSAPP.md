# 📱 Suscribirse a Eventos de WhatsApp en Meta

## ❌ Problema

El webhook se verifica correctamente pero **no recibe mensajes**. Esto significa que no estás suscrito a los eventos necesarios.

## ✅ Solución: Suscribirse a Eventos

### Paso 1: Ir a la Configuración del Webhook

1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Selecciona tu aplicación de WhatsApp Business
3. Ve a **WhatsApp** → **Configuration**
4. En la sección **Webhook**, haz clic en **Edit** o **Manage**

### Paso 2: Suscribirse a Eventos

En la pantalla de configuración del webhook, busca la sección de **"Subscribe to fields"** o **"Suscribirse a campos"**.

**Debes suscribirte a estos campos:**

1. **`messages`** ⭐ (OBLIGATORIO)
   - Este es el evento que permite recibir mensajes entrantes
   - Sin esto, NO recibirás mensajes

2. **`message_status`** (Opcional pero recomendado)
   - Permite recibir actualizaciones del estado de los mensajes (enviado, entregado, leído)

### Paso 3: Cómo Suscribirse

1. En la sección de campos, busca **"messages"**
2. Marca la casilla o haz clic en **"Subscribe"** junto a "messages"
3. Si hay una opción de **"message_status"**, también suscríbete
4. Guarda los cambios

### Paso 4: Verificar

1. Después de suscribirte, el webhook debería mostrar:
   - Estado: **Active** o **Activo**
   - Campos suscritos: **messages** (y posiblemente **message_status**)

2. Envía un mensaje de prueba por WhatsApp

3. Revisa los logs de Vercel - deberías ver:
   ```
   [WhatsApp Webhook] Received payload: ...
   [WhatsApp Webhook] Procesando mensaje: ...
   [WhatsApp Webhook] Message processed: ...
   ```

## 🔍 Dónde Encontrar la Suscripción

La sección de suscripción puede estar en diferentes lugares según la versión de Meta:

### Opción A: En la misma pantalla del webhook
- Justo debajo de donde configuraste la URL y el token
- Busca "Subscribe to fields" o "Campos suscritos"

### Opción B: En una pestaña separada
- Puede haber una pestaña llamada "Webhooks" o "Webhooks"
- Dentro de esa pestaña, busca "Subscribe to fields"

### Opción C: En la configuración de WhatsApp
- Ve a **WhatsApp** → **Configuration**
- Busca la sección de **"Webhook fields"** o **"Campos de webhook"**

## ⚠️ Importante

- **Sin suscribirte a "messages", NO recibirás mensajes**
- La verificación del webhook solo confirma que la URL funciona
- La suscripción a eventos es lo que permite recibir los mensajes reales

## 🧪 Prueba

Después de suscribirte:

1. Envía un mensaje por WhatsApp: "hola prueba"
2. Ve inmediatamente a los logs de Vercel
3. Deberías ver el mensaje recibido

Si aún no funciona, verifica:
- Que el webhook esté "Active" en Meta
- Que "messages" aparezca en los campos suscritos
- Que el número de teléfono esté correctamente configurado

