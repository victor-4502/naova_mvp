# 🔧 Solución para Problema de Conexión con Supabase

## ❌ Problema Actual

Prisma no puede conectarse a Supabase incluso después de reactivar el proyecto.

## ✅ Soluciones a Probar

### Opción 1: Verificar DIRECT_URL en .env

Asegúrate de que tu `.env` tenga **AMBAS** variables:

```env
# Para conexiones normales (con pooling)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Para migraciones (SIN pooling - MUY IMPORTANTE)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres"
```

**⚠️ IMPORTANTE:** 
- `DIRECT_URL` NO debe tener `?pgbouncer=true`
- `DIRECT_URL` debe ser la conexión directa sin pooling

### Opción 2: Obtener Connection String Directa desde Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Settings → Database
3. Busca "Connection string" 
4. Selecciona **"URI"** o **"Direct connection"** (NO "Connection pooling")
5. Copia esa URL completa
6. Úsala como `DIRECT_URL` en tu `.env`

### Opción 3: Usar Migraciones en lugar de db push

Si `db push` no funciona, puedes usar migraciones:

```bash
# Crear migración inicial
npx prisma migrate dev --name init

# O aplicar migraciones existentes
npx prisma migrate deploy
```

### Opción 4: Verificar que Supabase esté completamente activo

A veces después de reactivar, puede tomar unos minutos:

1. Ve a Supabase Dashboard
2. Verifica que el estado sea "Active" (no "Paused")
3. Espera 2-3 minutos después de reactivar
4. Intenta nuevamente

### Opción 5: Verificar Firewall/IP Restrictions

1. Ve a Supabase Dashboard → Settings → Database
2. Verifica si hay restricciones de IP
3. Si las hay, agrega tu IP actual o desactívalas temporalmente

### Opción 6: Probar Conexión Manual

Puedes probar si la conexión funciona con un cliente PostgreSQL:

```bash
# Si tienes psql instalado
psql "postgresql://postgres:[PASSWORD]@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres"
```

O usa una herramienta como DBeaver, pgAdmin, o TablePlus para probar la conexión.

### Opción 7: Usar Supabase SQL Editor

Como alternativa temporal, puedes crear las tablas manualmente:

1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta el SQL generado por Prisma
3. O usa el schema SQL que Prisma puede generar

## 🎯 Comando para Generar SQL del Schema

Si quieres ver el SQL que Prisma generaría:

```bash
npx prisma migrate dev --create-only --name init
```

Esto creará archivos SQL en `prisma/migrations/` que puedes ejecutar manualmente en Supabase SQL Editor.

## 📝 Verificación Rápida

Ejecuta esto para ver qué URL está usando Prisma:

```bash
npx prisma db pull --print
```

Si muestra la URL correcta, el problema puede ser de red/firewall.

## ✅ Una vez que funcione

```bash
# Aplicar schema
npm run prisma:push
# O
npx prisma migrate deploy

# Crear usuario admin
npm run prisma:seed
```

---

**¿Puedes verificar en Supabase Dashboard → Settings → Database que la "Direct connection" string sea correcta y que no tenga `pgbouncer=true`?**

