# 🛒 Proceso de Compra en Naova 2.0

## 📋 Resumen Ejecutivo

Naova es una plataforma de compras industriales que automatiza y optimiza todo el proceso de adquisición, desde que un cliente necesita comprar algo hasta que recibe el producto y paga. El proceso está diseñado para ser **rápido, transparente y generar ahorros medibles**.

---

## 🔄 Flujo Completo del Proceso de Compra

### **FASE 1: INGESTIÓN - El Cliente Expresa su Necesidad**

#### 1.1 Múltiples Canales de Entrada
El cliente puede enviar su requerimiento de compra por **3 formas diferentes**:

**A) Plataforma Web (Manual)**
- Cliente inicia sesión en `/app/requirements`
- Crea un nuevo requerimiento
- Agrega productos manualmente o desde Excel
- Especifica: nombre, categoría, cantidad, unidad, presupuesto, especificaciones técnicas
- Envía el requerimiento

**B) Email**
- Cliente envía email a un correo configurado (ej: compras@naova.com)
- El sistema recibe el email vía webhook: `POST /api/inbox/webhook/email`
- **EmailProcessor** analiza el email automáticamente:
  - Extrae productos mencionados
  - Identifica categorías
  - Parsea cantidades y especificaciones
- Crea un **Request** automáticamente en el sistema

**C) WhatsApp**
- Cliente envía mensaje de WhatsApp
- El sistema recibe el mensaje vía webhook: `POST /api/inbox/webhook/whatsapp`
- **WhatsAppProcessor** analiza el mensaje:
  - Usa NLP para entender la intención
  - Extrae información de productos
  - Identifica urgencia
- Crea un **Request** automáticamente

#### 1.2 Creación del Request
- El sistema crea un registro de tipo **Request** con estado inicial
- Se asigna al cliente que lo envió
- Aparece en el **Pipeline Kanban** en la columna **"Inbox"** (nuevos requerimientos)

---

### **FASE 2: PROCESAMIENTO - Naova Organiza y Optimiza**

#### 2.1 Enriquecimiento de Especificaciones
- El **SpecEngine** analiza el request:
  - Identifica categorías de productos
  - Sugiere especificaciones técnicas faltantes
  - Normaliza nombres de productos
  - Valida información

- El **SpecEnricher** completa información:
  - Agrega especificaciones técnicas estándar
  - Sugiere unidades de medida
  - Estima presupuestos si no se proporcionaron

#### 2.2 Sugerencia de Proveedores
- El sistema ejecuta **SupplierMatchingService**:
  - **CategoryMatcher**: Busca proveedores por categoría de producto
  - **GeographyMatcher**: Filtra por ubicación geográfica
  - **HistoryMatcher**: Considera historial de compras previas
  - Genera lista de proveedores recomendados

- El admin/operador puede:
  - Ver sugerencias automáticas
  - Agregar o quitar proveedores manualmente
  - Ajustar la lista final

#### 2.3 Movimiento en Pipeline
- El request se mueve de **"Inbox"** → **"Processing"**
- El operador de Naova revisa y valida la información
- Se prepara para crear el RFQ (Request for Quotation)

---

### **FASE 3: RFQ (REQUEST FOR QUOTATION) - Solicitud de Cotizaciones**

#### 3.1 Generación Automática del RFQ
- El **RFQEngine** crea automáticamente un RFQ desde el request:
  - Toma todas las especificaciones del request
  - Calcula fecha límite (por defecto: 7 días)
  - Asigna proveedores seleccionados
  - Genera documento RFQ estructurado

#### 3.2 Envío a Proveedores
- El **RFQSender** envía el RFQ a todos los proveedores seleccionados:
  - Genera email personalizado para cada proveedor
  - Incluye link para responder
  - Envía por email (vía Nodemailer)
  - Opcionalmente puede enviar por WhatsApp

- El RFQ incluye:
  - Lista detallada de productos
  - Especificaciones técnicas
  - Cantidades requeridas
  - Fecha límite para responder
  - Instrucciones de cotización

#### 3.3 Estado en Pipeline
- El request se mueve a **"RFQ Sent"** (RFQ enviado)
- Se crea un registro de **Tender** (licitación) asociado

---

### **FASE 4: RECEPCIÓN DE COTIZACIONES**

#### 4.1 Proveedores Responden
- Los proveedores reciben el RFQ
- Pueden responder de 2 formas:

