# 🚀 Ejecutar Migración para Crear Tabla Request

## ⚠️ Error Actual

```
Error: La tabla Request no existe. Ejecuta las migraciones de base de datos en Supabase.
```

---

## ✅ Solución: Ejecutar Migración en Supabase

### Paso 1: Abrir Supabase

1. Ve a tu proyecto en Supabase
2. Abre **"SQL Editor"** (en el menú lateral)

---

### Paso 2: Ejecutar la Migración

Tienes 2 opciones:

#### Opción A: Ejecutar Todo el Script (Recomendado)

1. Abre el archivo `prisma/manual_migration_safe.sql` en tu editor
2. Copia **TODO el contenido** del archivo
3. Pega en el SQL Editor de Supabase
4. Haz clic en **"Run"** o presiona `Ctrl+Enter`

**Esto creará todas las tablas necesarias, incluyendo Request.**

---

#### Opción B: Ejecutar Solo la Parte de Request

Si solo quieres crear la tabla Request, ejecuta esto:

```sql
-- 1. Crear el enum RequestSource si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RequestSource') THEN
        CREATE TYPE "RequestSource" AS ENUM ('whatsapp', 'email', 'web', 'chat', 'file', 'api');
    END IF;
END $$;

-- 2. Crear la tabla Request
CREATE TABLE IF NOT EXISTS "Request" (
    "id" TEXT NOT NULL,
    "source" "RequestSource" NOT NULL,
    "sourceId" TEXT,
    "clientId" TEXT,
    "status" TEXT NOT NULL,
    "pipelineStage" TEXT NOT NULL,
    "rawContent" TEXT NOT NULL,
    "normalizedContent" JSONB,
    "category" TEXT,
    "subcategory" TEXT,
    "urgency" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- 3. Crear índices
CREATE INDEX IF NOT EXISTS "Request_clientId_idx" ON "Request"("clientId");
CREATE INDEX IF NOT EXISTS "Request_source_idx" ON "Request"("source");
CREATE INDEX IF NOT EXISTS "Request_status_idx" ON "Request"("status");
CREATE INDEX IF NOT EXISTS "Request_createdAt_idx" ON "Request"("createdAt");

-- 4. Agregar foreign key si la tabla User existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'User') THEN
        ALTER TABLE "Request" 
        ADD CONSTRAINT IF NOT EXISTS "Request_clientId_fkey" 
        FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
```

---

### Paso 3: Verificar que se Creó

Ejecuta esto en Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'Request';
```

**Debería devolver:** `Request`

También puedes verificar:

```sql
SELECT COUNT(*) FROM "Request";
```

**Debería devolver:** `0` (tabla vacía pero existe)

---

### Paso 4: Recargar la Página

1. Ve a `http://localhost:3000/admin/requests`
2. Recarga la página (F5)
3. **El error debería desaparecer** ✅

---

## 🎯 Qué Deberías Ver Después

- ✅ No más error 500
- ✅ Página carga correctamente
- ✅ Lista vacía (si no hay requests todavía)
- ✅ O lista con requests (si ya creaste algunos)

---

## 🐛 Si Aún Hay Error

### Verifica en Supabase:

1. **¿Se ejecutó el script correctamente?**
   - Revisa si hay errores en el SQL Editor
   - Verifica que no haya mensajes de error

2. **¿La tabla Request existe?**
   ```sql
   SELECT * FROM "Request" LIMIT 1;
   ```
   - Si funciona, la tabla existe ✅
   - Si da error, la tabla no existe ❌

3. **¿Hay problemas de permisos?**
   - Verifica que estés usando el proyecto correcto de Supabase
   - Verifica que `DATABASE_URL` en `.env` apunte al proyecto correcto

---

## 📝 Nota Importante

Si ya ejecutaste `prisma/manual_migration_safe.sql` antes pero la tabla no existe, puede ser que:
- Se ejecutó en el proyecto incorrecto de Supabase
- Hubo un error durante la ejecución
- La tabla se eliminó por error

En ese caso, ejecuta el script de nuevo.

---

## ✅ Checklist

- [ ] Abrí Supabase SQL Editor
- [ ] Ejecuté `prisma/manual_migration_safe.sql` (o solo la parte de Request)
- [ ] Verifiqué que la tabla Request existe
- [ ] Recargué `/admin/requests`
- [ ] El error desapareció

