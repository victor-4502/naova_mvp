-- Migration SQL Completo y Seguro
-- Este script verifica antes de crear y maneja enums/tablas existentes
-- Ejecuta esto en Supabase SQL Editor

-- ============================================
-- CORREGIR/CREAR ENUMs (con verificación)
-- ============================================

-- UserRole: Eliminar si existe con valores incorrectos y recrear
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
        -- Verificar si tiene los valores correctos
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum 
            WHERE enumlabel = 'client_enterprise' 
            AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserRole')
        ) THEN
            -- El enum existe pero tiene valores incorrectos, eliminarlo
            DROP TYPE "UserRole" CASCADE;
        END IF;
    END IF;
    
    -- Crear el enum con los valores correctos (si no existe)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
        CREATE TYPE "UserRole" AS ENUM ('admin_naova', 'operator_naova', 'client_enterprise', 'supplier');
    END IF;
END $$;

-- RequestSource
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RequestSource') THEN
        CREATE TYPE "RequestSource" AS ENUM ('whatsapp', 'email', 'web', 'chat', 'file', 'api');
    END IF;
END $$;

-- RequestStatus
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RequestStatus') THEN
        CREATE TYPE "RequestStatus" AS ENUM ('new_request', 'incomplete_information', 'ready_for_supplier_matching', 'supplier_matching', 'rfq_sent', 'quotes_received', 'selecting_quote', 'quote_selected', 'po_created', 'in_progress', 'delivered', 'closed', 'cancelled');
    END IF;
END $$;

-- PipelineStage
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PipelineStage') THEN
        CREATE TYPE "PipelineStage" AS ENUM ('new_request', 'needs_info', 'finding_suppliers', 'quotes_in_progress', 'selecting_quote', 'purchase_in_progress', 'delivered', 'closed');
    END IF;
END $$;

-- UrgencyLevel
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UrgencyLevel') THEN
        CREATE TYPE "UrgencyLevel" AS ENUM ('low', 'normal', 'high', 'urgent');
    END IF;
END $$;

-- SupplierStatus
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SupplierStatus') THEN
        CREATE TYPE "SupplierStatus" AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
    END IF;
END $$;

-- RFQStatus
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RFQStatus') THEN
        CREATE TYPE "RFQStatus" AS ENUM ('draft', 'sent', 'in_progress', 'closed', 'cancelled');
    END IF;
END $$;

-- QuoteStatus
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QuoteStatus') THEN
        CREATE TYPE "QuoteStatus" AS ENUM ('pending', 'submitted', 'accepted', 'rejected', 'expired');
    END IF;
END $$;

-- POStatus
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'POStatus') THEN
        CREATE TYPE "POStatus" AS ENUM ('approved_by_client', 'purchase_order_created', 'payment_pending', 'payment_received', 'supplier_confirmed', 'in_transit', 'delivered', 'closed', 'cancelled');
    END IF;
END $$;

-- PaymentStatus
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaymentStatus') THEN
        CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
    END IF;
END $$;

-- MessageSource
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MessageSource') THEN
        CREATE TYPE "MessageSource" AS ENUM ('whatsapp', 'email', 'web', 'chat', 'system');
    END IF;
END $$;

-- MessageDirection
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MessageDirection') THEN
        CREATE TYPE "MessageDirection" AS ENUM ('inbound', 'outbound');
    END IF;
END $$;

-- NotificationType
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationType') THEN
        CREATE TYPE "NotificationType" AS ENUM ('request_created', 'info_needed', 'suppliers_found', 'rfq_sent', 'quote_received', 'quote_selected', 'po_created', 'status_update', 'delivery_update', 'system_alert');
    END IF;
END $$;

-- ============================================
-- CREAR TABLAS (solo si no existen)
-- ============================================

-- User
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

-- ClientProfile
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

-- ClientContact
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

-- Supplier
CREATE TABLE IF NOT EXISTS "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "status" "SupplierStatus" NOT NULL DEFAULT 'active',
    "categories" JSONB,
    "score" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- Request
CREATE TABLE IF NOT EXISTS "Request" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "source" "RequestSource" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'new_request',
    "pipelineStage" "PipelineStage" NOT NULL DEFAULT 'new_request',
    "urgency" "UrgencyLevel" NOT NULL DEFAULT 'normal',
    "subject" TEXT,
    "description" TEXT,
    "rawContent" TEXT NOT NULL,
    "extractedData" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- RequestSpecification
CREATE TABLE IF NOT EXISTS "RequestSpecification" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "category" TEXT,
    "item" TEXT NOT NULL,
    "quantity" INTEGER,
    "unit" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestSpecification_pkey" PRIMARY KEY ("id")
);