**A) Portal Web (si tienen acceso)**
- Proveedor inicia sesión
- Ve RFQs asignados
- Completa formulario de cotización
- Envía cotización

**B) Email/WhatsApp**
- Proveedor responde por email o WhatsApp
- El sistema recibe la respuesta vía webhook
- **QuoteReceiver** procesa la respuesta:
  - Extrae precios por producto
  - Identifica condiciones de pago
  - Parsea términos de entrega
  - Valida información

#### 4.2 Almacenamiento de Cotizaciones
- Cada cotización se guarda como **Quote** asociada al RFQ
- Se almacena:
  - Precio por producto
  - Precio total
  - Condiciones de pago
  - Tiempo de entrega
  - Términos y condiciones
  - Información del proveedor

#### 4.3 Estado en Pipeline
- Cuando se recibe la primera cotización, el request se mueve a **"Quotes Received"** (Cotizaciones recibidas)
- El sistema notifica al cliente que hay cotizaciones disponibles

---

### **FASE 5: COMPARACIÓN Y ANÁLISIS**

#### 5.1 Comparación Automática
- El cliente accede a la licitación en `/app/tenders`
- El sistema ejecuta **QuoteComparator**:
  - **ValueNormalizer**: Normaliza valores (precios, unidades, condiciones)
  - **ScoreCalculator**: Calcula scores para cada cotización:
    - Precio (40% del score)
    - Tiempo de entrega (20%)
    - Calificación del proveedor (20%)
    - Condiciones de pago (10%)
    - Historial previo (10%)
  - Genera ranking de proveedores

#### 5.2 Visualización de Comparación
- El cliente ve:
  - Tabla comparativa de todas las cotizaciones
  - Gráficos de precios
  - Scores calculados
  - Recomendación del sistema (mejor opción)
  - Información detallada de cada proveedor

#### 5.3 Estado en Pipeline
- El request se mueve a **"Comparison"** (En comparación)
- El cliente puede revisar todas las opciones

---

### **FASE 6: SELECCIÓN Y ORDEN DE COMPRA**

#### 6.1 Selección del Ganador
- El cliente revisa todas las cotizaciones
- Puede ver:
  - Precio total
  - Ahorro estimado vs. presupuesto
  - Calificación del proveedor
  - Tiempo de entrega
  - Condiciones de pago

- El cliente selecciona la cotización ganadora
- El sistema marca la cotización como **"accepted"**

#### 6.2 Creación Automática de Purchase Order (PO)
- El **PurchaseOrderService** crea automáticamente un PO:
  - Toma la cotización ganadora
  - Genera número de orden único
  - Establece términos y condiciones
  - Calcula fechas de entrega esperadas
  - Crea timeline inicial

#### 6.3 Notificaciones
- Se notifica al proveedor ganador
- Se notifica al cliente que la orden fue creada
- Se notifica a proveedores no seleccionados (opcional)

#### 6.4 Estado en Pipeline
- El request se mueve a **"PO Created"** (PO creado)
- El cliente puede ver el PO en `/app/purchase-orders` (si está implementado)

---

### **FASE 7: SEGUIMIENTO Y ENTREGA**

#### 7.1 Tracking del Purchase Order
- El **TrackingService** gestiona el seguimiento:
  - Estados posibles:
    - `pending` - Pendiente de confirmación
    - `confirmed` - Confirmado por proveedor
    - `in_production` - En producción/fabricación
    - `in_transit` - En tránsito
    - `delivered` - Entregado
    - `completed` - Completado (pago realizado)

#### 7.2 Timeline de Eventos
- Cada cambio de estado se registra en el timeline:
  - Fecha y hora
  - Estado anterior → nuevo estado
  - Usuario que hizo el cambio
  - Notas/comentarios
  - Evidencias (fotos, documentos)

#### 7.3 Actualizaciones Automáticas
- El proveedor puede actualizar el estado
- El sistema puede recibir actualizaciones vía:
  - Email del proveedor
  - WhatsApp
  - Portal web del proveedor
  - Integración con sistemas de tracking

#### 7.4 Notificaciones al Cliente
- El cliente recibe notificaciones en cada cambio:
  - "Tu orden ha sido confirmada"
  - "Tu orden está en producción"
  - "Tu orden está en camino"
  - "Tu orden ha sido entregada"

---

### **FASE 8: PAGO Y CIERRE**

