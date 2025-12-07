-- Script para crear la tabla ClientContact si no existe
-- Ejecuta esto en Supabase SQL Editor

-- Verificar si la tabla existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'ClientContact'
    ) THEN
        -- Crear tabla ClientContact
        CREATE TABLE "ClientContact" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "type" TEXT NOT NULL,
            "value" TEXT NOT NULL,
            "label" TEXT,
            "isPrimary" BOOLEAN NOT NULL DEFAULT false,
            "verified" BOOLEAN NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "ClientContact_pkey" PRIMARY KEY ("id")
        );

        -- Crear índices
        CREATE INDEX "ClientContact_userId_idx" ON "ClientContact"("userId");
        CREATE INDEX "ClientContact_type_value_idx" ON "ClientContact"("type", "value");
        CREATE UNIQUE INDEX "ClientContact_userId_type_value_key" ON "ClientContact"("userId", "type", "value");

        -- Crear foreign key
        ALTER TABLE "ClientContact" 
        ADD CONSTRAINT "ClientContact_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;

        RAISE NOTICE 'Tabla ClientContact creada exitosamente';
    ELSE
        RAISE NOTICE 'La tabla ClientContact ya existe';
    END IF;
END $$;

-- Verificar que se creó correctamente
SELECT 
    'ClientContact' as tabla,
    COUNT(*) as total_contactos
FROM "ClientContact";

