-- Agregar columnas faltantes a la tabla Message
-- Ejecuta esto en Supabase SQL Editor

-- Verificar qué columnas existen
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Message'
ORDER BY ordinal_position;

-- Agregar columna processed si no existe
ALTER TABLE "Message" 
ADD COLUMN IF NOT EXISTS "processed" BOOLEAN DEFAULT false;

-- Agregar columna processedAt si no existe
ALTER TABLE "Message" 
ADD COLUMN IF NOT EXISTS "processedAt" TIMESTAMP(3);

-- Verificar que se agregaron
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Message' 
  AND column_name IN ('processed', 'processedAt');

