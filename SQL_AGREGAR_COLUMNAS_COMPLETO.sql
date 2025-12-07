-- ========================================
-- AGREGAR TODAS LAS COLUMNAS FALTANTES
-- Copia y pega esto COMPLETO en Supabase SQL Editor
-- ========================================

-- 1. Agregar sourceId a la tabla Request
ALTER TABLE "Request" 
ADD COLUMN IF NOT EXISTS "sourceId" TEXT;

-- 2. Agregar columnas a la tabla Message
ALTER TABLE "Message" 
ADD COLUMN IF NOT EXISTS "processed" BOOLEAN DEFAULT false;

ALTER TABLE "Message" 
ADD COLUMN IF NOT EXISTS "processedAt" TIMESTAMP(3);

ALTER TABLE "Message" 
ADD COLUMN IF NOT EXISTS "sourceId" TEXT;

-- 3. Verificar que se agregaron (esto te mostrará el resultado)
SELECT 
    'Request.sourceId' as columna,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Request' AND column_name = 'sourceId'
    ) THEN '✅ Existe' ELSE '❌ Falta' END as estado
UNION ALL
SELECT 
    'Message.processed',
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Message' AND column_name = 'processed'
    ) THEN '✅ Existe' ELSE '❌ Falta' END
UNION ALL
SELECT 
    'Message.processedAt',
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Message' AND column_name = 'processedAt'
    ) THEN '✅ Existe' ELSE '❌ Falta' END
UNION ALL
SELECT 
    'Message.sourceId',
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Message' AND column_name = 'sourceId'
    ) THEN '✅ Existe' ELSE '❌ Falta' END;

