# 🔍 Verificación de Conexión a Supabase

## ✅ Lo que está bien:
- `DIRECT_URL` está configurado correctamente: `db.aptijeklzfxcxemnqpil.supabase.co:5432`
- Prisma está usando `DIRECT_URL` (no el pooler)

## ❌ Problema actual:
No puede alcanzar el servidor de base de datos.

## 🔧 Posibles causas y soluciones:

### 1. Verificar que el proyecto esté completamente activo
- Ve a Supabase Dashboard
- Verifica que el estado sea "Active" (verde)
- A veces después de reactivar, puede tomar 5-10 minutos

### 2. Verificar restricciones de IP/Firewall
En Supabase Dashboard → Settings → Database:
- Busca "Connection pooling" o "Network restrictions"
- Verifica si hay restricciones de IP activas
- Si las hay, agrega tu IP o desactívalas temporalmente

### 3. Verificar la contraseña
- Asegúrate de que la contraseña en `DIRECT_URL` sea correcta
- Si no estás seguro, puedes resetearla en Supabase Dashboard → Settings → Database

### 4. Probar conexión desde otro lugar
- Prueba desde otra red (móvil, otro WiFi)
- Puede ser un bloqueo de firewall de tu red actual

### 5. Verificar formato completo de DIRECT_URL
Tu `DIRECT_URL` debe verse así:
```
postgresql://postgres:[PASSWORD]@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres
```

**NO debe tener:**
- `?pgbouncer=true`
- `pooler` en el host
- Puerto `6543`

### 6. Usar Supabase SQL Editor (Alternativa)
Mientras resolvemos la conexión, puedes ejecutar el SQL manualmente:

1. Ve a Supabase Dashboard → SQL Editor
2. Abre el archivo `prisma/manual_migration.sql`
3. Copia y pega todo el contenido
4. Ejecuta el query

Esto creará todas las tablas sin necesidad de Prisma.

## 🎯 Recomendación

Como alternativa rápida, ejecuta el SQL manualmente en Supabase SQL Editor usando el archivo `prisma/manual_migration.sql` que ya generamos. Esto te permitirá:

1. ✅ Crear todas las tablas inmediatamente
2. ✅ Continuar con el desarrollo
3. ✅ Resolver el problema de conexión después

Después de crear las tablas manualmente, puedes ejecutar:
```bash
npm run prisma:seed
```

Para crear el usuario admin (aunque puede fallar si no hay conexión, pero puedes crearlo manualmente también).

