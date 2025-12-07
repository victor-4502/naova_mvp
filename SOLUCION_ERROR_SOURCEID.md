# 🚨 Solución: Error "The column `sourceId` does not exist"

## ⚠️ Error

```
Invalid `prisma.request.create()` invocation:
The column `sourceId` does not exist in the current database.
```

## ✅ Solución

La columna `sourceId` está definida en el schema de Prisma pero no existe en tu base de datos. Necesitas agregarla.

### Paso 1: Abrir Supabase SQL Editor

1. Ve a tu proyecto en Supabase
2. Abre **"SQL Editor"** en el menú lateral

### Paso 2: Ejecutar este SQL

```sql
-- Agregar columna sourceId a la tabla Request
ALTER TABLE "Request" 
ADD COLUMN IF NOT EXISTS "sourceId" TEXT;
```

### Paso 3: Verificar

Ejecuta esto para verificar que se agregó:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Request' 
  AND column_name = 'sourceId';
```

Deberías ver una fila con:
- `column_name`: `sourceId`
- `data_type`: `text`

### Paso 4: Probar Nuevamente

Después de agregar la columna, ejecuta:

```powershell
npm run test:webhook:whatsapp
npm run test:webhook:email
```

Ahora debería funcionar correctamente.

---

## 📝 Archivo de Referencia

El archivo `prisma/agregar_sourceId.sql` contiene el mismo SQL si prefieres copiarlo desde ahí.

---

## 🔄 Si También Faltan Otras Columnas

Si después de esto aparecen otros errores sobre columnas faltantes, verifica que la tabla Request tenga todas las columnas del schema. Puedes usar:

```sql
-- Ver todas las columnas de la tabla Request
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'Request'
ORDER BY ordinal_position;
```

Y comparar con el schema en `prisma/schema.prisma` (modelo Request, líneas 202-239).

