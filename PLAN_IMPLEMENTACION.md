# 🚀 PLAN DE IMPLEMENTACIÓN - NAOVA PROCUREMENT OS

## 📋 RESUMEN EJECUTIVO

Este documento detalla el plan paso a paso para transformar Naova de una plataforma simple de licitaciones a un **Procurement Operating System** completo.

**Tiempo estimado:** 12 semanas
**Enfoque:** Migración gradual con compatibilidad hacia atrás

---

## 🎯 FASES DE IMPLEMENTACIÓN

### **FASE 1: FUNDACIÓN (Semana 1-2)**

#### Objetivos
- Preparar la base de datos y estructura
- Configurar herramientas y dependencias
- Crear estructura de carpetas

#### Tareas

**1.1 Base de Datos**
- [ ] Revisar y aprobar `schema-pos.prisma`
- [ ] Crear migración inicial: `prisma migrate dev --name init_pos_schema`
- [ ] Verificar que los modelos legacy siguen funcionando
- [ ] Crear script de migración de datos (si es necesario)

**1.2 Dependencias**
```bash
npm install zustand @tanstack/react-query
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install date-fns
npm install zod
npm install @hookform/resolvers
npm install react-hook-form
```

**1.3 Estructura de Carpetas**
- [ ] Crear `lib/services/` con subcarpetas por módulo
- [ ] Crear `lib/stores/` para Zustand stores
- [ ] Crear `lib/hooks/` para custom hooks
- [ ] Crear `lib/types/` para TypeScript types
- [ ] Crear `components/ui/` para Shadcn components
- [ ] Crear `components/pipeline/`, `components/inbox/`, etc.

**1.4 Configuración**
- [ ] Configurar Shadcn/UI: `npx shadcn-ui@latest init`
- [ ] Configurar React Query provider
- [ ] Crear archivo de constantes (`lib/utils/constants.ts`)
- [ ] Configurar variables de entorno adicionales

**Entregables:**
- ✅ Base de datos actualizada
- ✅ Estructura de carpetas creada
- ✅ Dependencias instaladas
- ✅ Configuración base lista

---

### **FASE 2: MÓDULOS CORE (Semana 3-4)**

#### 2.1 Inbox Inteligente

**Servicios a crear:**
- [ ] `lib/services/inbox/InboxService.ts` - Orquestador principal
- [ ] `lib/services/inbox/ContentExtractor.ts` - Extrae info del texto
- [ ] `lib/services/inbox/ClassificationService.ts` - Clasifica categoría/urgencia
- [ ] `lib/services/inbox/WhatsAppProcessor.ts` - Procesa WhatsApp (stub)
- [ ] `lib/services/inbox/EmailProcessor.ts` - Procesa Email (stub)
- [ ] `lib/services/inbox/FileProcessor.ts` - Procesa PDFs/imágenes (stub)

**API Endpoints:**
- [ ] `app/api/inbox/ingest/route.ts` - Ingestión manual
- [ ] `app/api/inbox/webhook/whatsapp/route.ts` - Webhook WhatsApp (stub)
- [ ] `app/api/inbox/webhook/email/route.ts` - Webhook Email (stub)

**Componentes:**
- [ ] `components/inbox/InboxView.tsx` - Vista principal
- [ ] `components/inbox/RequestCard.tsx` - Tarjeta de request
- [ ] `components/inbox/MessageView.tsx` - Vista de mensaje

**Store:**
- [ ] `lib/stores/requestStore.ts` - Zustand store para requests

**Tests:**
- [ ] Tests unitarios para `ContentExtractor`
- [ ] Tests unitarios para `ClassificationService`

---

#### 2.2 Motor de Especificaciones

**Servicios:**
- [ ] `lib/services/specs/SpecEngine.ts` - Motor principal
- [ ] `lib/services/specs/SpecNormalizer.ts` - Normaliza unidades
- [ ] `lib/services/specs/SpecValidator.ts` - Valida completitud
- [ ] `lib/services/specs/SpecEnricher.ts` - Enriquece con histórico
- [ ] `lib/services/specs/QuestionGenerator.ts` - Genera preguntas

**API Endpoints:**
- [ ] `app/api/requests/[id]/specs/route.ts` - CRUD de specs
- [ ] `app/api/requests/[id]/specs/validate/route.ts` - Validar specs

**Componentes:**
- [ ] `components/requests/SpecEditor.tsx` - Editor de specs
- [ ] `components/requests/SpecItemForm.tsx` - Formulario de item

**Tests:**
- [ ] Tests para normalización de unidades
- [ ] Tests para validación de completitud

---

#### 2.3 Motor de Matching de Proveedores