-- RFQ
CREATE TABLE IF NOT EXISTS "RFQ" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "status" "RFQStatus" NOT NULL DEFAULT 'draft',
    "sentAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RFQ_pkey" PRIMARY KEY ("id")
);

-- RFQSupplier
CREATE TABLE IF NOT EXISTS "RFQSupplier" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "invitedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RFQSupplier_pkey" PRIMARY KEY ("id")
);

-- Quote
CREATE TABLE IF NOT EXISTS "Quote" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'pending',
    "items" JSONB NOT NULL,
    "totalAmount" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "validUntil" TIMESTAMP(3),
    "terms" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- PurchaseOrder
CREATE TABLE IF NOT EXISTS "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "status" "POStatus" NOT NULL DEFAULT 'approved_by_client',
    "items" JSONB NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "poNumber" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- PurchaseHistory
CREATE TABLE IF NOT EXISTS "PurchaseHistory" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "purchaseOrderId" TEXT,
    "category" TEXT,
    "item" TEXT NOT NULL,
    "quantity" INTEGER,
    "unitPrice" DECIMAL(10,2),
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseHistory_pkey" PRIMARY KEY ("id")
);

-- Message
CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL,
    "requestId" TEXT,
    "source" "MessageSource" NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "extractedText" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- Notification
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "requestId" TEXT,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- Tender
CREATE TABLE IF NOT EXISTS "Tender" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "deadline" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tender_pkey" PRIMARY KEY ("id")
);

