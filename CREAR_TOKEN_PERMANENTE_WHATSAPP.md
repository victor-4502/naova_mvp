# 🔐 Cómo Crear un Token Permanente para WhatsApp

Los tokens temporales de Meta expiran después de unas horas. Para producción, necesitas un **System User Token** permanente.

## 📋 Paso a Paso: Crear System User Token

### 1. Crear un System User

1. Ve a [Meta Business Settings](https://business.facebook.com/settings)
2. En el menú lateral, ve a **Users** > **System Users**
3. Haz clic en **Add**
4. Completa:
   - **System User Name**: `naova-whatsapp-service` (o el nombre que prefieras)
   - **System User Role**: Selecciona **Admin** o el rol apropiado
5. Haz clic en **Create System User**

### 2. Asignar Permisos de WhatsApp

1. Una vez creado el System User, haz clic en él
2. Haz clic en **Assign Assets**
3. Selecciona tu **App** (la aplicación de WhatsApp)
4. Asigna estos permisos:
   - ✅ `whatsapp_business_messaging`
   - ✅ `whatsapp_business_management`
   - ✅ `business_management`
5. Haz clic en **Save Changes**

### 3. Generar el Token

1. En la página del System User, haz clic en **Generate New Token**
2. Selecciona tu **App** (aplicación de WhatsApp)
3. Selecciona los permisos:
   - ✅ `whatsapp_business_messaging`
   - ✅ `whatsapp_business_management`
   - ✅ `business_management`
4. **Token Expiration**: Selecciona **Never** (Nunca) o el período que prefieras
5. Haz clic en **Generate Token**

### 4. Copiar y Guardar el Token

⚠️ **IMPORTANTE**: El token solo se muestra UNA VEZ. Cópialo inmediatamente.

1. Copia el token completo
2. Guárdalo de forma segura (password manager, etc.)
3. Actualiza `WHATSAPP_ACCESS_TOKEN` en tu `.env`:
   ```env
   WHATSAPP_ACCESS_TOKEN=tu_system_user_token_aqui
   ```

## ✅ Verificar que el Token Funciona

Puedes verificar si tu token actual es permanente o temporal:

1. Ve a [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
2. Pega tu token
3. Haz clic en **Debug**
4. Revisa:
   - **Expires**: Si dice "Never", es permanente ✅
   - **Scopes**: Debe incluir `whatsapp_business_messaging`

## 🔍 Si Tu Token Sigue Expirando

Si creaste un System User Token pero sigue expirando:

1. **Verifica la expiración**: Al generar el token, asegúrate de seleccionar **"Never"** en Token Expiration
2. **Verifica los permisos**: El System User debe tener los permisos correctos asignados
3. **Verifica el token activo**: Usa el Access Token Debugger para confirmar que no ha expirado

## 🚨 Troubleshooting

### Error: "Token expired"

- El token que estás usando es temporal
- Necesitas crear un System User Token con expiración "Never"
- Los tokens temporales expiran en 1-60 días según el tipo

### Error: "Invalid permissions"

- El System User no tiene los permisos correctos
- Verifica que tenga `whatsapp_business_messaging` asignado

### No puedo crear System User

- Necesitas ser admin de la cuenta de Business en Meta
- Verifica que tengas los permisos necesarios

## 📚 Recursos

- [Meta Docs: System Users](https://developers.facebook.com/docs/marketing-api/system-users)
- [Meta Docs: WhatsApp Tokens](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)

