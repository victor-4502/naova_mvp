# 🔧 Actualizar Contraseña en .env

## ⚠️ Problema Detectado

Tu archivo `.env` **todavía tiene `[YOUR-PASSWORD]`** en lugar de tu contraseña real.

## ✅ Solución: Actualizar Manualmente

### Paso 1: Obtener tu Contraseña

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. **Settings** → **Database**
4. Si puedes ver la contraseña, cópiala
5. Si no, haz clic en **"Reset database password"** y copia la nueva

### Paso 2: Editar el archivo `.env`

1. Abre el archivo `.env` en la raíz del proyecto (puedes usar Notepad, VS Code, o cualquier editor)
2. Busca esta línea:
   ```env
   DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
3. **Reemplaza `[YOUR-PASSWORD]`** con tu contraseña real
4. Busca también esta línea:
   ```env
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres"
   ```
5. **Reemplaza `[YOUR-PASSWORD]`** también aquí
6. **GUARDA el archivo** (Ctrl+S)

### Paso 3: Verificar

Después de guardar, ejecuta:

```bash
node scripts/test-connection-simple.js
```

## 📝 Ejemplo

**ANTES:**
```env
DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**DESPUÉS (con contraseña real):**
```env
DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:MiPassword123@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

## ⚠️ Importante

- **NO** dejes `[YOUR-PASSWORD]` literalmente
- **SÍ** reemplázalo con tu contraseña real
- **Guarda** el archivo después de editar
- **Verifica** que se guardó correctamente

