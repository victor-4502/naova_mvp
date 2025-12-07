# 🔍 Verificar y Configurar Webhook de WhatsApp

## ❌ Problema: No aparecen mensajes en los logs de Vercel

Si envías mensajes por WhatsApp pero no aparecen en los logs de Vercel, significa que **el webhook no está recibiendo los mensajes**. Esto puede ser porque:

1. El webhook no está configurado en Meta
2. La URL del webhook es incorrecta
3. El webhook no está suscrito a los eventos
4. El verify token no coincide

## ✅ Solución: Configurar el Webhook en Meta

### Paso 1: Verificar Variables de Entorno en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona **Settings** → **Environment Variables**
3. Verifica que estas variables estén configuradas:
   - `WHATSAPP_PHONE_NUMBER_ID=924879940701959`
   - `WHATSAPP_ACCESS_TOKEN=tu_token_aqui`
   - `WHATSAPP_VERIFY_TOKEN=tu_token_secreto` (ej: `naova_verify_token_123`)

### Paso 2: Configurar el Webhook en Meta

1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Selecciona tu aplicación de WhatsApp Business
3. Ve a **WhatsApp** → **Configuration**
4. En la sección **Webhook**, haz clic en **Edit** o **Configure**

5. Configura el webhook:
   - **Callback URL**: `https://www.naova.com.mx/api/inbox/webhook/whatsapp`
     - ⚠️ **IMPORTANTE**: Debe ser HTTPS y apuntar a tu dominio de producción
   - **Verify Token**: El mismo valor que pusiste en `WHATSAPP_VERIFY_TOKEN` en Vercel
     - Ejemplo: Si en Vercel pusiste `naova_verify_token_123`, usa el mismo aquí

6. Haz clic en **Verify and Save**
   - Meta enviará un GET a tu webhook para verificar
   - Si el verify token coincide, verás "Webhook verified"

7. **Suscríbete a los eventos**:
   - Marca la casilla para **messages**
   - Esto permite que Meta envíe mensajes entrantes a tu webhook

### Paso 3: Verificar que el Webhook Funciona

1. **Prueba la verificación**:
   - Cuando hagas clic en "Verify and Save", Meta enviará un GET request
   - Revisa los logs de Vercel - deberías ver:
     ```
     [WhatsApp Webhook] Verification request: ...
     [WhatsApp Webhook] Verification successful
     ```

2. **Envía un mensaje de prueba**:
   - Envía un mensaje de WhatsApp al número de Naova: `+52 33 1608 3075`
   - Revisa los logs de Vercel inmediatamente después
   - Deberías ver:
     ```
     [WhatsApp Webhook] Received payload: ...
     [WhatsApp Webhook] Procesando mensaje: ...
     [WhatsApp Webhook] Message processed: ...
     ```

### Paso 4: Verificar en la Base de Datos

Si el webhook está funcionando, el mensaje debería aparecer en la base de datos:

```bash
npx tsx scripts/verificar-requests-whatsapp.ts
```

## 🔧 Troubleshooting

### El webhook no se verifica

**Síntoma**: Al hacer clic en "Verify and Save" en Meta, aparece un error.

**Soluciones**:
1. Verifica que la URL sea correcta: `https://www.naova.com.mx/api/inbox/webhook/whatsapp`
2. Verifica que el verify token en Vercel coincida exactamente con el de Meta
3. Verifica que el endpoint GET esté funcionando (puedes probarlo manualmente)

### El webhook se verifica pero no recibe mensajes

**Síntoma**: El webhook se verifica correctamente, pero no aparecen mensajes en los logs.

**Soluciones**:
1. Verifica que estés suscrito a **messages** en Meta
2. Verifica que el número de teléfono esté correctamente configurado
3. Verifica que el webhook esté activo (debería mostrar "Active" en Meta)

### Los mensajes aparecen en los logs pero no en la base de datos

**Síntoma**: Ves logs en Vercel pero no aparecen requests en `/admin/requests`.

**Soluciones**:
1. Revisa los logs de Vercel para ver si hay errores al procesar el mensaje
2. Ejecuta el script de verificación: `npx tsx scripts/verificar-requests-whatsapp.ts`
3. Verifica que la base de datos esté correctamente configurada

## 📋 Checklist de Verificación

- [ ] Variables de entorno configuradas en Vercel
- [ ] Webhook configurado en Meta con la URL correcta
- [ ] Verify token coincide en Vercel y Meta
- [ ] Webhook verificado exitosamente en Meta
- [ ] Suscrito a eventos "messages" en Meta
- [ ] Webhook muestra "Active" en Meta
- [ ] Mensajes de prueba aparecen en logs de Vercel
- [ ] Requests aparecen en `/admin/requests`

## 🆘 Si Nada Funciona

1. **Verifica la URL manualmente**:
   - Abre: `https://www.naova.com.mx/api/inbox/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=TU_TOKEN&hub.challenge=test123`
   - Debería responder con `test123` (texto plano)

2. **Revisa los logs de Vercel en tiempo real**:
   - Ve a Vercel → Tu proyecto → Logs
   - Filtra por "WhatsApp" o "webhook"
   - Envía un mensaje y observa qué aparece

3. **Verifica que el webhook esté activo en Meta**:
   - Ve a Meta → WhatsApp → Configuration
   - El webhook debería mostrar "Active" y tener un check verde

