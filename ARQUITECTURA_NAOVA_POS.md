# 🏗️ NAOVA PROCUREMENT OPERATING SYSTEM - Arquitectura Completa

## 📋 ÍNDICE

1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Modelo de Datos](#modelo-de-datos)
5. [Módulos Principales](#módulos-principales)
6. [Flujos de Trabajo](#flujos-de-trabajo)
7. [Plan de Migración](#plan-de-migración)
8. [Estructura de Carpetas](#estructura-de-carpetas)

---

## 🎯 VISIÓN GENERAL

Naova se transforma de una plataforma simple de licitaciones a un **Procurement Operating System** completo que:

- **Recibe solicitudes** desde múltiples canales (WhatsApp, Email, Web, Chat)
- **Normaliza y enriquece** automáticamente la información
- **Encuentra proveedores** relevantes usando IA y datos históricos
- **Genera RFQs automáticamente** y gestiona cotizaciones
- **Compara ofertas** de forma inteligente
- **Rastrea órdenes** de compra hasta la entrega
- **Automatiza** el flujo completo con reglas de negocio

---

## 🛠️ STACK TECNOLÓGICO

### Frontend
- **Next.js 14** (App Router) - Framework principal
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos
- **Zustand** - Estado global (reemplaza store actual)
- **Shadcn/UI** - Componentes base
- **React Query (TanStack Query)** - Server state management
- **Framer Motion** - Animaciones

### Backend
- **Next.js API Routes** (mantener por ahora, migrar a NestJS en fase 2)
- **TypeScript** - Tipado estático
- **Prisma ORM** - Base de datos
- **PostgreSQL** - Base de datos principal
- **BullMQ + Redis** - Colas de trabajo en background
- **Zod** - Validación de esquemas

### Infraestructura
- **Docker** - Containerización
- **Vercel** - Deploy frontend/API
- **Railway/Render** - Backend services y workers
- **Redis** - Cache y colas
- **Supabase** - PostgreSQL hosting (actual)

### Integraciones
- **WhatsApp Business API** - Webhooks
- **Email (SMTP/IMAP)** - Recepción y envío
- **PDF Parser** - Extracción de datos de documentos
- **OCR** - Procesamiento de imágenes

---

## 🏛️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Dashboard │  │  Inbox   │  │ Pipeline │  │  Reports │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  API LAYER (Next.js API)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Requests │  │   RFQs   │  │   POs    │  │ Suppliers │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              BUSINESS LOGIC LAYER (Services)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Inbox Service│  │ Spec Engine  │  │ Matching     │      │
│  │              │  │              │  │ Engine       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ RFQ Engine   │  │ Quote        │  │ Automation  │      │
│  │              │  │ Comparator   │  │ Engine       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKGROUND WORKERS (BullMQ)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Email        │  │ WhatsApp     │  │ Notification │      │
│  │ Processor    │  │ Processor    │  │ Worker       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Prisma)                       │
│                    PostgreSQL Database                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 MODELO DE DATOS

### Entidades Principales

#### 1. Request (Solicitud)
```prisma
model Request {
  id                    String   @id @default(cuid())
  source                RequestSource  // whatsapp, email, web, chat, file
  sourceId              String?  // ID del mensaje original
  clientId              String
  client                User     @relation(fields: [clientId], references: [id])
  
  // Estado del pipeline
  status                RequestStatus @default(new_request)
  pipelineStage         PipelineStage @default(new_request)
  
  // Información extraída
  rawContent            String   @db.Text
  normalizedContent     Json?    // Contenido procesado
  
  // Clasificación automática
  category              String?
  subcategory          String?
  urgency               UrgencyLevel @default(normal)
  
  // Metadata
  attachments           Attachment[]
  messages              Message[]
  specs                 RequestSpec?
  rfq                   RFQ?
  purchaseOrder         PurchaseOrder?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([clientId])
  @@index([status])
  @@index([pipelineStage])
  @@index([source])
}
```

#### 2. RequestSpec (Especificaciones Normalizadas)
```prisma
model RequestSpec {
  id                    String   @id @default(cuid())
  requestId             String   @unique
  request               Request  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  
  // Especificaciones normalizadas
  normalizedSpecs       Json     // Schema estructurado por categoría
  completeness          Float    @default(0) // 0-1 score
  missingFields         String[] // Campos faltantes
  
  // Items del request
  items                 SpecItem[]
  
  // Validaciones
  isValid               Boolean  @default(false)
  validationErrors      Json?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model SpecItem {
  id                    String   @id @default(cuid())
  specId                String
  spec                  RequestSpec @relation(fields: [specId], references: [id], onDelete: Cascade)
  
  name                  String
  description           String?  @db.Text
  category              String
  subcategory           String?
  quantity              Float
  unit                  String   // Normalizado: kg, l, m, pcs, etc.
  unitPrice             Float?
  totalPrice            Float?
  
  // Especificaciones técnicas
  specifications        Json?
  brand                 String?
  model                 String?
  sku                   String?
  
  // Metadata
  budget                Float?
  deliveryDate          DateTime?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([specId])
}
```

#### 3. Supplier (Proveedor)
```prisma
model Supplier {
  id                    String   @id @default(cuid())
  name                  String
  companyName           String
  email                 String
  phone                 String?
  website               String?
  
  // Ubicación
  address               String?
  city                  String?
  state                String?
  country              String   @default("México")
  zipCode              String?
  
  // Clasificación
  categories            SupplierCategory[]
  specialties           String[]
  
  // Scoring
  score                 SupplierScore?
  
  // Estado
  status                SupplierStatus @default(active)
  verified              Boolean  @default(false)
  
  // Relaciones
  quotes                SupplierQuote[]
  purchaseOrders        PurchaseOrder[]
  purchaseHistory       PurchaseHistory[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([status])
  @@index([verified])
}

model SupplierCategory {
  id                    String   @id @default(cuid())
  supplierId            String
  supplier              Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  category              String
  subcategory           String?
  
  @@unique([supplierId, category, subcategory])
  @@index([category])
}

model SupplierScore {
  id                    String   @id @default(cuid())
  supplierId            String   @unique
  supplier              Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  
  // Scores individuales
  priceScore            Float    @default(0) // 0-10
  qualityScore          Float    @default(0)
  deliveryScore          Float    @default(0)
  responseTimeScore     Float    @default(0)
  communicationScore    Float    @default(0)
  
  // Score total
  overallScore          Float    @default(0)
  
  // Métricas
  totalOrders           Int      @default(0)
  totalVolume            Float    @default(0)
  averageResponseTime    Int?     // minutos
  onTimeDeliveryRate     Float    @default(0) // 0-1
  
  updatedAt             DateTime @updatedAt
}
```

#### 4. RFQ (Request for Quotation)
```prisma
model RFQ {
  id                    String   @id @default(cuid())
  requestId             String   @unique
  request               Request  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  
  // Estado
  status                RFQStatus @default(draft)
  
  // Información
  title                 String
  description           String?   @db.Text
  deadline              DateTime
  
  // Items
  items                 RFQItem[]
  
  // Proveedores
  invitedSuppliers      RFQSupplier[]
  quotes                SupplierQuote[]
  
  // Automatización
  autoGenerated         Boolean  @default(false)
  sentAt                DateTime?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([status])
  @@index([deadline])
}

model RFQItem {
  id                    String   @id @default(cuid())
  rfqId                 String
  rfq                   RFQ      @relation(fields: [rfqId], references: [id], onDelete: Cascade)
  specItemId            String?
  specItem              SpecItem? @relation(fields: [specItemId], references: [id])
  
  name                  String
  description           String?   @db.Text
  category              String
  quantity              Float
  unit                  String
  specifications        Json?
  
  @@index([rfqId])
}

model RFQSupplier {
  id                    String   @id @default(cuid())
  rfqId                 String
  rfq                   RFQ      @relation(fields: [rfqId], references: [id], onDelete: Cascade)
  supplierId            String
  supplier              Supplier @relation(fields: [supplierId], references: [id])
  
  invitedAt             DateTime @default(now())
  viewedAt              DateTime?
  respondedAt           DateTime?
  
  @@unique([rfqId, supplierId])
  @@index([rfqId])
  @@index([supplierId])
}
```

#### 5. SupplierQuote (Cotización)
```prisma
model SupplierQuote {
  id                    String   @id @default(cuid())
  rfqId                 String
  rfq                   RFQ      @relation(fields: [rfqId], references: [id], onDelete: Cascade)
  supplierId            String
  supplier              Supplier @relation(fields: [supplierId], references: [id])
  
  // Estado
  status                QuoteStatus @default(pending)
  
  // Precios
  subtotal              Float
  taxes                 Float     @default(0)
  shipping              Float     @default(0)
  total                 Float
  
  // Términos
  validUntil            DateTime
  deliveryDays          Int
  paymentTerms          String?
  warranty              String?
  availability          String?   // in_stock, made_to_order, etc.
  
  // Items
  items                 QuoteItem[]
  
  // Comparación
  comparisonScore       Float?    // Score calculado para comparación
  
  // Metadata
  notes                 String?   @db.Text
  attachments           Attachment[]
  
  submittedAt           DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([rfqId])
  @@index([supplierId])
  @@index([status])
}

model QuoteItem {
  id                    String   @id @default(cuid())
  quoteId               String
  quote                 SupplierQuote @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  rfqItemId             String?
  rfqItem               RFQItem?  @relation(fields: [rfqItemId], references: [id])
  
  name                  String
  quantity              Float
  unit                  String
  unitPrice             Float
  subtotal              Float
  
  // Especificaciones del proveedor
  brand                 String?
  model                 String?
  specifications        Json?
  
  @@index([quoteId])
}
```

#### 6. PurchaseOrder (Orden de Compra)
```prisma
model PurchaseOrder {
  id                    String   @id @default(cuid())
  requestId             String   @unique
  request               Request  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  quoteId               String   @unique
  quote                 SupplierQuote @relation(fields: [quoteId], references: [id])
  supplierId            String
  supplier              Supplier @relation(fields: [supplierId], references: [id])
  clientId              String
  client                User     @relation(fields: [clientId], references: [id])
  
  // Estado del tracking
  status                POStatus @default(approved_by_client)
  
  // Información
  poNumber              String   @unique
  totalAmount           Float
  
  // Tracking
  timeline              POTimelineEvent[]
  
  // Items
  items                 POItem[]
  
  // Pagos
  paymentStatus         PaymentStatus @default(pending)
  paymentMethod         String?
  paymentReference      String?
  paidAt                DateTime?
  
  // Entrega
  estimatedDelivery     DateTime?
  actualDelivery        DateTime?
  deliveryAddress       String?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([clientId])
  @@index([supplierId])
  @@index([status])
  @@index([poNumber])
}

model POTimelineEvent {
  id                    String   @id @default(cuid())
  poId                  String
  po                    PurchaseOrder @relation(fields: [poId], references: [id], onDelete: Cascade)
  
  status                POStatus
  description           String
  metadata              Json?
  
  createdAt             DateTime @default(now())
  
  @@index([poId])
  @@index([createdAt])
}

model POItem {
  id                    String   @id @default(cuid())
  poId                  String
  po                    PurchaseOrder @relation(fields: [poId], references: [id], onDelete: Cascade)
  
  name                  String
  description           String?  @db.Text
  quantity              Float
  unit                  String
  unitPrice             Float
  subtotal              Float
  
  @@index([poId])
}
```

#### 7. Message (Mensajes)
```prisma
model Message {
  id                    String   @id @default(cuid())
  requestId             String?
  request               Request? @relation(fields: [requestId], references: [id], onDelete: Cascade)
  
  source                MessageSource
  sourceId              String?  // ID del mensaje original
  direction             MessageDirection
  
  content               String   @db.Text
  attachments           Attachment[]
  
  // Metadata
  from                  String?
  to                    String?
  subject               String?
  
  processed             Boolean  @default(false)
  processedAt           DateTime?
  
  createdAt             DateTime @default(now())
  
  @@index([requestId])
  @@index([source])
  @@index([processed])
}
```

#### 8. Attachment (Adjuntos)
```prisma
model Attachment {
  id                    String   @id @default(cuid())
  
  // Relaciones polimórficas
  requestId             String?
  request               Request? @relation(fields: [requestId], references: [id], onDelete: Cascade)
  messageId             String?
  message               Message? @relation(fields: [messageId], references: [id], onDelete: Cascade)
  quoteId               String?
  quote                 SupplierQuote? @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  
  filename              String
  mimeType              String
  size                  Int      // bytes
  url                   String   // S3/Storage URL
  
  // Procesamiento
  processed             Boolean  @default(false)
  extractedText         String?  @db.Text
  ocrData               Json?
  
  createdAt             DateTime @default(now())
  
  @@index([requestId])
  @@index([messageId])
}
```

#### 9. Notification (Notificaciones)
```prisma
model Notification {
  id                    String   @id @default(cuid())
  userId                String
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type                  NotificationType
  title                 String
  message               String   @db.Text
  
  // Relación opcional
  requestId             String?
  request               Request? @relation(fields: [requestId], references: [id], onDelete: Cascade)
  
  read                  Boolean  @default(false)
  readAt                DateTime?
  
  metadata              Json?
  
  createdAt             DateTime @default(now())
  
  @@index([userId])
  @@index([read])
  @@index([createdAt])
}
```

### Enums

```prisma
enum RequestSource {
  whatsapp
  email
  web
  chat
  file
  api
}

enum RequestStatus {
  new_request
  incomplete_information
  ready_for_supplier_matching
  supplier_matching
  rfq_sent
  quotes_received
  selecting_quote
  quote_selected
  po_created
  in_progress
  delivered
  closed
  cancelled
}

enum PipelineStage {
  new_request
  needs_info
  finding_suppliers
  quotes_in_progress
  selecting_quote
  purchase_in_progress
  delivered
  closed
}

enum UrgencyLevel {
  low
  normal
  high
  urgent
}

enum SupplierStatus {
  active
  inactive
  suspended
  pending_verification
}

enum RFQStatus {
  draft
  sent
  in_progress
  closed
  cancelled
}

enum QuoteStatus {
  pending
  submitted
  accepted
  rejected
  expired
}

enum POStatus {
  approved_by_client
  purchase_order_created
  payment_pending
  payment_received
  supplier_confirmed
  in_transit
  delivered
  closed
  cancelled
}

enum PaymentStatus {
  pending
  processing
  completed
  failed
  refunded
}

enum MessageSource {
  whatsapp
  email
  web
  chat
  system
}

enum MessageDirection {
  inbound
  outbound
}

enum NotificationType {
  request_created
  info_needed
  suppliers_found
  rfq_sent
  quote_received
  quote_selected
  po_created
  status_update
  delivery_update
  system_alert
}

enum UserRole {
  admin_naova
  operator_naova
  client_enterprise
  supplier
}
```

---

## 🧩 MÓDULOS PRINCIPALES

### 1. Inbox Inteligente (Input Normalizer)

**Ubicación:** `lib/services/inbox/`

**Responsabilidades:**
- Recibir mensajes de múltiples fuentes
- Crear entidad `Request` automáticamente
- Extraer información básica (categoría, urgencia, cantidad, etc.)
- Detectar información faltante
- Clasificar estado inicial

**Servicios:**
- `InboxService` - Orquestador principal
- `WhatsAppProcessor` - Procesa mensajes de WhatsApp
- `EmailProcessor` - Procesa emails
- `FileProcessor` - Procesa PDFs e imágenes
- `ContentExtractor` - Extrae información del texto
- `ClassificationService` - Clasifica categoría y urgencia

**Endpoints:**
- `POST /api/inbox/webhook/whatsapp` - Webhook WhatsApp
- `POST /api/inbox/webhook/email` - Webhook Email
- `POST /api/inbox/ingest` - Ingestión manual

### 2. Motor de Especificaciones (Spec Engine)

**Ubicación:** `lib/services/specs/`

**Responsabilidades:**
- Completar especificaciones faltantes
- Estandarizar unidades
- Detectar inconsistencias
- Generar preguntas para el cliente
- Guardar `normalized_specs` JSON

**Servicios:**
- `SpecEngine` - Motor principal
- `SpecNormalizer` - Normaliza unidades y formatos
- `SpecValidator` - Valida completitud
- `SpecEnricher` - Enriquece con datos históricos
- `QuestionGenerator` - Genera preguntas inteligentes

**Endpoints:**
- `GET /api/requests/:id/specs` - Obtener specs
- `PUT /api/requests/:id/specs` - Actualizar specs
- `POST /api/requests/:id/specs/validate` - Validar specs

### 3. Motor de Matching de Proveedores

**Ubicación:** `lib/services/matching/`

**Responsabilidades:**
- Encontrar proveedores relevantes para cada request
- Calcular score de matching
- Ranking de proveedores

**Servicios:**
- `SupplierMatchingService` - Servicio principal
- `CategoryMatcher` - Matching por categoría
- `HistoryMatcher` - Matching por histórico
- `GeographyMatcher` - Matching por ubicación
- `ScoreCalculator` - Calcula score final

**Endpoints:**
- `GET /api/requests/:id/suppliers` - Obtener proveedores sugeridos
- `POST /api/requests/:id/suppliers/match` - Forzar matching

### 4. RFX Automático (RFI/RFQ Engine)

**Ubicación:** `lib/services/rfq/`

**Responsabilidades:**
- Generar contenido de RFQ automáticamente
- Enviar RFQs a proveedores
- Crear registros de cotizaciones pendientes
- Portal para proveedores

**Servicios:**
- `RFQEngine` - Motor principal
- `RFQGenerator` - Genera contenido
- `RFQSender` - Envía emails
- `QuoteReceiver` - Recibe cotizaciones

**Endpoints:**
- `POST /api/rfqs` - Crear RFQ
- `POST /api/rfqs/:id/send` - Enviar RFQ
- `GET /api/rfqs/:id` - Ver RFQ
- `POST /api/suppliers/quotes` - Proveedor envía cotización

### 5. Comparador de Cotizaciones

**Ubicación:** `lib/services/comparison/` y `components/comparison/`

**Responsabilidades:**
- Comparar múltiples cotizaciones
- Normalizar valores
- Calcular scores
- Visualización en tabla

**Servicios:**
- `QuoteComparator` - Compara cotizaciones
- `ValueNormalizer` - Normaliza valores
- `ScoreCalculator` - Calcula scores

**Componentes:**
- `QuoteComparisonTable` - Tabla de comparación
- `QuoteCard` - Tarjeta individual

**Endpoints:**
- `GET /api/rfqs/:id/quotes/compare` - Comparar cotizaciones

### 6. Order & Payment Tracking

**Ubicación:** `lib/services/purchase-orders/`

**Responsabilidades:**
- Crear Purchase Orders
- Rastrear estados
- Gestionar pagos
- Timeline de eventos

**Servicios:**
- `PurchaseOrderService` - Servicio principal
- `TrackingService` - Rastrea estados
- `PaymentService` - Gestiona pagos

**Endpoints:**
- `POST /api/purchase-orders` - Crear PO
- `GET /api/purchase-orders/:id` - Ver PO
- `PUT /api/purchase-orders/:id/status` - Actualizar estado
- `GET /api/purchase-orders/:id/timeline` - Timeline

### 7. Control Tower View (Pipeline Kanban)

**Ubicación:** `components/pipeline/` y `lib/services/pipeline/`

**Responsabilidades:**
- Vista Kanban del pipeline
- Mover items entre columnas
- Reglas automáticas de transición

**Servicios:**
- `PipelineService` - Gestiona pipeline
- `AutomationEngine` - Reglas automáticas

**Componentes:**
- `PipelineKanban` - Vista principal
- `PipelineColumn` - Columna
- `PipelineCard` - Tarjeta de request

**Endpoints:**
- `GET /api/pipeline` - Obtener pipeline
- `PUT /api/pipeline/:id/move` - Mover item

---

## 🔄 FLUJOS DE TRABAJO

### Flujo 1: Nueva Solicitud desde WhatsApp

```
1. Cliente envía mensaje WhatsApp
   ↓
2. Webhook recibe mensaje → InboxService
   ↓
3. Se crea Request con status=new_request
   ↓
4. ContentExtractor extrae información básica
   ↓
5. ClassificationService clasifica categoría/urgencia
   ↓
6. SpecEngine valida completitud
   ↓
7a. Si incompleto → status=incomplete_information
    → PipelineStage=needs_info
    → Se envía notificación pidiendo info
   ↓
7b. Si completo → status=ready_for_supplier_matching
    → PipelineStage=finding_suppliers
   ↓
8. SupplierMatchingService encuentra proveedores
   ↓
9. RFQEngine genera RFQ automáticamente
   ↓
10. RFQ se envía a proveedores
    → status=rfq_sent
    → PipelineStage=quotes_in_progress
```

### Flujo 2: Recepción de Cotizaciones

```
1. Proveedor envía cotización vía portal/email
   ↓
2. QuoteReceiver procesa cotización
   ↓
3. Se crea SupplierQuote
   ↓
4. Si hay >= 2 cotizaciones:
   → status=quotes_received
   → PipelineStage=selecting_quote
   → Se notifica al cliente
   ↓
5. Cliente compara cotizaciones
   ↓
6. Cliente selecciona cotización
   → status=quote_selected
   → PipelineStage=selecting_quote
   ↓
7. Se crea PurchaseOrder automáticamente
   → status=po_created
   → PipelineStage=purchase_in_progress
```

### Flujo 3: Tracking de Orden

```
1. PurchaseOrder creado
   → POStatus=approved_by_client
   ↓
2. Admin crea PO formal
   → POStatus=purchase_order_created
   ↓
3. Cliente realiza pago
   → PaymentStatus=processing
   ↓
4. Pago confirmado
   → PaymentStatus=completed
   → POStatus=payment_received
   ↓
5. Proveedor confirma orden
   → POStatus=supplier_confirmed
   ↓
6. Proveedor envía
   → POStatus=in_transit
   ↓
7. Entrega confirmada
   → POStatus=delivered
   → Request.status=delivered
   → PipelineStage=delivered
   ↓
8. Cliente cierra orden
   → POStatus=closed
   → Request.status=closed
   → PipelineStage=closed
```

---

## 📁 ESTRUCTURA DE CARPETAS

```
naova2.0/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── inbox/
│   │   ├── pipeline/
│   │   ├── requests/
│   │   │   └── [id]/
│   │   ├── rfqs/
│   │   │   └── [id]/
│   │   ├── quotes/
│   │   │   └── [id]/
│   │   ├── purchase-orders/
│   │   │   └── [id]/
│   │   ├── suppliers/
│   │   │   └── [id]/
│   │   └── reports/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── requests/
│   │   │   ├── suppliers/
│   │   │   ├── users/
│   │   │   └── settings/
│   │   └── suppliers/
│   │       └── portal/
│   ├── api/
│   │   ├── inbox/
│   │   │   ├── webhook/
│   │   │   │   ├── whatsapp/
│   │   │   │   └── email/
│   │   │   └── ingest/
│   │   ├── requests/
│   │   │   └── [id]/
│   │   │       ├── specs/
│   │   │       ├── suppliers/
│   │   │       └── route.ts
│   │   ├── rfqs/
│   │   │   └── [id]/
│   │   ├── quotes/
│   │   │   └── [id]/
│   │   ├── purchase-orders/
│   │   │   └── [id]/
│   │   ├── pipeline/
│   │   │   └── [id]/
│   │   ├── suppliers/
│   │   │   └── [id]/
│   │   └── notifications/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # Shadcn components
│   ├── inbox/
│   │   ├── InboxView.tsx
│   │   ├── RequestCard.tsx
│   │   └── MessageView.tsx
│   ├── pipeline/
│   │   ├── PipelineKanban.tsx
│   │   ├── PipelineColumn.tsx
│   │   └── PipelineCard.tsx
│   ├── requests/
│   │   ├── RequestDetail.tsx
│   │   ├── SpecEditor.tsx
│   │   └── RequestTimeline.tsx
│   ├── rfqs/
│   │   ├── RFQView.tsx
│   │   └── RFQForm.tsx
│   ├── quotes/
│   │   ├── QuoteComparison.tsx
│   │   ├── QuoteTable.tsx
│   │   └── QuoteCard.tsx
│   ├── purchase-orders/
│   │   ├── POTracking.tsx
│   │   ├── POTimeline.tsx
│   │   └── POStatusBadge.tsx
│   └── suppliers/
│       ├── SupplierCard.tsx
│       └── SupplierDetail.tsx
├── lib/
│   ├── services/
│   │   ├── inbox/
│   │   │   ├── InboxService.ts
│   │   │   ├── WhatsAppProcessor.ts
│   │   │   ├── EmailProcessor.ts
│   │   │   ├── FileProcessor.ts
│   │   │   ├── ContentExtractor.ts
│   │   │   └── ClassificationService.ts
│   │   ├── specs/
│   │   │   ├── SpecEngine.ts
│   │   │   ├── SpecNormalizer.ts
│   │   │   ├── SpecValidator.ts
│   │   │   ├── SpecEnricher.ts
│   │   │   └── QuestionGenerator.ts
│   │   ├── matching/
│   │   │   ├── SupplierMatchingService.ts
│   │   │   ├── CategoryMatcher.ts
│   │   │   ├── HistoryMatcher.ts
│   │   │   ├── GeographyMatcher.ts
│   │   │   └── ScoreCalculator.ts
│   │   ├── rfq/
│   │   │   ├── RFQEngine.ts
│   │   │   ├── RFQGenerator.ts
│   │   │   ├── RFQSender.ts
│   │   │   └── QuoteReceiver.ts
│   │   ├── comparison/
│   │   │   ├── QuoteComparator.ts
│   │   │   ├── ValueNormalizer.ts
│   │   │   └── ScoreCalculator.ts
│   │   ├── purchase-orders/
│   │   │   ├── PurchaseOrderService.ts
│   │   │   ├── TrackingService.ts
│   │   │   └── PaymentService.ts
│   │   ├── pipeline/
│   │   │   ├── PipelineService.ts
│   │   │   └── AutomationEngine.ts
│   │   └── notifications/
│   │       └── NotificationService.ts
│   ├── stores/
│   │   ├── requestStore.ts      # Zustand store
│   │   ├── pipelineStore.ts
│   │   └── notificationStore.ts
│   ├── hooks/
│   │   ├── useRequests.ts
│   │   ├── usePipeline.ts
│   │   └── useQuotes.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── constants.ts
│   └── types/
│       ├── request.ts
│       ├── rfq.ts
│       ├── quote.ts
│       └── po.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── workers/
│   ├── email-processor.ts
│   ├── whatsapp-processor.ts
│   └── notification-worker.ts
├── public/
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🚀 PLAN DE MIGRACIÓN

### Fase 1: Fundación (Semana 1-2)
1. ✅ Actualizar esquema Prisma con nuevos modelos
2. ✅ Crear migraciones de base de datos
3. ✅ Configurar estructura de carpetas
4. ✅ Instalar dependencias (Zustand, React Query, Shadcn)
5. ✅ Configurar BullMQ y Redis

### Fase 2: Módulos Core (Semana 3-4)
1. ✅ Implementar Inbox Inteligente
2. ✅ Implementar Spec Engine
3. ✅ Implementar Supplier Matching
4. ✅ Crear API endpoints base

### Fase 3: RFQ y Cotizaciones (Semana 5-6)
1. ✅ Implementar RFQ Engine
2. ✅ Crear Comparador de Cotizaciones
3. ✅ Portal de proveedores

### Fase 4: Tracking y Pipeline (Semana 7-8)
1. ✅ Implementar Purchase Order Tracking
2. ✅ Crear Control Tower (Kanban)
3. ✅ Implementar automatizaciones

### Fase 5: Integraciones (Semana 9-10)
1. ✅ Webhook WhatsApp
2. ✅ Webhook Email
3. ✅ Workers de background

### Fase 6: Testing y Refinamiento (Semana 11-12)
1. ✅ Tests unitarios
2. ✅ Tests E2E
3. ✅ Optimizaciones
4. ✅ Documentación

---

Este documento es la base para la transformación completa de Naova. ¿Quieres que comience a implementar alguna fase específica?