**Servicios:**
- [ ] `lib/services/matching/SupplierMatchingService.ts` - Servicio principal
- [ ] `lib/services/matching/CategoryMatcher.ts` - Matching por categoría
- [ ] `lib/services/matching/HistoryMatcher.ts` - Matching por histórico
- [ ] `lib/services/matching/GeographyMatcher.ts` - Matching por ubicación
- [ ] `lib/services/matching/ScoreCalculator.ts` - Calcula score

**API Endpoints:**
- [ ] `app/api/requests/[id]/suppliers/route.ts` - Obtener proveedores sugeridos
- [ ] `app/api/requests/[id]/suppliers/match/route.ts` - Forzar matching

**Componentes:**
- [ ] `components/suppliers/SupplierCard.tsx` - Tarjeta de proveedor
- [ ] `components/suppliers/SupplierList.tsx` - Lista de proveedores

**Tests:**
- [ ] Tests para cálculo de scores
- [ ] Tests para matching por categoría

---

### **FASE 3: RFQ Y COTIZACIONES (Semana 5-6)**

#### 3.1 RFQ Engine

**Servicios:**
- [ ] `lib/services/rfq/RFQEngine.ts` - Motor principal
- [ ] `lib/services/rfq/RFQGenerator.ts` - Genera contenido
- [ ] `lib/services/rfq/RFQSender.ts` - Envía emails
- [ ] `lib/services/rfq/QuoteReceiver.ts` - Recibe cotizaciones

**API Endpoints:**
- [ ] `app/api/rfqs/route.ts` - CRUD de RFQs
- [ ] `app/api/rfqs/[id]/send/route.ts` - Enviar RFQ
- [ ] `app/api/suppliers/quotes/route.ts` - Proveedor envía cotización

**Componentes:**
- [ ] `components/rfqs/RFQView.tsx` - Vista de RFQ
- [ ] `components/rfqs/RFQForm.tsx` - Formulario de RFQ
- [ ] `components/rfqs/RFQItemList.tsx` - Lista de items

**Tests:**
- [ ] Tests para generación de RFQ
- [ ] Tests para envío de emails

---

#### 3.2 Comparador de Cotizaciones

**Servicios:**
- [ ] `lib/services/comparison/QuoteComparator.ts` - Compara cotizaciones
- [ ] `lib/services/comparison/ValueNormalizer.ts` - Normaliza valores
- [ ] `lib/services/comparison/ScoreCalculator.ts` - Calcula scores

**API Endpoints:**
- [ ] `app/api/rfqs/[id]/quotes/compare/route.ts` - Comparar cotizaciones

**Componentes:**
- [ ] `components/quotes/QuoteComparison.tsx` - Vista principal
- [ ] `components/quotes/QuoteTable.tsx` - Tabla de comparación
- [ ] `components/quotes/QuoteCard.tsx` - Tarjeta individual

**Tests:**
- [ ] Tests para normalización de valores
- [ ] Tests para cálculo de scores

---

### **FASE 4: TRACKING Y PIPELINE (Semana 7-8)**

#### 4.1 Purchase Order Tracking

**Servicios:**
- [ ] `lib/services/purchase-orders/PurchaseOrderService.ts` - Servicio principal
- [ ] `lib/services/purchase-orders/TrackingService.ts` - Rastrea estados
- [ ] `lib/services/purchase-orders/PaymentService.ts` - Gestiona pagos

**API Endpoints:**
- [ ] `app/api/purchase-orders/route.ts` - CRUD de POs
- [ ] `app/api/purchase-orders/[id]/status/route.ts` - Actualizar estado
- [ ] `app/api/purchase-orders/[id]/timeline/route.ts` - Timeline

**Componentes:**
- [ ] `components/purchase-orders/POTracking.tsx` - Vista principal
- [ ] `components/purchase-orders/POTimeline.tsx` - Timeline visual
- [ ] `components/purchase-orders/POStatusBadge.tsx` - Badge de estado

**Tests:**
- [ ] Tests para transiciones de estado
- [ ] Tests para timeline

---

#### 4.2 Control Tower (Pipeline Kanban)

**Servicios:**
- [ ] `lib/services/pipeline/PipelineService.ts` - Gestiona pipeline
- [ ] `lib/services/pipeline/AutomationEngine.ts` - Reglas automáticas

**API Endpoints:**
- [ ] `app/api/pipeline/route.ts` - Obtener pipeline
- [ ] `app/api/pipeline/[id]/move/route.ts` - Mover item

