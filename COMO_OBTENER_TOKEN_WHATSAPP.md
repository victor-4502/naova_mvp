# 🔐 Cómo Obtener el Valor del Token de WhatsApp

## ⚠️ Diferencia Importante

Hay dos cosas diferentes:

1. **Información del token** (metadata): Tipo, caducidad, permisos, etc.
2. **Valor del token**: El string largo que empieza con `EAAK...` que va en tu `.env`

Lo que necesitas es el **VALOR del token**, no solo la información.

## 📋 Cómo Obtener el Valor del Token

### Opción 1: Desde donde lo Generaste (Recomendado)

1. Ve a [Meta Business Settings](https://business.facebook.com/settings)
2. Ve a **Users** > **System Users**
3. Haz clic en el System User que creaste
4. Busca la sección de **Tokens**
5. Si el token está visible, cópialo
6. Si no, necesitarás generar uno nuevo:
   - Haz clic en **Generate New Token**
   - Selecciona tu App
   - Selecciona permisos
   - **Token Expiration**: Selecciona **Never**
   - Haz clic en **Generate Token**
   - ⚠️ **COPIA EL TOKEN INMEDIATAMENTE** (solo se muestra una vez)

### Opción 2: Desde Access Token Debugger

1. Ve a [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
2. Si ya pegaste el token ahí, debería estar en el campo de texto **arriba**
3. Copia ese valor completo (empieza con `EAAK...`)

### Opción 3: Desde Graph API Explorer

1. Ve a [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Selecciona tu App
3. En "User or Page", selecciona tu System User
4. Haz clic en "Generate Access Token"
5. Selecciona los permisos de WhatsApp
6. Copia el token generado

## ✅ Verificar que Tienes el Token Correcto

El token debe:
- Empezar con `EAAK...` o similar
- Ser muy largo (más de 100 caracteres)
- Cuando lo pegues en Access Token Debugger, debe mostrar:
  - **Válido**: Verdadero
  - **Caducidad**: Nunca
  - **Tipo**: System User

## 📝 Actualizar el .env

Una vez que tengas el valor del token:

```env
WHATSAPP_ACCESS_TOKEN=EAAK...tu_token_completo_aqui
```

**Importante:**
- No agregues comillas
- No agregues espacios
- Copia el token completo desde el inicio hasta el final

## 🧪 Probar

Después de actualizar el `.env`, prueba de nuevo:

```bash
npm run test:whatsapp -- 523312283639 "Hola desde Naova"
```

