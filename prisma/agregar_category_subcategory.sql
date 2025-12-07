-- Agregar columnas category y subcategory a la tabla Request
-- Ejecuta esto en Supabase SQL Editor

ALTER TABLE "Request" 
ADD COLUMN IF NOT EXISTS "category" TEXT;

ALTER TABLE "Request" 
ADD COLUMN IF NOT EXISTS "subcategory" TEXT;

-- Verificar que se agregaron
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Request' 
  AND column_name IN ('category', 'subcategory');

