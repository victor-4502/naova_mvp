# 📝 Crear Tablas Manualmente en Supabase

Como alternativa mientras resolvemos el problema de conexión, puedes crear las tablas manualmente en Supabase.

## 🎯 Pasos

### 1. Ve a Supabase SQL Editor
- Abre tu proyecto en Supabase Dashboard
- Ve a **SQL Editor** (en el menú lateral)
- Haz clic en **"New query"**

### 2. Ejecuta este SQL

Copia y pega este SQL en el editor y ejecútalo:

```sql
-- Crear ENUMs primero
CREATE TYPE "UserRole" AS ENUM ('admin_naova', 'operator_naova', 'client_enterprise', 'supplier');
CREATE TYPE "RequestSource" AS ENUM ('whatsapp', 'email', 'web', 'chat', 'file', 'api');
CREATE TYPE "RequestStatus" AS ENUM ('new_request', 'incomplete_information', 'ready_for_supplier_matching', 'supplier_matching', 'rfq_sent', 'quotes_received', 'selecting_quote', 'quote_selected', 'po_created', 'in_progress', 'delivered', 'closed', 'cancelled');
CREATE TYPE "PipelineStage" AS ENUM ('new_request', 'needs_info', 'finding_suppliers', 'quotes_in_progress', 'selecting_quote', 'purchase_in_progress', 'delivered', 'closed');
CREATE TYPE "UrgencyLevel" AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE "SupplierStatus" AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE "RFQStatus" AS ENUM ('draft', 'sent', 'in_progress', 'closed', 'cancelled');
CREATE TYPE "QuoteStatus" AS ENUM ('pending', 'submitted', 'accepted', 'rejected', 'expired');
CREATE TYPE "POStatus" AS ENUM ('approved_by_client', 'purchase_order_created', 'payment_pending', 'payment_received', 'supplier_confirmed', 'in_transit', 'delivered', 'closed', 'cancelled');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE "MessageSource" AS ENUM ('whatsapp', 'email', 'web', 'chat', 'system');
CREATE TYPE "MessageDirection" AS ENUM ('inbound', 'outbound');
CREATE TYPE "NotificationType" AS ENUM ('request_created', 'info_needed', 'suppliers_found', 'rfq_sent', 'quote_received', 'quote_selected', 'po_created', 'status_update', 'delivery_update', 'system_alert');

-- Crear tabla User
CREATE TABLE "User" (
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

-- Crear tabla ClientProfile
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "billingPlan" TEXT NOT NULL DEFAULT 'trial',
    "trialEndsAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

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

-- Crear índices y constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_active_idx" ON "User"("active");

CREATE UNIQUE INDEX "ClientProfile_userId_key" ON "ClientProfile"("userId");
CREATE INDEX "ClientProfile_billingPlan_idx" ON "ClientProfile"("billingPlan");

CREATE UNIQUE INDEX "ClientContact_userId_type_value_key" ON "ClientContact"("userId", "type", "value");
CREATE INDEX "ClientContact_userId_idx" ON "ClientContact"("userId");
CREATE INDEX "ClientContact_type_value_idx" ON "ClientContact"("type", "value");

-- Agregar foreign keys
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClientContact" ADD CONSTRAINT "ClientContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### 3. Verificar que se crearon las tablas

Después de ejecutar el SQL, ve a **Table Editor** en Supabase y verifica que aparezcan:
- `User`
- `ClientProfile`
- `ClientContact`

### 4. Crear usuario admin manualmente

Ejecuta este SQL para crear el usuario admin:

```sql
-- Crear usuario admin (la contraseña es el hash de "AdminNaova2024!")
-- Necesitarás generar el hash primero con bcrypt
-- Por ahora, puedes usar este comando en Node.js para generar el hash:

-- En Node.js:
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('AdminNaova2024!', 10).then(console.log);

-- O ejecuta el seed después de que funcione la conexión:
-- npm run prisma:seed
```

## 🔄 Después de crear las tablas

Una vez que las tablas estén creadas, intenta nuevamente:

```bash
# Verificar conexión
npx prisma db pull

# Si funciona, ejecutar seed
npm run prisma:seed
```

## ⚠️ Nota

Si prefieres esperar a que funcione la conexión automática, puedes:
1. Verificar que `DIRECT_URL` en `.env` sea correcta
2. Esperar unos minutos más después de reactivar Supabase
3. Verificar en Supabase Dashboard que el proyecto esté completamente activo

