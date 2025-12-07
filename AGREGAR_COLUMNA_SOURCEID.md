# 🔧 Agregar Columna sourceId a la Tabla Request

## ⚠️ Problema

El error indica que la columna `sourceId` no existe en la tabla `Request` en la base de datos, aunque está definida en el schema de Prisma.

```
The column `sourceId` does not exist in the current database.
```

---

## ✅ Solución Rápida

### Opción 1: Ejecutar SQL Directamente en Supabase (Recomendado)

1. **Abre Supabase:**
   - Ve a tu proyecto en Supabase
   - Abre **"SQL Editor"** (menú lateral)

2. **Copia y pega este SQL:**

```sql
-- Agregar columna sourceId a la tabla Request
ALTER TABLE "Request" 
ADD COLUMN IF NOT EXISTS "sourceId" TEXT;

-- Verificar que se agregó
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Request' 
  AND column_name = 'sourceId';
```

3. **Ejecuta el SQL:**
   - Haz clic en **"Run"** o presiona `Ctrl+Enter`

4. **Verifica:**
   - Deberías ver una fila con `sourceId` y tipo `text`

---

### Opción 2: Usar Prisma Migrate

```bash
# Generar la migración
npx prisma migrate dev --name add_source_id_to_request

# O si prefieres solo hacer push del schema
npx prisma db push
```

---

### Opción 3: Usar el Script SQL Existente

El archivo `prisma/agregar_sourceId.sql` ya contiene el SQL necesario. Solo cópialo y ejecútalo en Supabase.

---

## 🔍 Verificar que Funcionó

Después de agregar la columna, ejecuta nuevamente las pruebas:

```powershell
npm run test:webhook:whatsapp
npm run test:webhook:email
```

Ahora deberían funcionar sin el error de `sourceId`.

---

## 📝 Nota

La columna `sourceId` es opcional (nullable), así que no afectará los requests existentes. Solo almacena el ID del mensaje original (de WhatsApp, email, etc.) para poder rastrearlo.

