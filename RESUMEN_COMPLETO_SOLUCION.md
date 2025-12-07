# 📋 RESUMEN COMPLETO: Solución a Todos los Problemas

## ✅ Cómo Funciona el Flujo:

```
1. Mensaje llega (WhatsApp/Email)
   ↓
2. Webhook recibe en: /api/inbox/webhook/whatsapp o /email
   (Este endpoint CREA el Request en la BD)
   ↓
3. Tú vas a /admin/requests
   (Esta página LEE los requests desde la BD y los muestra)
```

**IMPORTANTE:** `/admin/requests` NO recibe webhooks. Solo muestra lo que ya está guardado.

---

## ❌ Problemas Encontrados:

1. ❌ Falta columna `sourceId` en tabla `Request`
2. ❌ Faltan columnas `processed`, `processedAt`, `sourceId` en tabla `Message`
3. ❌ Falta tabla `Attachment` completa

---

## 🔧 SOLUCIÓN COMPLETA (Ejecutar TODO en Supabase SQL Editor):

Copia y pega esto COMPLETO en Supabase SQL Editor:

```sql
-- ========================================
-- SOLUCIÓN COMPLETA - TODAS LAS TABLAS Y COLUMNAS
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

-- 3. Crear tabla Attachment completa
CREATE TABLE IF NOT EXISTS "Attachment" (
  "id" TEXT NOT NULL,
  "requestId" TEXT,
  "messageId" TEXT,
  "quoteId" TEXT,
  "filename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "processed" BOOLEAN NOT NULL DEFAULT false,
  "extractedText" TEXT,
  "ocrData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- 4. Crear índices para Attachment
CREATE INDEX IF NOT EXISTS "Attachment_requestId_idx" ON "Attachment"("requestId");
CREATE INDEX IF NOT EXISTS "Attachment_messageId_idx" ON "Attachment"("messageId");
CREATE INDEX IF NOT EXISTS "Attachment_quoteId_idx" ON "Attachment"("quoteId");

-- 5. Agregar foreign keys (solo si las tablas existen)
DO $$
BEGIN
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

-- 6. Verificar todo
SELECT 
    'Request.sourceId' as item,
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
    ) THEN '✅ Existe' ELSE '❌ Falta' END
UNION ALL
SELECT 
    'Attachment',
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'Attachment'
    ) THEN '✅ Existe' ELSE '❌ Falta' END;
```

---

## ✅ Después de Ejecutar el SQL:

1. Deberías ver 5 filas, todas con "✅ Existe"
2. Prueba los webhooks nuevamente:
   ```powershell
   npm run test:webhook:whatsapp
   npm run test:webhook:email
   ```
3. Ve a `/admin/requests` para ver los requests creados

---

## 📝 Archivos de Referencia:

- `SQL_CREAR_TABLA_ATTACHMENT.sql` - Solo para crear Attachment
- `SQL_AGREGAR_COLUMNAS_COMPLETO.sql` - Solo columnas
- Este archivo tiene TODO junto

---

**¡Ejecuta el SQL completo y luego prueba los webhooks! 🚀**

