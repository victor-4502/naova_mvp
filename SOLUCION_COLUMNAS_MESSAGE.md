# 🔧 Solución: Columnas Faltantes en la Tabla Message

## ⚠️ Error

```
Invalid `prisma.request.create()` invocation:
The column `processed` does not exist in the current database.
```

## ✅ Solución

La tabla `Message` no tiene las columnas `processed` y `processedAt` que están definidas en el schema de Prisma.

---

## 📝 Pasos para Solucionar

### Paso 1: Agregar Columnas en Supabase

**Abre Supabase SQL Editor y ejecuta:**

```sql
-- Agregar columna processed si no existe
ALTER TABLE "Message" 
ADD COLUMN IF NOT EXISTS "processed" BOOLEAN DEFAULT false;

-- Agregar columna processedAt si no existe
ALTER TABLE "Message" 
ADD COLUMN IF NOT EXISTS "processedAt" TIMESTAMP(3);
```

### Paso 2: Verificar que se Agregaron

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Message' 
  AND column_name IN ('processed', 'processedAt');
```

Deberías ver 2 filas:
- `processed` - tipo `boolean`, default `false`
- `processedAt` - tipo `timestamp without time zone`, nullable

### Paso 3: Sincronizar Prisma (Opcional pero Recomendado)

Detén el servidor y ejecuta:

```powershell
npx prisma db push
```

Esto sincronizará todo el schema con la base de datos.

### Paso 4: Probar Nuevamente

```powershell
npm run test:webhook:whatsapp
npm run test:webhook:email
```

---

## 📝 Archivo de Referencia

El archivo `prisma/agregar_columnas_message.sql` contiene el SQL necesario si prefieres copiarlo desde ahí.

---

## 🔍 Verificar Todas las Columnas de Message

Para ver todas las columnas actuales de la tabla Message:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Message'
ORDER BY ordinal_position;
```

Y comparar con el schema en `prisma/schema.prisma` (modelo Message, líneas 609-635).

---

## ⚠️ Nota

Si después de esto aparecen otros errores sobre columnas faltantes en otras tablas, deberías:

1. Verificar qué columnas faltan
2. Agregarlas manualmente en Supabase
3. O ejecutar `npx prisma db push` para sincronizar todo el schema de una vez

