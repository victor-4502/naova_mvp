# 🔐 Solución: Error de Autenticación

## Problema

Error: `Authentication failed - the provided database credentials for postgres are not valid`

## Posibles Causas

### 1. Contraseña con Caracteres Especiales ⚠️

Si tu contraseña tiene caracteres especiales como `@`, `#`, `$`, `&`, `+`, `/`, `=`, `?`, necesitan ser codificados en la URL.

### 2. Contraseña Incorrecta

Verifica que la contraseña sea exactamente la misma que configuraste en Supabase.

## Solución

### Opción A: Codificar Contraseña Manualmente

Si tu contraseña es: `Mi@Pass#123`

Debe codificarse como: `Mi%40Pass%23123`

**Caracteres comunes:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `&` → `%26`
- `+` → `%2B`
- `/` → `%2F`
- `=` → `%3D`
- `?` → `%3F`
- `%` → `%25`
- ` ` (espacio) → `%20`

### Opción B: Usar el Script de Codificación

Ejecuta:
```bash
node scripts/encode-password.js
```

Ingresa tu contraseña y te dará la versión codificada.

### Opción C: Cambiar Contraseña en Supabase

1. Ve a Supabase Dashboard
2. Settings → Database
3. Cambia la contraseña a una sin caracteres especiales
4. Actualiza el `.env` con la nueva contraseña

## Verificar

Después de actualizar, prueba:

```bash
node scripts/test-connection-simple.js
```

## Ejemplo Completo

Si tu contraseña original es: `My@Pass#2024`

**En el .env debe quedar:**
```env
DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:My%40Pass%232024@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

