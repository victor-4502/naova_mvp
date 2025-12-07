-- Migration SQL Seguro - Verifica antes de crear
-- Este SQL verifica si las tablas/enums ya existen antes de crearlos

-- ============================================
-- CREAR ENUMs (solo si no existen)
-- ============================================

-- Eliminar enum si existe con valores incorrectos y recrearlo
DO $$ 
BEGIN
    -- Si el enum existe pero no tiene los valores correctos, eliminarlo
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
        -- Verificar si tiene los valores correctos
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum 
            WHERE enumlabel = 'client_enterprise' 
            AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserRole')
        ) THEN
            -- Eliminar el enum antiguo (primero hay que eliminar dependencias)
            DROP TYPE IF EXISTS "UserRole" CASCADE;
            CREATE TYPE "UserRole" AS ENUM ('admin_naova', 'operator_naova', 'client_enterprise', 'supplier');
        END IF;
    ELSE
        -- Si no existe, crearlo
        CREATE TYPE "UserRole" AS ENUM ('admin_naova', 'operator_naova', 'client_enterprise', 'supplier');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RequestSource') THEN
        CREATE TYPE "RequestSource" AS ENUM ('whatsapp', 'email', 'web', 'chat', 'file', 'api');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RequestStatus') THEN
        CREATE TYPE "RequestStatus" AS ENUM ('new_request', 'incomplete_information', 'ready_for_supplier_matching', 'supplier_matching', 'rfq_sent', 'quotes_received', 'selecting_quote', 'quote_selected', 'po_created', 'in_progress', 'delivered', 'closed', 'cancelled');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PipelineStage') THEN
        CREATE TYPE "PipelineStage" AS ENUM ('new_request', 'needs_info', 'finding_suppliers', 'quotes_in_progress', 'selecting_quote', 'purchase_in_progress', 'delivered', 'closed');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UrgencyLevel') THEN
        CREATE TYPE "UrgencyLevel" AS ENUM ('low', 'normal', 'high', 'urgent');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SupplierStatus') THEN
        CREATE TYPE "SupplierStatus" AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RFQStatus') THEN
        CREATE TYPE "RFQStatus" AS ENUM ('draft', 'sent', 'in_progress', 'closed', 'cancelled');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QuoteStatus') THEN
        CREATE TYPE "QuoteStatus" AS ENUM ('pending', 'submitted', 'accepted', 'rejected', 'expired');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'POStatus') THEN
        CREATE TYPE "POStatus" AS ENUM ('approved_by_client', 'purchase_order_created', 'payment_pending', 'payment_received', 'supplier_confirmed', 'in_transit', 'delivered', 'closed', 'cancelled');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaymentStatus') THEN
        CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MessageSource') THEN
        CREATE TYPE "MessageSource" AS ENUM ('whatsapp', 'email', 'web', 'chat', 'system');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MessageDirection') THEN
        CREATE TYPE "MessageDirection" AS ENUM ('inbound', 'outbound');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationType') THEN
        CREATE TYPE "NotificationType" AS ENUM ('request_created', 'info_needed', 'suppliers_found', 'rfq_sent', 'quote_received', 'quote_selected', 'po_created', 'status_update', 'delivery_update', 'system_alert');
    END IF;
END $$;

-- ============================================
-- CREAR TABLAS (solo si no existen)
-- ============================================

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'client_enterprise',
    "company" TEXT,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ClientProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "billingPlan" TEXT NOT NULL DEFAULT 'trial',
    "trialEndsAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ClientContact" (
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

-- ============================================
-- CREAR ÍNDICES (solo si no existen)
-- ============================================

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_active_idx" ON "User"("active");

CREATE UNIQUE INDEX IF NOT EXISTS "ClientProfile_userId_key" ON "ClientProfile"("userId");
CREATE INDEX IF NOT EXISTS "ClientProfile_billingPlan_idx" ON "ClientProfile"("billingPlan");

CREATE UNIQUE INDEX IF NOT EXISTS "ClientContact_userId_type_value_key" ON "ClientContact"("userId", "type", "value");
CREATE INDEX IF NOT EXISTS "ClientContact_userId_idx" ON "ClientContact"("userId");
CREATE INDEX IF NOT EXISTS "ClientContact_type_value_idx" ON "ClientContact"("type", "value");

-- ============================================
-- AGREGAR FOREIGN KEYS (solo si no existen)
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ClientProfile_userId_fkey'
    ) THEN
        ALTER TABLE "ClientProfile" 
        ADD CONSTRAINT "ClientProfile_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ClientContact_userId_fkey'
    ) THEN
        ALTER TABLE "ClientContact" 
        ADD CONSTRAINT "ClientContact_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

