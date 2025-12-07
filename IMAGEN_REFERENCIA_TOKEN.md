# 📸 Dónde Encontrar el Valor del Token

## 🔍 En Access Token Debugger

Cuando estás en https://developers.facebook.com/tools/debug/accesstoken/:

### Lo que estás viendo (INFORMACIÓN):
```
Identificador de la app: 707806111968958
Tipo: System User
Caducidad: Nunca
Válido: Verdadero
Ámbitos: whatsapp_business_messaging...
```

### Lo que necesitas (VALOR):
```
EAAKDvvPfrr4BQHNYBDxAc9L7eYCO8yIfuv9XZAVVDlA7cRU1DsSE6M3X4AZAKoQgDh4CFoyFzlTQIkREaFDawZBoen02JJrwfysPRDpgWjD8tO31ZCqBIZAdkaeoUiZCDVXw7BmBLAnZBLeyomEduHDZBgBH7ODFCRcefhS7oNcPDluZCyG2m6gp6wKNv4BIPgNRuShkjHzsqWbcfvreD8BF8GPJtX2yn8nTPP51sF1zMC2aplkZAeYaeE4EwhtICqtAhsiynwmf8LZANeNqvpwb7Wt
```

## 📍 Ubicación en la Página

En Access Token Debugger, el token está en:
- **ARRIBA** de la página
- En un campo de texto grande
- Dice "Access Token" o "Token de acceso"
- Es un string muy largo (más de 100 caracteres)

## ⚠️ Si No Puedes Ver el Token

Si no puedes ver el token en el Debugger, significa que:
1. No lo copiaste cuando lo generaste
2. Necesitas generar uno nuevo

### Generar Nuevo Token:

1. Ve a: https://business.facebook.com/settings
2. **Users** > **System Users**
3. Haz clic en tu System User
4. Busca **"Generate New Token"** o **"Tokens"**
5. Haz clic en **Generate New Token**
6. Selecciona:
   - Tu App (Naova)
   - Permisos: `whatsapp_business_messaging`
   - **Expiration: Never**
7. Haz clic en **Generate**
8. ⚠️ **COPIA EL TOKEN INMEDIATAMENTE** - Solo se muestra una vez

## ✅ Verificar que Tienes el Token Correcto

El token debe:
- Empezar con `EAAK...` o `EAAB...`
- Ser muy largo (más de 100 caracteres)
- No tener espacios ni saltos de línea
- Cuando lo pegues en `.env`, debe ser:
  ```env
  WHATSAPP_ACCESS_TOKEN=EAAK...todo_el_token_sin_espacios
  ```

