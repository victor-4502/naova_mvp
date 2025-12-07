-- Verificar si la columna sourceId existe en la tabla Request
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Request' 
  AND column_name = 'sourceId';

-- Si no existe, ejecuta esto para agregarla:
-- ALTER TABLE "Request" ADD COLUMN IF NOT EXISTS "sourceId" TEXT;

