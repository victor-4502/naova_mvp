# 🔍 Verificación de Conexión a Base de Datos

## ❌ Error Actual

```
Error: P1001: Can't reach database server at `db.aptijeklzfxcxemnqpil.supabase.co:5432`
```

## 🔧 Posibles Soluciones

### 1. Verificar que Supabase esté activo
- Ve a tu proyecto en Supabase
- Asegúrate de que el proyecto no esté pausado
- Si está pausado, reactívalo

### 2. Verificar las variables de entorno

Tu `.env` debe tener:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres"
```

**Nota importante:**
- `DATABASE_URL` debe tener `?pgbouncer=true` para conexiones normales
- `DIRECT_URL` NO debe tener `pgbouncer=true` (para migraciones y `db push`)

### 3. Verificar credenciales
- Ve a Supabase Dashboard → Settings → Database
- Copia la "Connection string" directa (no la pooled)
- Úsala como `DIRECT_URL`

### 4. Verificar firewall/IP
- Supabase puede tener restricciones de IP
- Ve a Settings → Database → Connection Pooling
- Verifica que tu IP esté permitida

### 5. Probar conexión directa

Puedes probar la conexión con:

```bash
# Instalar cliente PostgreSQL (si no lo tienes)
# O usar psql si lo tienes instalado

psql "postgresql://postgres:[PASSWORD]@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres"
```

### 6. Usar Supabase CLI (Alternativa)

Si tienes problemas con la conexión directa, puedes usar Supabase CLI:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link tu proyecto
supabase link --project-ref tu-project-ref

# Aplicar migraciones
supabase db push
```

## 📝 Formato Correcto de URLs

### DATABASE_URL (con pooling):
```
postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

### DIRECT_URL (sin pooling, para migraciones):
```
postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

## ✅ Una vez que funcione la conexión

Ejecuta:

```bash
# 1. Aplicar schema
npm run prisma:push

# 2. Crear usuario admin
npm run prisma:seed
```

## 🆘 Si sigue sin funcionar

1. Verifica que el proyecto de Supabase esté activo
2. Verifica que las credenciales sean correctas
3. Intenta desde otro lugar/red (puede ser bloqueo de firewall)
4. Contacta con soporte de Supabase si el problema persiste