#### 8.1 Gestión de Pagos
- El **PaymentService** gestiona los pagos:
  - Registra pagos realizados
  - Calcula saldos pendientes
  - Genera facturas
  - Valida pagos completos

#### 8.2 Estados de Pago
- `pending` - Pendiente de pago
- `partial` - Pago parcial
- `paid` - Pagado completamente
- `overdue` - Vencido

#### 8.3 Cierre de la Orden
- Cuando:
  - El producto fue entregado (`delivered`)
  - El pago fue completado (`paid`)
- El PO cambia a estado `completed`
- El request se mueve a **"Completed"** (Completado)

#### 8.4 Registro Final
- Se actualiza el historial de compras
- Se calculan métricas finales:
  - Ahorro real vs. presupuesto inicial
  - Tiempo total del proceso
  - Calificación del proveedor
- Se actualizan reportes y analytics

---

## 🎯 Pipeline Kanban - Vista Visual del Proceso

El sistema tiene un **Pipeline Kanban** que muestra visualmente dónde está cada requerimiento:

```
┌─────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────────┐
│  INBOX  │ →  │  PROCESSING  │ →  │ RFQ SENT │ →  │QUOTES RECEIVED│
│ (Nuevos)│    │(Procesando)  │    │(RFQ Env.)│    │(Cotiz. Recib.)│
└─────────┘    └──────────────┘    └──────────┘    └──────────────┘
                                                           ↓
┌──────────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐
│  COMPLETED   │ ←  │PO CREATED│ ←  │COMPARISON│ ← │              │
│ (Completado) │    │(PO Creado)│   │(Comparando)│  │              │
└──────────────┘    └──────────┘    └──────────┘    └──────────────┘
```

---

## 🤖 Automatizaciones del Sistema

### Automatizaciones Implementadas:

1. **Auto-creación de RFQ**
   - Cuando un request tiene especificaciones completas
   - Y tiene proveedores asignados
   - Se crea RFQ automáticamente

2. **Auto-envío de RFQ**
   - Cuando se crea un RFQ
   - Se envían emails automáticamente a proveedores

3. **Auto-creación de PO**
   - Cuando se selecciona una cotización ganadora
   - Se crea PO automáticamente

4. **Auto-notificaciones**
   - En cada cambio de estado
   - Al cliente y al proveedor

5. **Auto-cálculo de scores**
   - Al recibir cotizaciones
   - Se calculan scores automáticamente

---

## 📊 Reportes y Analytics

Durante todo el proceso, el sistema genera datos para reportes:

### Métricas en Tiempo Real:
- **Ahorros Totales**: Diferencia entre presupuesto y precio final
- **Tiempo Promedio**: Desde request hasta entrega
- **Tasa de Conversión**: % de requests que se convierten en POs
- **Proveedores Activos**: Número de proveedores que participan

### Reportes Disponibles:
1. **Compras por Cliente**: Historial completo de compras
2. **Compras por Proveedor**: Análisis de proveedores
3. **Precios Históricos**: Evolución de precios
4. **Resumen Global**: Vista general del sistema

---

## 🔍 Insights y Predicciones

El sistema también proporciona inteligencia:

### Predicciones:
- **Precios Futuros**: Predice cómo cambiarán los precios
- **Demanda**: Predice demanda futura por categoría
- **Tendencias de Mercado**: Análisis de tendencias

### Recomendaciones:
- **Cuándo Comprar**: Mejor momento para hacer compras
- **Qué Proveedor Elegir**: Recomendaciones basadas en historial
- **Estrategias de Ahorro**: Cómo optimizar compras

---

## ⏱️ Tiempos Típicos del Proceso

| Fase | Tiempo Típico | Descripción |
|------|---------------|-------------|
| **Ingestión** | 5-15 min | Cliente envía requerimiento |
| **Procesamiento** | 1-4 horas | Naova organiza y optimiza |
| **RFQ Enviado** | 1 hora | Generación y envío |
| **Espera Cotizaciones** | 24-72 horas | Proveedores responden |
| **Comparación** | 1-2 horas | Cliente revisa y compara |
| **Selección** | 30 min | Cliente elige ganador |
| **PO Creado** | 15 min | Generación de orden |
| **Entrega** | 7-30 días | Depende del producto |
| **Pago** | 15-30 días | Términos de pago |
| **TOTAL** | **10-40 días** | Proceso completo |

---

## 💡 Ventajas del Proceso Naova

