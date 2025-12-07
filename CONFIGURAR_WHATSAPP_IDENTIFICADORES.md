# 📱 Configurar Identificadores de WhatsApp

Esta guía te explica cómo configurar los identificadores de WhatsApp en tu archivo `.env`.

## 🔍 Los Identificadores que Tienes

Según la información que proporcionaste:

- **Identificador de número de teléfono**: `924879940701959`
- **Identificador de la cuenta de WhatsApp Business**: `688743860773720`

## ✅ Configuración en `.env`

En tu archivo `.env` o `.env.local`, configura estas variables:

```env
# WhatsApp Business API - Meta
WHATSAPP_PHONE_NUMBER_ID=924879940701959
WHATSAPP_ACCESS_TOKEN=tu_access_token_aqui
WHATSAPP_VERIFY_TOKEN=tu_token_de_verificacion_secreto
```

### 📋 Explicación de cada variable:

1. **`WHATSAPP_PHONE_NUMBER_ID`**
   - ✅ Usa: `924879940701959` (Identificador de número de teléfono)
   - Este es el ID del número de teléfono de WhatsApp Business que usarás para enviar mensajes
   - ⚠️ **Este es el que necesitas para enviar mensajes**

2. **`WHATSAPP_ACCESS_TOKEN`**
   - Ya lo actualizaste ✅
   - Es el token de acceso de la API de Meta

3. **`WHATSAPP_VERIFY_TOKEN`**
   - Un token secreto que tú elijas (puede ser cualquier string)
   - Este token lo usarás al configurar el webhook en Meta
   - Ejemplo: `naova_verify_token_secreto_123`

### ⚠️ Sobre el "Identificador de la cuenta de WhatsApp Business"

El valor `688743860773720` (Identificador de la cuenta de WhatsApp Business) **NO se usa en el código**. Es solo informativo para Meta Business Manager. 

**Para enviar mensajes, solo necesitas:**
- `WHATSAPP_PHONE_NUMBER_ID` = `924879940701959`
- `WHATSAPP_ACCESS_TOKEN` = (ya lo actualizaste)

## 📝 Ejemplo Completo de `.env`

```env
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=924879940701959
WHATSAPP_ACCESS_TOKEN=tu_token_actualizado_aqui
WHATSAPP_VERIFY_TOKEN=naova_verify_token_secreto_123
```

## 🧪 Probar la Configuración

Después de actualizar el `.env`, puedes probar enviando un mensaje:

```bash
npm run test:whatsapp -- 523312283639 "Hola desde Naova"
```

Reemplaza `523312283639` con tu número de teléfono (sin +, espacios, guiones).

## 🔍 Dónde Encontrar estos Valores en Meta

Si necesitas verificar estos valores en el futuro:

1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Selecciona tu aplicación
3. Ve a **WhatsApp > API Setup**
4. Verás:
   - **Phone number ID**: Este va en `WHATSAPP_PHONE_NUMBER_ID`
   - **Temporary access token**: Este va en `WHATSAPP_ACCESS_TOKEN`

## ✅ Resumen

- ✅ `WHATSAPP_PHONE_NUMBER_ID` = `924879940701959` (Identificador de número de teléfono)
- ✅ `WHATSAPP_ACCESS_TOKEN` = (ya lo tienes actualizado)
- ✅ `WHATSAPP_VERIFY_TOKEN` = (elige cualquier token secreto)
- ❌ El "Identificador de la cuenta de WhatsApp Business" (`688743860773720`) NO se usa

