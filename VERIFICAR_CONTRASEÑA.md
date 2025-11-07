# 🔐 Verificar Contraseña de Supabase

## ❌ Problema Actual

Error de autenticación - la contraseña no coincide.

## ✅ Solución: Verificar/Resetear Contraseña en Supabase

### Opción 1: Verificar Contraseña Actual

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. Busca la sección **Database password**
5. Si puedes verla, cópiala exactamente
6. Si no puedes verla, necesitas resetearla

### Opción 2: Resetear Contraseña (Recomendado)

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. Haz clic en **"Reset database password"** o **"Change database password"**
5. **Copia la nueva contraseña** que te muestre (Supabase te la mostrará una sola vez)
6. **Pégala directamente** en tu archivo `.env` (sin espacios al inicio/final)

### Opción 3: Copiar desde Connection String

1. Ve a **Settings** → **Database**
2. En **Connection string**, selecciona **"URI"**
3. Copia la URL completa
4. Extrae solo la parte de la contraseña (entre `:` y `@`)
5. Úsala en tu `.env`

## 📝 Actualizar .env

Una vez que tengas la contraseña correcta:

1. Abre el archivo `.env`
2. Reemplaza la contraseña en **ambas líneas**:
   - `DATABASE_URL`
   - `DIRECT_URL`
3. **Asegúrate de:**
   - No tener espacios al inicio o final
   - Copiar exactamente como está
   - Guardar el archivo

## 🧪 Probar

Después de actualizar:

```bash
node scripts/test-connection-simple.js
```

## 💡 Tips

- **Copia/pega directamente** desde Supabase (no escribas manualmente)
- **Verifica que no haya espacios** antes o después de la contraseña
- **Usa la misma contraseña** en ambas líneas (DATABASE_URL y DIRECT_URL)

