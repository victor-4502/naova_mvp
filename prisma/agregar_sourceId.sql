-- Agregar columna sourceId a la tabla Request
-- Ejecuta esto en Supabase SQL Editor

ALTER TABLE "Request" 
ADD COLUMN IF NOT EXISTS "sourceId" TEXT;

-- Verificar que se agregó
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Request' 
  AND column_name = 'sourceId';