-- Offer
CREATE TABLE IF NOT EXISTS "Offer" (
    "id" TEXT NOT NULL,
    "tenderId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- AuditLog
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "changes" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
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

CREATE INDEX IF NOT EXISTS "Supplier_email_idx" ON "Supplier"("email");
CREATE INDEX IF NOT EXISTS "Supplier_status_idx" ON "Supplier"("status");

CREATE INDEX IF NOT EXISTS "Request_clientId_idx" ON "Request"("clientId");
CREATE INDEX IF NOT EXISTS "Request_status_idx" ON "Request"("status");
CREATE INDEX IF NOT EXISTS "Request_pipelineStage_idx" ON "Request"("pipelineStage");
CREATE INDEX IF NOT EXISTS "Request_source_idx" ON "Request"("source");
CREATE INDEX IF NOT EXISTS "Request_createdAt_idx" ON "Request"("createdAt");

CREATE INDEX IF NOT EXISTS "RequestSpecification_requestId_idx" ON "RequestSpecification"("requestId");

CREATE INDEX IF NOT EXISTS "RFQ_requestId_idx" ON "RFQ"("requestId");
CREATE INDEX IF NOT EXISTS "RFQ_status_idx" ON "RFQ"("status");

CREATE INDEX IF NOT EXISTS "RFQSupplier_rfqId_idx" ON "RFQSupplier"("rfqId");
CREATE INDEX IF NOT EXISTS "RFQSupplier_supplierId_idx" ON "RFQSupplier"("supplierId");

CREATE INDEX IF NOT EXISTS "Quote_rfqId_idx" ON "Quote"("rfqId");
CREATE INDEX IF NOT EXISTS "Quote_supplierId_idx" ON "Quote"("supplierId");
CREATE INDEX IF NOT EXISTS "Quote_status_idx" ON "Quote"("status");

CREATE INDEX IF NOT EXISTS "PurchaseOrder_requestId_idx" ON "PurchaseOrder"("requestId");
CREATE INDEX IF NOT EXISTS "PurchaseOrder_clientId_idx" ON "PurchaseOrder"("clientId");
CREATE INDEX IF NOT EXISTS "PurchaseOrder_supplierId_idx" ON "PurchaseOrder"("supplierId");
CREATE INDEX IF NOT EXISTS "PurchaseOrder_status_idx" ON "PurchaseOrder"("status");

CREATE INDEX IF NOT EXISTS "PurchaseHistory_clientId_idx" ON "PurchaseHistory"("clientId");
CREATE INDEX IF NOT EXISTS "PurchaseHistory_supplierId_idx" ON "PurchaseHistory"("supplierId");
CREATE INDEX IF NOT EXISTS "PurchaseHistory_category_idx" ON "PurchaseHistory"("category");

CREATE INDEX IF NOT EXISTS "Message_requestId_idx" ON "Message"("requestId");
CREATE INDEX IF NOT EXISTS "Message_source_idx" ON "Message"("source");

CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS "Notification_requestId_idx" ON "Notification"("requestId");
CREATE INDEX IF NOT EXISTS "Notification_read_idx" ON "Notification"("read");

CREATE INDEX IF NOT EXISTS "Tender_clientId_idx" ON "Tender"("clientId");
CREATE INDEX IF NOT EXISTS "Tender_status_idx" ON "Tender"("status");

CREATE INDEX IF NOT EXISTS "Offer_tenderId_idx" ON "Offer"("tenderId");
CREATE INDEX IF NOT EXISTS "Offer_supplierId_idx" ON "Offer"("supplierId");

CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- ============================================
-- AGREGAR FOREIGN KEYS (solo si no existen)
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ClientProfile_userId_fkey') THEN
        ALTER TABLE "ClientProfile" 
        ADD CONSTRAINT "ClientProfile_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ClientContact_userId_fkey') THEN
        ALTER TABLE "ClientContact" 
        ADD CONSTRAINT "ClientContact_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Request_clientId_fkey') THEN
        ALTER TABLE "Request" 
        ADD CONSTRAINT "Request_clientId_fkey" 
        FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RequestSpecification_requestId_fkey') THEN
        ALTER TABLE "RequestSpecification" 
        ADD CONSTRAINT "RequestSpecification_requestId_fkey" 
        FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RFQ_requestId_fkey') THEN
        ALTER TABLE "RFQ" 
        ADD CONSTRAINT "RFQ_requestId_fkey" 
        FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RFQSupplier_rfqId_fkey') THEN
        ALTER TABLE "RFQSupplier" 
        ADD CONSTRAINT "RFQSupplier_rfqId_fkey" 
        FOREIGN KEY ("rfqId") REFERENCES "RFQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RFQSupplier_supplierId_fkey') THEN
        ALTER TABLE "RFQSupplier" 
        ADD CONSTRAINT "RFQSupplier_supplierId_fkey" 
        FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Quote_rfqId_fkey') THEN
        ALTER TABLE "Quote" 
        ADD CONSTRAINT "Quote_rfqId_fkey" 
        FOREIGN KEY ("rfqId") REFERENCES "RFQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Quote_supplierId_fkey') THEN
        ALTER TABLE "Quote" 
        ADD CONSTRAINT "Quote_supplierId_fkey" 
        FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseOrder_requestId_fkey') THEN
        ALTER TABLE "PurchaseOrder" 
        ADD CONSTRAINT "PurchaseOrder_requestId_fkey" 
        FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseOrder_quoteId_fkey') THEN
        ALTER TABLE "PurchaseOrder" 
        ADD CONSTRAINT "PurchaseOrder_quoteId_fkey" 
        FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseOrder_clientId_fkey') THEN
        ALTER TABLE "PurchaseOrder" 
        ADD CONSTRAINT "PurchaseOrder_clientId_fkey" 
        FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseOrder_supplierId_fkey') THEN
        ALTER TABLE "PurchaseOrder" 
        ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" 
        FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseHistory_clientId_fkey') THEN
        ALTER TABLE "PurchaseHistory" 
        ADD CONSTRAINT "PurchaseHistory_clientId_fkey" 
        FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseHistory_supplierId_fkey') THEN
        ALTER TABLE "PurchaseHistory" 
        ADD CONSTRAINT "PurchaseHistory_supplierId_fkey" 
        FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseHistory_purchaseOrderId_fkey') THEN
        ALTER TABLE "PurchaseHistory" 
        ADD CONSTRAINT "PurchaseHistory_purchaseOrderId_fkey" 
        FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Message_requestId_fkey') THEN
        ALTER TABLE "Message" 
        ADD CONSTRAINT "Message_requestId_fkey" 
        FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Notification_requestId_fkey') THEN
        ALTER TABLE "Notification" 
        ADD CONSTRAINT "Notification_requestId_fkey" 
        FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Notification_userId_fkey') THEN
        ALTER TABLE "Notification" 
        ADD CONSTRAINT "Notification_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Tender_clientId_fkey') THEN
        ALTER TABLE "Tender" 
        ADD CONSTRAINT "Tender_clientId_fkey" 
        FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Offer_tenderId_fkey') THEN
        ALTER TABLE "Offer" 
        ADD CONSTRAINT "Offer_tenderId_fkey" 
        FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Offer_supplierId_fkey') THEN
        ALTER TABLE "Offer" 
        ADD CONSTRAINT "Offer_supplierId_fkey" 
        FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Verificar que se crearon las tablas principales
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('User', 'Request', 'Supplier', 'RFQ', 'Quote', 'PurchaseOrder')
ORDER BY table_name;

