# 🧪 Guía Completa de Pruebas - Naova 2.0

Esta guía te ayudará a probar todas las funcionalidades de la plataforma de extremo a extremo.

## 📋 Índice de Pruebas

1. [Autenticación y Acceso](#1-autenticación-y-acceso)
2. [Dashboard de Cliente](#2-dashboard-de-cliente)
3. [Requerimientos y Licitaciones](#3-requerimientos-y-licitaciones)
4. [RFQ Engine](#4-rfq-engine)
5. [Comparación de Cotizaciones](#5-comparación-de-cotizaciones)
6. [Purchase Orders](#6-purchase-orders)
7. [Pipeline Kanban](#7-pipeline-kanban)
8. [Reportes y Analytics](#8-reportes-y-analytics)
9. [Admin Panel](#9-admin-panel)
10. [Inbox e Ingestión](#10-inbox-e-ingestión)
11. [Insights y Predicciones](#11-insights-y-predicciones)

---

## 1. Autenticación y Acceso

### 1.1 Login
- [ ] **URL:** `https://tu-dominio.vercel.app/login`
- [ ] Ingresar con credenciales de cliente
- [ ] Verificar redirección a `/app/dashboard`
- [ ] Ingresar con credenciales de admin
- [ ] Verificar redirección a `/admin/dashboard`
- [ ] Probar login con credenciales incorrectas
- [ ] Verificar mensaje de error

### 1.2 Logout
- [ ] Hacer clic en logout
- [ ] Verificar redirección a `/login`
- [ ] Verificar que no se puede acceder a rutas protegidas sin login

### 1.3 Rutas Protegidas
- [ ] Intentar acceder a `/app/dashboard` sin login → debe redirigir a `/login`
- [ ] Intentar acceder a `/admin/dashboard` sin login → debe redirigir a `/login`

---

## 2. Dashboard de Cliente

### 2.1 Dashboard Principal
- [ ] **URL:** `https://tu-dominio.vercel.app/app/dashboard`
- [ ] Verificar que se muestran las métricas:
  - Ahorros Totales
  - Número de Compras
  - Proveedores Activos
  - Tendencia de Crecimiento
- [ ] Verificar que las tarjetas de acciones rápidas funcionan:
  - [ ] "Crear Requerimiento" → `/app/requirements`
  - [ ] "Ver Licitaciones" → `/app/tenders`
  - [ ] "Ver Reportes" → `/app/reports`

### 2.2 Navegación
- [ ] Verificar que el menú lateral funciona
- [ ] Probar navegación entre secciones

---

## 3. Requerimientos y Licitaciones

### 3.1 Crear Requerimiento
- [ ] **URL:** `https://tu-dominio.vercel.app/app/requirements`
- [ ] Hacer clic en "Nuevo Requerimiento"
- [ ] Llenar formulario:
  - [ ] Título
  - [ ] Categoría
  - [ ] Descripción
  - [ ] Cantidad
  - [ ] Unidad
  - [ ] Presupuesto estimado
- [ ] Agregar múltiples productos
- [ ] Probar carga desde Excel (si está disponible)
- [ ] Enviar requerimiento
- [ ] Verificar que aparece en la lista con estado `ACTIVE`

### 3.2 Ver Requerimientos
- [ ] Ver lista de requerimientos
- [ ] Filtrar por estado (ACTIVE, CLOSED, SUBMITTED)
- [ ] Ver detalles de un requerimiento
- [ ] Editar requerimiento existente
- [ ] Eliminar requerimiento

### 3.3 Licitaciones
- [ ] **URL:** `https://tu-dominio.vercel.app/app/tenders`
- [ ] Ver lista de licitaciones
- [ ] Filtrar por estado:
  - [ ] `all` - Todas
  - [ ] `processing` - En proceso
  - [ ] `active` - Activas
  - [ ] `closed` - Cerradas
- [ ] Abrir detalles de una licitación
- [ ] Ver productos solicitados
- [ ] Ver ofertas recibidas
- [ ] Ver comparación de precios
- [ ] Ver calificaciones de proveedores
- [ ] Seleccionar oferta ganadora
- [ ] Ver información de proveedores (nombre, email, teléfono, calificación)

---

## 4. RFQ Engine

### 4.1 Crear RFQ
- [ ] Desde un requerimiento, crear RFQ
- [ ] Verificar que se genera automáticamente
- [ ] Verificar que se envían emails a proveedores (si está configurado)

### 4.2 Enviar RFQ
- [ ] **API:** `POST /api/rfqs/[id]/send`
- [ ] Verificar que se envía a proveedores seleccionados
- [ ] Verificar estado de RFQ cambia a `sent`

### 4.3 Recibir Cotizaciones
- [ ] **API:** `POST /api/suppliers/quotes`
- [ ] Simular recepción de cotización de proveedor
- [ ] Verificar que aparece en la lista de cotizaciones del RFQ

---

## 5. Comparación de Cotizaciones

### 5.1 Comparar Cotizaciones
- [ ] **URL:** Desde detalles de RFQ → "Comparar Cotizaciones"
- [ ] **API:** `GET /api/rfqs/[id]/quotes/compare`
- [ ] Verificar que se muestran todas las cotizaciones
- [ ] Verificar normalización de valores
- [ ] Verificar cálculo de scores
- [ ] Verificar ranking de proveedores
- [ ] Verificar visualización de comparación (tabla/gráfico)

### 5.2 Seleccionar Ganador
- [ ] Seleccionar cotización ganadora
- [ ] Verificar que se crea Purchase Order automáticamente

---

## 6. Purchase Orders

### 6.1 Ver Purchase Orders
- [ ] **API:** `GET /api/purchase-orders`
- [ ] Ver lista de POs
- [ ] Filtrar por estado
- [ ] Ver detalles de un PO

### 6.2 Timeline de PO
- [ ] **API:** `GET /api/purchase-orders/[id]/timeline`
- [ ] Ver timeline de eventos
- [ ] Verificar estados: `pending`, `confirmed`, `in_transit`, `delivered`, `completed`

### 6.3 Tracking
- [ ] Actualizar estado de PO
- [ ] Agregar eventos al timeline
- [ ] Verificar notificaciones

### 6.4 Pagos
- [ ] Registrar pago
- [ ] Ver historial de pagos
- [ ] Verificar estados de pago

---

## 7. Pipeline Kanban

### 7.1 Ver Pipeline
- [ ] **URL:** Dashboard → Pipeline
- [ ] **API:** `GET /api/pipeline`
- [ ] Ver columnas del Kanban:
  - [ ] `inbox` - Nuevos requerimientos
  - [ ] `processing` - En procesamiento
  - [ ] `rfq_sent` - RFQ enviado
  - [ ] `quotes_received` - Cotizaciones recibidas
  - [ ] `comparison` - En comparación
  - [ ] `po_created` - PO creado
  - [ ] `completed` - Completado

### 7.2 Mover Cards
- [ ] **API:** `POST /api/pipeline/[id]/move`
- [ ] Arrastrar card entre columnas
- [ ] Verificar que se actualiza el estado
- [ ] Verificar que se disparan automatizaciones (si aplica)

### 7.3 Automatización
- [ ] **API:** `POST /api/automation/process`
- [ ] Verificar reglas automáticas:
  - [ ] Auto-envío de RFQ cuando hay suficientes proveedores
  - [ ] Auto-creación de PO cuando se selecciona ganador
  - [ ] Notificaciones automáticas

---

## 8. Reportes y Analytics

### 8.1 Reportes de Cliente
- [ ] **URL:** `https://tu-dominio.vercel.app/app/reports`
- [ ] **API:** `GET /api/reports/comprasPorCliente`
- [ ] Ver reporte de compras por cliente
- [ ] Ver compras por mes
- [ ] Ver compras por producto
- [ ] Ver compras por proveedor
- [ ] Exportar reporte a Excel

### 8.2 Reportes Globales (Admin)
- [ ] **URL:** `https://tu-dominio.vercel.app/admin/reports`
- [ ] **API:** `GET /api/admin/reports/global`
- [ ] Ver métricas globales:
  - [ ] Total de clientes
  - [ ] Volumen total de compras
  - [ ] Número de licitaciones
  - [ ] Ahorros generados
- [ ] Ver reportes por cliente
- [ ] Exportar reportes

### 8.3 Otros Reportes
- [ ] **API:** `GET /api/reports/comprasPorProveedor`
- [ ] **API:** `GET /api/reports/preciosHistoricos`
- [ ] **API:** `GET /api/reports/resumenGlobal`
- [ ] Verificar que todos los reportes cargan correctamente

---

## 9. Admin Panel

### 9.1 Dashboard Admin
- [ ] **URL:** `https://tu-dominio.vercel.app/admin/dashboard`
- [ ] Ver métricas globales
- [ ] Ver acciones rápidas
- [ ] Navegar a diferentes secciones

### 9.2 Gestión de Clientes
- [ ] **URL:** `https://tu-dominio.vercel.app/admin/clients`
- [ ] **API:** `GET /api/admin/clients`
- [ ] Ver lista de clientes
- [ ] Ver detalles de cliente
- [ ] Crear nuevo cliente
- [ ] **API:** `POST /api/admin/create-client`
- [ ] Editar cliente
- [ ] Ver reportes de cliente específico

### 9.3 Gestión de Usuarios
- [ ] **URL:** `https://tu-dominio.vercel.app/admin/users`
- [ ] **API:** `GET /api/admin/users`
- [ ] Ver lista de usuarios
- [ ] Crear usuario
- [ ] Editar usuario
- [ ] **API:** `PATCH /api/admin/users/[userId]`
- [ ] Eliminar usuario
- [ ] **API:** `DELETE /api/admin/users/[userId]`
- [ ] Sincronizar usuarios
- [ ] **API:** `POST /api/admin/users/sync`

### 9.4 Gestión de Proveedores
- [ ] **URL:** `https://tu-dominio.vercel.app/admin/providers`
- [ ] Ver lista de proveedores
- [ ] Agregar proveedor
- [ ] Editar proveedor
- [ ] Ver calificaciones
- [ ] Ver historial de compras

### 9.5 Auditoría
- [ ] **URL:** `https://tu-dominio.vercel.app/admin/audit`
- [ ] Ver log de auditoría
- [ ] Filtrar por usuario
- [ ] Filtrar por acción
- [ ] Filtrar por fecha

---

## 10. Inbox e Ingestión

### 10.1 Ingestión Manual
- [ ] **API:** `POST /api/inbox/ingest`
- [ ] Enviar requerimiento manualmente
- [ ] Verificar que se crea Request en el sistema
- [ ] Verificar que aparece en Pipeline → Inbox

### 10.2 Webhook Email
- [ ] **API:** `POST /api/inbox/webhook/email`
- [ ] Simular recepción de email
- [ ] Verificar parsing de email
- [ ] Verificar creación de Request

### 10.3 Webhook WhatsApp
- [ ] **API:** `POST /api/inbox/webhook/whatsapp`
- [ ] Simular mensaje de WhatsApp
- [ ] Verificar parsing de mensaje
- [ ] Verificar creación de Request

---

## 11. Insights y Predicciones

### 11.1 Predicciones
- [ ] **API:** `GET /api/insights/predicciones`
- [ ] Ver predicciones de precios
- [ ] Ver predicciones de demanda
- [ ] Ver tendencias de mercado
- [ ] Verificar que requiere autenticación

### 11.2 Recomendaciones
- [ ] **API:** `GET /api/insights/recomendaciones`
- [ ] Ver recomendaciones de compra
- [ ] Ver recomendaciones de proveedores
- [ ] Ver recomendaciones de timing
- [ ] Verificar que requiere autenticación de cliente

---

## 12. Pruebas de Integración

### 12.1 Flujo Completo End-to-End
1. [ ] Cliente crea requerimiento
2. [ ] Requerimiento aparece en Pipeline → Inbox
3. [ ] Admin/Operador mueve a Processing
4. [ ] Se crea RFQ automáticamente
5. [ ] Se envían RFQs a proveedores
6. [ ] Proveedores envían cotizaciones
7. [ ] Se comparan cotizaciones
8. [ ] Se selecciona ganador
9. [ ] Se crea Purchase Order
10. [ ] Se actualiza timeline de PO
11. [ ] Se registran pagos
12. [ ] PO se completa
13. [ ] Aparece en reportes

### 12.2 Pruebas de Rendimiento
- [ ] Cargar dashboard con muchos datos
- [ ] Probar con múltiples usuarios simultáneos
- [ ] Verificar tiempos de respuesta de APIs

### 12.3 Pruebas de Seguridad
- [ ] Verificar que usuarios no pueden acceder a datos de otros clientes
- [ ] Verificar que solo admins pueden acceder a rutas admin
- [ ] Verificar validación de tokens JWT
- [ ] Verificar sanitización de inputs

---

## 13. Pruebas de UI/UX

### 13.1 Responsive Design
- [ ] Probar en desktop (1920x1080)
- [ ] Probar en tablet (768x1024)
- [ ] Probar en mobile (375x667)
- [ ] Verificar que todos los componentes se adaptan

### 13.2 Navegación
- [ ] Probar todos los enlaces
- [ ] Verificar breadcrumbs
- [ ] Verificar menús desplegables
- [ ] Verificar botones de acción

### 13.3 Formularios
- [ ] Validar todos los campos requeridos
- [ ] Verificar mensajes de error
- [ ] Verificar mensajes de éxito
- [ ] Probar autocompletado

---

## 14. Checklist de APIs

### 14.1 Autenticación
- [ ] `POST /api/auth/login` ✅
- [ ] `POST /api/auth/logout` ✅
- [ ] `GET /api/auth/me` ✅

### 14.2 Requerimientos
- [ ] `GET /api/requirements` ✅
- [ ] `POST /api/requirements` ✅
- [ ] `GET /api/requests` ✅
- [ ] `GET /api/requests/[id]` ✅
- [ ] `POST /api/requests/[id]/specs` ✅
- [ ] `GET /api/requests/[id]/suppliers` ✅

### 14.3 RFQs
- [ ] `GET /api/rfqs` ✅
- [ ] `POST /api/rfqs` ✅
- [ ] `POST /api/rfqs/[id]/send` ✅
- [ ] `GET /api/rfqs/[id]/quotes/compare` ✅

### 14.4 Purchase Orders
- [ ] `GET /api/purchase-orders` ✅
- [ ] `POST /api/purchase-orders` ✅
- [ ] `GET /api/purchase-orders/[id]` ✅
- [ ] `GET /api/purchase-orders/[id]/timeline` ✅

### 14.5 Pipeline
- [ ] `GET /api/pipeline` ✅
- [ ] `POST /api/pipeline/[id]/move` ✅

### 14.6 Reportes
- [ ] `GET /api/reports/comprasPorCliente` ✅
- [ ] `GET /api/reports/comprasPorProveedor` ✅
- [ ] `GET /api/reports/preciosHistoricos` ✅
- [ ] `GET /api/reports/resumenGlobal` ✅
- [ ] `GET /api/reports/client/[clientId]` ✅
- [ ] `GET /api/admin/reports/global` ✅

### 14.7 Admin
- [ ] `GET /api/admin/clients` ✅
- [ ] `POST /api/admin/create-client` ✅
- [ ] `GET /api/admin/users` ✅
- [ ] `PATCH /api/admin/users/[userId]` ✅
- [ ] `DELETE /api/admin/users/[userId]` ✅

### 14.8 Insights
- [ ] `GET /api/insights/predicciones` ✅
- [ ] `GET /api/insights/recomendaciones` ✅

### 14.9 Inbox
- [ ] `POST /api/inbox/ingest` ✅
- [ ] `POST /api/inbox/webhook/email` ✅
- [ ] `POST /api/inbox/webhook/whatsapp` ✅

---

## 🚀 Cómo Ejecutar las Pruebas

### Opción 1: Pruebas Manuales
1. Abre la aplicación en Vercel
2. Sigue cada sección de esta guía
3. Marca cada checkbox cuando completes una prueba

### Opción 2: Usar Postman/Insomnia
1. Importa las rutas de API
2. Configura autenticación JWT
3. Prueba cada endpoint

### Opción 3: Scripts de Prueba
```bash
# Ejecutar servidor local
npm run dev

# En otra terminal, ejecutar pruebas
# (puedes crear scripts de prueba con curl o fetch)
```

---

## 📝 Notas Importantes

1. **Credenciales de Prueba:**
   - Cliente: `cliente@test.com` / `password123`
   - Admin: `admin@naova.com` / `password123`

2. **Variables de Entorno:**
   - Asegúrate de tener `DATABASE_URL` configurada
   - Verifica que `JWT_SECRET` esté configurado

3. **Base de Datos:**
   - Ejecuta migraciones: `npx prisma migrate dev`
   - Ejecuta seed: `npx prisma db seed`

4. **Logs:**
   - Revisa la consola del navegador para errores
   - Revisa los logs de Vercel para errores del servidor

---

## ✅ Criterios de Éxito

- [ ] Todas las rutas de API responden correctamente
- [ ] Todas las páginas cargan sin errores
- [ ] La autenticación funciona correctamente
- [ ] Los flujos end-to-end se completan exitosamente
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs del servidor
- [ ] El diseño es responsive en todos los dispositivos
- [ ] Los reportes se generan y exportan correctamente

---

**Última actualización:** $(date)
**Versión de la plataforma:** 2.0.0

