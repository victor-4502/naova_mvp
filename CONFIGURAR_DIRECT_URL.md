# 🔧 Configurar DIRECT_URL Correctamente

## ❌ Problema

Tu `DATABASE_URL` está usando el **pooler** de Supabase:
```
aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

El pooler **NO funciona** para `prisma db push` y migraciones. Necesitas la **conexión directa**.

## ✅ Solución

### 1. Obtener Connection String Directa en Supabase

1. Ve a tu proyecto en **Supabase Dashboard**
2. Ve a **Settings** → **Database**
3. Busca la sección **"Connection string"**
4. Selecciona la pestaña **"URI"** (NO "Connection pooling")
5. Copia la URL completa

Debería verse algo así:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

O la conexión directa (sin pooler):
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 2. Actualizar tu .env

Tu `.env` debe tener **AMBAS** variables:

```env
# Para conexiones normales (con pooling) - Para la aplicación
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Para migraciones (SIN pooling) - Para Prisma db push
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**⚠️ IMPORTANTE:**
- `DIRECT_URL` debe usar el host `db.xxx.supabase.co` (NO `pooler.supabase.com`)
- `DIRECT_URL` debe usar el puerto `5432` (NO `6543`)
- `DIRECT_URL` NO debe tener `?pgbouncer=true`

### 3. Formato Correcto

Basándome en tu pooler URL, tu DIRECT_URL debería ser:

```env
DIRECT_URL="postgresql://postgres:[TU_PASSWORD]@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres"
```

Reemplaza `[TU_PASSWORD]` con tu contraseña real de la base de datos.

### 4. Verificar en Supabase

En Supabase Dashboard → Settings → Database, busca:
- **"Connection string"** → Pestaña **"URI"** → **"Direct connection"**
- O busca **"Connection parameters"** y construye la URL manualmente:
  - Host: `db.aptijeklzfxcxemnqpil.supabase.co`
  - Port: `5432`
  - Database: `postgres`
  - User: `postgres`
  - Password: [tu contraseña]

## 🎯 Después de Actualizar

1. Actualiza tu `.env` con la `DIRECT_URL` correcta
2. Intenta nuevamente:
   ```bash
   npm run prisma:push
   ```

## 📝 Nota sobre Contraseñas

Si no recuerdas tu contraseña de la base de datos:
1. Ve a Supabase Dashboard → Settings → Database
2. Puedes resetear la contraseña si es necesario
3. O usa la contraseña que configuraste cuando creaste el proyecto

