-- ========================================
-- CREAR TABLA ATTACHMENT
-- Ejecuta esto en Supabase SQL Editor
-- ========================================

-- Crear tabla Attachment si no existe
CREATE TABLE IF NOT EXISTS "Attachment" (
  "id" TEXT NOT NULL,
  
  -- Relaciones polimórficas (pueden ser null)
  "requestId" TEXT,
  "messageId" TEXT,
  "quoteId" TEXT,
  
  -- Información del archivo
  "filename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  
  -- Procesamiento
  "processed" BOOLEAN NOT NULL DEFAULT false,
  "extractedText" TEXT,
  "ocrData" JSONB,
  
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- Crear índices
CREATE INDEX IF NOT EXISTS "Attachment_requestId_idx" ON "Attachment"("requestId");
CREATE INDEX IF NOT EXISTS "Attachment_messageId_idx" ON "Attachment"("messageId");
CREATE INDEX IF NOT EXISTS "Attachment_quoteId_idx" ON "Attachment"("quoteId");

-- Agregar foreign keys (si las tablas existen)
DO $$
BEGIN
  -- Foreign key a Request
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Request') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'Attachment_requestId_fkey'
    ) THEN
      ALTER TABLE "Attachment" 
      ADD CONSTRAINT "Attachment_requestId_fkey" 
      FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE;
    END IF;
  END IF;
  
  -- Foreign key a Message
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Message') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'Attachment_messageId_fkey'
    ) THEN
      ALTER TABLE "Attachment" 
      ADD CONSTRAINT "Attachment_messageId_fkey" 
      FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Verificar que se creó
SELECT 
  'Attachment' as tabla,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'Attachment'
  ) THEN '✅ Existe' ELSE '❌ No existe' END as estado;

