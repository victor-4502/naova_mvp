-- Script para crear todas las tablas en Supabase
-- Copia y pega esto en el SQL Editor de Supabase

-- Crear enum UserRole
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('admin', 'client');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Crear enum RequirementStatus
DO $$ BEGIN
  CREATE TYPE "RequirementStatus" AS ENUM ('draft', 'pending', 'in_tender', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Crear enum TenderStatus
DO $$ BEGIN
  CREATE TYPE "TenderStatus" AS ENUM ('draft', 'active', 'closed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Crear tabla User
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'client',
  "company" TEXT,
  "phone" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");

-- Crear tabla ClientProfile
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

CREATE UNIQUE INDEX IF NOT EXISTS "ClientProfile_userId_key" ON "ClientProfile"("userId");
CREATE INDEX IF NOT EXISTS "ClientProfile_billingPlan_idx" ON "ClientProfile"("billingPlan");

ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Crear tabla Requirement
CREATE TABLE IF NOT EXISTS "Requirement" (
  "id" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL,
  "fileUrl" TEXT,
  "status" "RequirementStatus" NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Requirement_clientId_idx" ON "Requirement"("clientId");
CREATE INDEX IF NOT EXISTS "Requirement_status_idx" ON "Requirement"("status");
CREATE INDEX IF NOT EXISTS "Requirement_category_idx" ON "Requirement"("category");

ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_clientId_fkey" 
  FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Crear tabla Provider
CREATE TABLE IF NOT EXISTS "Provider" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "contact" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Provider_category_idx" ON "Provider"("category");
CREATE INDEX IF NOT EXISTS "Provider_active_idx" ON "Provider"("active");

-- Crear tabla Tender
CREATE TABLE IF NOT EXISTS "Tender" (
  "id" TEXT NOT NULL,
  "requirementId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" "TenderStatus" NOT NULL DEFAULT 'draft',
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Tender_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Tender_requirementId_key" ON "Tender"("requirementId");
CREATE INDEX IF NOT EXISTS "Tender_status_idx" ON "Tender"("status");
CREATE INDEX IF NOT EXISTS "Tender_createdById_idx" ON "Tender"("createdById");

ALTER TABLE "Tender" ADD CONSTRAINT "Tender_requirementId_fkey" 
  FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Tender" ADD CONSTRAINT "Tender_createdById_fkey" 
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Crear tabla Offer
CREATE TABLE IF NOT EXISTS "Offer" (
  "id" TEXT NOT NULL,
  "tenderId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "deliveryDays" INTEGER NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Offer_tenderId_idx" ON "Offer"("tenderId");
CREATE INDEX IF NOT EXISTS "Offer_providerId_idx" ON "Offer"("providerId");

ALTER TABLE "Offer" ADD CONSTRAINT "Offer_tenderId_fkey" 
  FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Offer" ADD CONSTRAINT "Offer_providerId_fkey" 
  FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Crear tabla PurchaseHistory
CREATE TABLE IF NOT EXISTS "PurchaseHistory" (
  "id" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "item" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL,
  "unitPrice" DOUBLE PRECISION NOT NULL,
  "totalPrice" DOUBLE PRECISION NOT NULL,
  "providerId" TEXT,
  "date" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PurchaseHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PurchaseHistory_clientId_idx" ON "PurchaseHistory"("clientId");
CREATE INDEX IF NOT EXISTS "PurchaseHistory_category_idx" ON "PurchaseHistory"("category");
CREATE INDEX IF NOT EXISTS "PurchaseHistory_date_idx" ON "PurchaseHistory"("date");

ALTER TABLE "PurchaseHistory" ADD CONSTRAINT "PurchaseHistory_providerId_fkey" 
  FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Crear tabla ContactLead
CREATE TABLE IF NOT EXISTS "ContactLead" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "company" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "planInterest" TEXT,
  "message" TEXT,
  "status" TEXT NOT NULL DEFAULT 'new',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContactLead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ContactLead_status_idx" ON "ContactLead"("status");
CREATE INDEX IF NOT EXISTS "ContactLead_createdAt_idx" ON "ContactLead"("createdAt");

-- Crear tabla AuditLog
CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "userId" TEXT,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

