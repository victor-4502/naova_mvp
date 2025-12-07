# 🔄 Flujo Completo del Proceso Naova

## 📋 Resumen del Proceso

Este documento describe el flujo completo desde que un cliente envía una solicitud hasta que recibe el producto.

## 🎯 Etapas del Proceso

### 1. **Nueva Solicitud** (`new_request`)
**Estado:** `new_request`  
**Descripción:** El cliente envía una solicitud inicial por WhatsApp, email, o plataforma.

**Acciones disponibles:**
- ✅ Responder mensaje al cliente
- ✅ Solicitar información faltante (si aplica)

**Siguiente paso:** Si falta información → Etapa 2. Si está completa → Etapa 3.

---

### 2. **Obteniendo Información** (`needs_info`)
**Estado:** `incomplete_information`  
**Descripción:** Naova se comunica con el cliente (vía IA o manualmente) para obtener todos los detalles necesarios.

**Acciones disponibles:**
- ✅ Enviar mensaje al cliente solicitando información faltante
- ✅ Usar IA para generar mensajes automáticos
- ✅ Marcar como completo cuando se tenga toda la información

**Siguiente paso:** Cuando la información esté completa → Etapa 3.

---

### 3. **Buscando Proveedores** (`finding_suppliers`)
**Estado:** `ready_for_supplier_matching` o `supplier_matching`  
**Descripción:** Naova busca en su base de datos de proveedores para identificar los mejores candidatos.

**Criterios de búsqueda:**
- Categoría del producto/servicio
- Historial de compras del cliente
- Ubicación geográfica
- Score del proveedor (precio, calidad, entrega, etc.)

**Acciones disponibles:**
- ✅ Buscar proveedores automáticamente
- ✅ Ver lista de proveedores encontrados
- ✅ Filtrar y seleccionar proveedores
- ✅ Crear RFQ (Request for Quotation)

**Siguiente paso:** Una vez seleccionados los proveedores → Etapa 4.

---

### 4. **Solicitando Cotizaciones** (`quotes_in_progress`)
**Estado:** `rfq_sent` o `quotes_received`  
**Descripción:** Naova crea un RFQ y lo envía por email a los proveedores seleccionados.

**Proceso:**
1. Crear RFQ con todos los detalles del request
2. Seleccionar proveedores a contactar
3. Enviar emails automáticos a proveedores
4. Esperar respuestas (cotizaciones)

**Acciones disponibles:**
- ✅ Crear RFQ
- ✅ Enviar RFQ a proveedores
- ✅ Ver estado de RFQ enviado
- ✅ Ver cotizaciones recibidas

**Siguiente paso:** Cuando se reciban cotizaciones → Etapa 5.

---

### 5. **Cliente Eligiendo** (`selecting_quote`)
**Estado:** `selecting_quote`  
**Descripción:** Naova muestra las cotizaciones recibidas al cliente para que elija la mejor opción.

**Información mostrada al cliente:**
- Precio total
- Tiempo de entrega
- Términos de pago
- Garantía
- Disponibilidad
- Score del proveedor

**Acciones disponibles:**
- ✅ Comparar cotizaciones
- ✅ Enviar cotizaciones al cliente
- ✅ Ver detalles de cada cotización
- ✅ Esperar selección del cliente

**Siguiente paso:** Cuando el cliente elija una cotización → Etapa 6.

---

### 6. **Orden de Compra** (`purchase_in_progress`)
**Estado:** `quote_selected`, `po_created`, o `in_progress`  
**Descripción:** Naova crea la orden de compra (PO) con el proveedor seleccionado.

**Proceso:**
1. Cliente selecciona cotización
2. Naova crea Purchase Order (PO)
3. Envía PO al proveedor
4. Confirma recepción del proveedor
5. Procesa pago (si aplica)
6. Rastrea envío

**Acciones disponibles:**
- ✅ Crear orden de compra
- ✅ Rastrear orden
- ✅ Ver estado de pago
- ✅ Ver estado de envío

**Siguiente paso:** Cuando el producto sea entregado → Etapa 7.

---

### 7. **Entregado** (`delivered`)
**Estado:** `delivered`  
**Descripción:** El producto ha sido entregado al cliente.

**Acciones disponibles:**
- ✅ Confirmar recepción
- ✅ Cerrar request

**Siguiente paso:** Cerrar el request → Etapa 8.

---

### 8. **Cerrado** (`closed`)
**Estado:** `closed`  
**Descripción:** El proceso está completamente finalizado.

**Acciones disponibles:**
- ✅ Ver historial completo
- ✅ Archivar

---

## 🎨 Interfaz Visual

### Pipeline Visual
En la página de detalle de cada request, verás:
- **Barra de progreso** que muestra en qué etapa estás
- **Etapas completadas** marcadas con ✓
- **Etapa actual** resaltada
- **Etapas pendientes** en gris

### Acciones Rápidas
En el panel lateral derecho verás botones con las acciones disponibles según la etapa actual:
- Color azul: Acciones de comunicación
- Color morado: Acciones de búsqueda/selección
- Color verde: Acciones de confirmación/envío
- Color gris: Acciones de visualización

## 🔄 Estados de Conversación

El sistema también muestra un badge de "Estado de Conversación" que indica quién debe actuar:

- **Esperando Naova** (amarillo): Cliente envió mensaje, no hemos respondido
- **Falta información - Cliente** (naranja): Necesitamos más información
- **Buscando proveedores** (índigo): Identificando proveedores
- **Solicitando cotizaciones** (morado): Enviando RFQ y esperando respuestas
- **Cliente eligiendo** (cyan): Mostrando cotizaciones al cliente
- **Orden de compra** (verde): Procesando orden de compra

## 📊 Métricas y Seguimiento

Cada etapa registra:
- Fecha/hora de inicio
- Fecha/hora de finalización
- Usuario que realizó la acción
- Notas/comentarios

## 🚀 Automatización

El sistema puede automatizar:
- ✅ Generación de mensajes para solicitar información
- ✅ Búsqueda de proveedores
- ✅ Creación de RFQ
- ✅ Envío de emails a proveedores
- ✅ Comparación de cotizaciones
- ✅ Creación de PO

## 📝 Notas Importantes

1. **No te pierdas:** El pipeline visual siempre muestra dónde estás
2. **Acciones claras:** Los botones te indican qué puedes hacer en cada momento
3. **Estado de conversación:** El badge te dice quién debe actuar
4. **Previsualización:** En la lista de requests puedes ver el contexto sin abrir cada uno

