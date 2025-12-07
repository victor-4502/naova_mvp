# Estructura y Funcionalidades de la Plataforma Naova

## 📍 Flujo de Autenticación

Cuando un usuario inicia sesión en `/login`, el sistema verifica sus credenciales y lo redirige según su rol:

- **Rol ADMIN** → `/admin/dashboard`
- **Rol CLIENT** → `/app/dashboard`

---

## 🏢 Área de Cliente (`/app/`)

### Dashboard Principal (`/app/dashboard`)

**Ubicación:** `app/app/dashboard/page.tsx`

**Funcionalidades:**
- **Métricas principales:**
  - Ahorros Totales
  - Número de Compras
  - Proveedores activos
  - Tendencia de crecimiento

- **Acciones rápidas:**
  1. **Crear Requerimiento** → `/app/requirements`
  2. **Ver Licitaciones** → `/app/tenders`
  3. **Ver Reportes** → `/app/reports`

### Requerimientos (`/app/requirements`)

**Ubicación:** `app/app/requirements/page.tsx`

**Funcionalidades:**
- Crear nuevos requerimientos de compra
- Agregar múltiples productos a un requerimiento
- Especificar:
  - Nombre y descripción del producto
  - Categoría
  - Cantidad y unidad de medida
  - Especificaciones técnicas
  - Presupuesto estimado
- Cargar productos desde Excel (plantilla descargable)
- Enviar requerimientos para crear licitaciones
- Ver historial de requerimientos con estados:
  - `ACTIVE` - Activo
  - `CLOSED` - Cerrado
  - `SUBMITTED` - Enviado

### Licitaciones (`/app/tenders`)

**Ubicación:** `app/app/tenders/page.tsx`

**Funcionalidades:**
- Ver todas las licitaciones del cliente
- Filtrar por estado:
  - `all` - Todas
  - `processing` - En proceso
  - `active` - Activas
  - `closed` - Cerradas
- Ver detalles de cada licitación:
  - Productos solicitados
  - Ofertas recibidas de proveedores
  - Comparación de precios
  - Calificaciones de proveedores
- Seleccionar oferta ganadora
- Ver información de proveedores (nombre, email, teléfono, calificación)

### Reportes (`/app/reports`)

**Ubicación:** `app/app/reports/page.tsx`

**Funcionalidades:**
- Visualizar reportes de compras
- Métricas y análisis de historial
- Exportar datos

---

## 👨‍💼 Área de Administrador (`/admin/`)

### Dashboard Administrativo (`/admin/dashboard`)

**Ubicación:** `app/admin/dashboard/page.tsx`

**Funcionalidades:**
- **Métricas globales:**
  - Total de Clientes
  - Volumen Total de compras
  - Número de Licitaciones
  - Ahorros generados

- **Acciones rápidas:**
  1. **Ver Requests / Inbox** → `/admin/requests`
  2. **Ver Reportes de Clientes** → `/admin/clients`
  3. **Gestionar Proveedores** → `/admin/providers`
  4. **Ver Reportes** → `/admin/reports`
  5. **Gestionar Usuarios** → `/admin/users`
  6. **Gestionar Licitaciones** → `/admin/tenders`
  7. **Historial de Auditoría** → `/admin/audit`

- **Licitaciones en Proceso:**
  - Lista de licitaciones pendientes de activación
  - Información de cada licitación (título, fechas, productos, cliente)
  - Botón para activar licitaciones

### Gestión de Licitaciones (`/admin/tenders`)

**Ubicación:** `app/admin/tenders/page.tsx`

**Funcionalidades:**
- Ver todas las licitaciones del sistema
- Crear nuevas licitaciones manualmente
- Gestionar estados de licitaciones
- Agregar ofertas de proveedores a licitaciones
- Ver y comparar ofertas
- Activar licitaciones para que los clientes las vean
- Ver detalles completos de productos y ofertas

### Gestión de Usuarios (`/admin/users`)

**Ubicación:** `app/admin/users/page.tsx`

**Funcionalidades:**
- Ver lista de todos los usuarios
- Crear nuevos usuarios (clientes o administradores)
- Editar información de usuarios
- Eliminar usuarios
- Sincronizar usuarios con la base de datos

### Gestión de Clientes (`/admin/clients`)

**Ubicación:** `app/admin/clients/page.tsx`

**Funcionalidades:**
- Ver información de clientes
- Crear nuevos clientes
- Gestionar datos de clientes

### Gestión de Proveedores (`/admin/providers`)

**Ubicación:** `app/admin/providers/page.tsx`

**Funcionalidades:**
- Ver lista de proveedores
- Agregar nuevos proveedores
- Editar información de proveedores
- Gestionar calificaciones y especialidades

### Reportes (`/admin/reports`)

**Ubicación:** `app/admin/reports/page.tsx`