**Componentes:**
- [ ] `components/pipeline/PipelineKanban.tsx` - Vista principal
- [ ] `components/pipeline/PipelineColumn.tsx` - Columna
- [ ] `components/pipeline/PipelineCard.tsx` - Tarjeta de request

**Store:**
- [ ] `lib/stores/pipelineStore.ts` - Zustand store para pipeline

**Tests:**
- [ ] Tests para reglas de automatización
- [ ] Tests E2E para flujo completo

---

### **FASE 5: INTEGRACIONES (Semana 9-10)**

#### 5.1 Webhooks

**Implementar:**
- [ ] Webhook WhatsApp (integración con API de WhatsApp Business)
- [ ] Webhook Email (integración con servicio de email)
- [ ] Procesadores de background jobs (BullMQ)

**Workers:**
- [ ] `workers/whatsapp-processor.ts` - Procesa mensajes WhatsApp
- [ ] `workers/email-processor.ts` - Procesa emails
- [ ] `workers/notification-worker.ts` - Envía notificaciones

**Configuración:**
- [ ] Configurar Redis para BullMQ
- [ ] Configurar colas de trabajo
- [ ] Configurar webhooks en servicios externos

---

#### 5.2 Portal de Proveedores

**Páginas:**
- [ ] `app/suppliers/portal/login/page.tsx` - Login proveedores
- [ ] `app/suppliers/portal/dashboard/page.tsx` - Dashboard
- [ ] `app/suppliers/portal/rfqs/[id]/page.tsx` - Ver RFQ
- [ ] `app/suppliers/portal/quotes/new/page.tsx` - Crear cotización

**API:**
- [ ] `app/api/suppliers/auth/login/route.ts` - Login
- [ ] `app/api/suppliers/rfqs/route.ts` - Listar RFQs
- [ ] `app/api/suppliers/quotes/route.ts` - Enviar cotización

---

### **FASE 6: TESTING Y REFINAMIENTO (Semana 11-12)**

#### 6.1 Testing

**Unit Tests:**
- [ ] Tests para todos los servicios críticos
- [ ] Tests para validaciones
- [ ] Tests para cálculos de scores

**Integration Tests:**
- [ ] Tests para flujos completos
- [ ] Tests para API endpoints
- [ ] Tests para automatizaciones

**E2E Tests:**
- [ ] Flujo completo: Request → RFQ → Quote → PO
- [ ] Flujo de inbox inteligente
- [ ] Flujo de pipeline

---

#### 6.2 Optimizaciones

- [ ] Optimizar queries de base de datos
- [ ] Implementar caché donde sea necesario
- [ ] Optimizar renders de componentes
- [ ] Optimizar bundle size

---

#### 6.3 Documentación

- [ ] Documentar APIs
- [ ] Documentar servicios
- [ ] Crear guías de usuario
- [ ] Crear guías de desarrollo

---

## 🔄 ESTRATEGIA DE MIGRACIÓN

### Compatibilidad hacia atrás

1. **Modelos Legacy:** Mantener modelos antiguos (`Requirement`, `Tender`, `Offer`) durante la transición
2. **APIs Legacy:** Mantener endpoints antiguos funcionando
3. **Migración Gradual:** Migrar funcionalidades una por una
4. **Datos:** Script de migración para mover datos antiguos a nuevos modelos

### Orden de Migración

1. **Primero:** Inbox y Requests (nuevo sistema)
2. **Segundo:** RFQs y Quotes (nuevo sistema)
3. **Tercero:** Purchase Orders (nuevo sistema)
4. **Cuarto:** Migrar datos antiguos
5. **Quinto:** Deprecar modelos legacy

---

## 📊 MÉTRICAS DE ÉXITO

- ✅ Todos los módulos implementados
- ✅ Tests con >80% coverage
- ✅ Performance: <2s carga de páginas principales
- ✅ Zero breaking changes en APIs legacy durante migración
- ✅ Documentación completa

---

## 🚨 RIESGOS Y MITIGACIONES

| Riesgo | Mitigación |
|--------|-----------|
| Complejidad del esquema | Migración gradual, tests exhaustivos |
| Performance de queries | Indexes apropiados, optimización temprana |
| Integraciones externas | Stubs primero, implementación real después |
| Breaking changes | Mantener compatibilidad hacia atrás |

---

## 📝 NOTAS IMPORTANTES

1. **No romper funcionalidad existente:** Mantener todo funcionando durante la migración
2. **Tests primero:** Escribir tests antes de implementar funcionalidad compleja
3. **Documentación continua:** Documentar mientras se desarrolla
4. **Code reviews:** Revisar código en cada fase
5. **Deploy incremental:** Deployar funcionalidades una por una

---

¿Quieres que comience con alguna fase específica?

