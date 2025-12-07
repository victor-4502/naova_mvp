# 🔧 Solución: Error 500 en /api/admin/requests

## ⚠️ Problema

El error 500 probablemente se debe a que la tabla `Request` no existe en tu base de datos de Supabase.

---

## ✅ Solución

### Paso 1: Verificar que la tabla Request existe

Ejecuta esto en Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'Request';
```

**Si no devuelve nada**, la tabla no existe.

---

### Paso 2: Crear la tabla Request

Ejecuta el script de migración en Supabase SQL Editor:

1. Ve a tu proyecto en Supabase
2. Abre "SQL Editor"
3. Copia y pega el contenido de `prisma/manual_migration_safe.sql`
4. Ejecuta el script

**O ejecuta solo la parte de Request:**

```sql
-- Verificar que el enum existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RequestSource') THEN
        CREATE TYPE "RequestSource" AS ENUM ('whatsapp', 'email', 'web', 'chat', 'file', 'api');
    END IF;
END $$;

-- Crear tabla Request
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

-- Crear índices
CREATE INDEX IF NOT EXISTS "Request_clientId_idx" ON "Request"("clientId");
CREATE INDEX IF NOT EXISTS "Request_source_idx" ON "Request"("source");
CREATE INDEX IF NOT EXISTS "Request_status_idx" ON "Request"("status");
CREATE INDEX IF NOT EXISTS "Request_createdAt_idx" ON "Request"("createdAt");

-- Agregar foreign key si la tabla User existe
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

### Paso 3: Verificar que se creó

Ejecuta:

```sql
SELECT COUNT(*) FROM "Request";
```

Debería devolver `0` (tabla vacía pero existe).

---

### Paso 4: Recargar la página

1. Ve a `http://localhost:3000/admin/requests`
2. Recarga la página (F5)
3. El error debería desaparecer

---

## 🐛 Otros Posibles Problemas

### Problema: Error de conexión a la base de datos

**Solución:**
1. Verifica que `DATABASE_URL` esté en `.env`
2. Verifica que la URL sea correcta
3. Verifica que Supabase esté accesible

### Problema: Error de autenticación

**Solución:**
1. Cierra sesión
2. Inicia sesión de nuevo como admin:
   - Email: `admin@naova.com`
   - Contraseña: `AdminNaova2024!`

### Problema: Error en la consulta

**Solución:**
1. Revisa los logs del servidor (terminal donde corre `npm run dev`)
2. Busca el error específico
3. Comparte el error para diagnosticar

---

## ✅ Verificación Final

Después de crear la tabla:

1. **Recarga `/admin/requests`** → No debería haber error 500
2. **Deberías ver una lista vacía** (si no hay requests todavía)
3. **O deberías ver los requests** si ya creaste algunos

---

## 📝 Nota

Si ya ejecutaste `prisma/manual_migration_safe.sql` antes, la tabla debería existir. Si no, ejecútalo de nuevo o solo la parte de Request.