1. **Automatización**: Reduce trabajo manual en 70%
2. **Transparencia**: Cliente ve todo el proceso en tiempo real
3. **Competencia**: Múltiples proveedores compiten → mejores precios
4. **Ahorros Medibles**: Sistema calcula ahorros automáticamente
5. **Trazabilidad**: Todo queda registrado y auditado
6. **Velocidad**: Proceso más rápido que métodos tradicionales
7. **Inteligencia**: Predicciones y recomendaciones basadas en datos

---

## 🎬 Ejemplo Práctico

### Escenario: Cliente necesita comprar tornillos

1. **Lunes 9:00 AM** - Cliente envía WhatsApp: "Necesito 1000 tornillos M8 para el viernes"
2. **Lunes 9:15 AM** - Sistema procesa mensaje, crea Request, aparece en Inbox
3. **Lunes 10:00 AM** - Operador Naova revisa, enriquece specs, selecciona 3 proveedores
4. **Lunes 11:00 AM** - Sistema genera RFQ y envía a 3 proveedores
5. **Martes 2:00 PM** - Proveedor A responde: $2,500, entrega 3 días
6. **Martes 4:00 PM** - Proveedor B responde: $2,200, entrega 2 días
7. **Martes 5:00 PM** - Proveedor C responde: $2,400, entrega 4 días
8. **Martes 6:00 PM** - Cliente ve comparación, sistema recomienda Proveedor B (mejor score)
9. **Martes 6:30 PM** - Cliente selecciona Proveedor B, se crea PO automáticamente
10. **Miércoles 8:00 AM** - Proveedor B confirma orden
11. **Jueves 10:00 AM** - Proveedor B actualiza: "En producción"
12. **Viernes 2:00 PM** - Proveedor B actualiza: "En camino"
13. **Viernes 4:00 PM** - Proveedor B actualiza: "Entregado"
14. **Viernes 5:00 PM** - Cliente confirma recepción
15. **Lunes siguiente** - Se registra pago, proceso completado

**Resultado**: Cliente recibió producto en tiempo, ahorró $300 vs. presupuesto, todo automatizado.

---

## 🔗 Integraciones y APIs

### APIs Principales del Proceso:

- `POST /api/inbox/ingest` - Ingestión manual
- `POST /api/inbox/webhook/email` - Webhook email
- `POST /api/inbox/webhook/whatsapp` - Webhook WhatsApp
- `GET /api/pipeline` - Ver pipeline Kanban
- `POST /api/pipeline/[id]/move` - Mover en pipeline
- `POST /api/rfqs` - Crear RFQ
- `POST /api/rfqs/[id]/send` - Enviar RFQ
- `POST /api/suppliers/quotes` - Recibir cotización
- `GET /api/rfqs/[id]/quotes/compare` - Comparar cotizaciones
- `POST /api/purchase-orders` - Crear PO
- `GET /api/purchase-orders/[id]/timeline` - Ver timeline
- `POST /api/purchase-orders/[id]` - Actualizar PO

---

## 📱 Interfaces de Usuario

### Para el Cliente:
- **Dashboard**: Vista general de métricas y acciones rápidas
- **Requerimientos**: Crear y gestionar requerimientos
- **Licitaciones**: Ver RFQs y cotizaciones
- **Purchase Orders**: Ver órdenes y su estado
- **Pipeline**: Vista Kanban del proceso
- **Reportes**: Análisis de compras

### Para el Admin/Operador:
- **Dashboard Admin**: Métricas globales
- **Pipeline**: Gestionar todos los requests
- **Licitaciones**: Ver y gestionar todas las licitaciones
- **Clientes**: Gestionar clientes
- **Proveedores**: Gestionar proveedores
- **Reportes**: Reportes globales

---

## 🎯 Puntos Clave del Proceso

1. **Multi-canal**: Cliente puede enviar requerimientos por web, email o WhatsApp
2. **Automatización**: La mayoría del proceso es automático
3. **Transparencia**: Cliente ve todo en tiempo real
4. **Competencia**: Múltiples proveedores compiten
5. **Inteligencia**: Sistema sugiere mejores opciones
6. **Trazabilidad**: Todo queda registrado
7. **Ahorros Medibles**: Sistema calcula ahorros automáticamente

---

**Este es el proceso completo de compra en Naova 2.0. ¿Tienes alguna pregunta específica sobre alguna fase?**