**Funcionalidades:**
- Reportes globales del sistema
- Análisis de compras por cliente
- Análisis de compras por proveedor
- Precios históricos
- Resumen global de operaciones

### Auditoría (`/admin/audit`)

**Ubicación:** `app/admin/audit/page.tsx`

**Funcionalidades:**
- Ver historial de acciones del sistema
- Rastrear cambios y modificaciones
- Logs de actividad

### Inbox / Requests (`/admin/requests`)

**Ubicación:** `app/admin/requests/page.tsx`

**Funcionalidades:**
- Ver todos los requests entrantes de todos los clientes
- Filtrar por fuente (WhatsApp, Email, Plataforma, etc.)
- Ver detalles de cada request:
  - Contenido original
  - Cliente asociado
  - Estado y pipeline stage
  - Categoría y urgencia
  - Análisis de completitud
  - Campos faltantes
  - Mensajes de seguimiento sugeridos (auto-respuesta)
- Activar/desactivar auto-respuesta por request
- Ver mensajes de seguimiento generados automáticamente
- Gestionar requests incompletos o que requieren más información

**Fuentes de requests:**
- WhatsApp (mensajes entrantes)
- Email (correos entrantes)
- Plataforma web (formularios)
- Chat (en vivo)
- Archivos (carga de documentos)
- API (integración externa)

---

## 🔐 Sistema de Autenticación

### Login (`/login`)

**Ubicación:** `app/login/page.tsx`

**Características:**
- Formulario de inicio de sesión con email y contraseña
- Validación de credenciales
- Redirección automática según rol
- Manejo de errores
- Opción para mostrar/ocultar contraseña

### API de Autenticación

**Endpoints:**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

---

## 📊 Almacenamiento de Datos

### Estado Global (Store)

**Ubicación:** `lib/store.ts`

El sistema utiliza un store centralizado para gestionar:
- **Requerimientos** (`Requirement[]`)
- **Licitaciones** (`Tender[]`)
- **Usuarios** (gestionados vía API)

### Base de Datos (Prisma)

**Ubicación:** `prisma/schema.prisma`

Modelos principales:
- `User` - Usuarios del sistema
- Otros modelos según necesidad

---

## 🎨 Diseño y Estilo

### Layouts

- **Layout Principal** (`app/layout.tsx`) - Aplica a toda la aplicación
- **Layout de Cliente** (`app/app/layout.tsx`) - Solo para rutas `/app/*`
- **Layout de Admin** (`app/admin/layout.tsx`) - Solo para rutas `/admin/*`

### Componentes Reutilizables

- Framer Motion para animaciones
- TailwindCSS para estilos
- Lucide React para íconos
- Diseño responsive (mobile y desktop)

---

## 🔄 Flujo de Trabajo Típico

### Para Clientes:

1. **Iniciar sesión** → `/login`
2. **Ver dashboard** → `/app/dashboard`
3. **Crear requerimiento** → `/app/requirements`
   - Agregar productos
   - Enviar requerimiento
4. **Ver licitaciones** → `/app/tenders`
   - Ver ofertas recibidas
   - Comparar precios
   - Seleccionar oferta ganadora
5. **Ver reportes** → `/app/reports`

### Para Administradores:

1. **Iniciar sesión** → `/login`
2. **Ver dashboard** → `/admin/dashboard`
3. **Gestionar licitaciones** → `/admin/tenders`
   - Activar licitaciones pendientes
   - Agregar ofertas de proveedores
4. **Gestionar usuarios** → `/admin/users`
   - Crear cuentas de cliente
5. **Ver reportes** → `/admin/reports`
6. **Gestionar proveedores** → `/admin/providers`

---

## 📝 Notas Importantes

- **Autenticación:** El middleware verifica la autenticación antes de permitir acceso a rutas protegidas
- **Roles:** El sistema distingue entre `ADMIN` y `CLIENT`
- **Persistencia:** Los datos se almacenan tanto en el store local como en la base de datos (Prisma)
- **Excel:** Los clientes pueden cargar productos desde archivos Excel usando plantillas descargables

---

## 🚀 URLs Principales

### Públicas:
- `/` - Landing page
- `/login` - Inicio de sesión

### Cliente (requiere autenticación):
- `/app/dashboard` - Dashboard del cliente
- `/app/requirements` - Requerimientos
- `/app/tenders` - Licitaciones
- `/app/reports` - Reportes

### Administrador (requiere autenticación):
- `/admin/dashboard` - Dashboard administrativo
- `/admin/requests` - Inbox / Requests entrantes
- `/admin/tenders` - Gestión de licitaciones
- `/admin/users` - Gestión de usuarios
- `/admin/clients` - Gestión de clientes
- `/admin/providers` - Gestión de proveedores
- `/admin/reports` - Reportes globales
- `/admin/audit` - Auditoría

---

Este documento proporciona una visión general completa de la estructura y funcionalidades de la plataforma Naova después del login.

