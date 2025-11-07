# 🚀 Naova SaaS MVP - Documentación Completa

## 📋 Estado Actual del Proyecto

✅ **Completado:**
- Schema de base de datos (Prisma) con todos los modelos
- Seed data con usuarios, proveedores, compras históricas
- Sistema de autenticación con JWT y roles
- Middleware de protección de rutas
- Utilidades de email y hash de contraseñas
- API routes para login/logout
- Configuración de dependencias

⚠️ **Pendiente de Implementación:**

El proyecto está estructurado pero necesita que continúes con:

### 1. API Routes Faltantes

**Admin Routes (`/app/api/admin/`):**
- `create-client/route.ts` - Crear clientes (solo admin)
- `clients/route.ts` - Listar y gestionar clientes
- `providers/route.ts` - Gestionar proveedores
- `reports/global/route.ts` - Reportes globales admin

**Client Routes (`/app/api/`):**
- `requirements/route.ts` - CRUD de requerimientos
- `tenders/route.ts` - Ver licitaciones
- `reports/client/[clientId]/route.ts` - Reportes de cliente

**Contact Route:**
- `contact/route.ts` - Formulario de contacto

### 2. Páginas Frontend

**Autenticación:**
- `/app/login/page.tsx` - Página de login
- `/app/precios/page.tsx` - Página de precios con CTAs a contacto
- `/app/contact/page.tsx` - Formulario de contacto

**Dashboard Cliente (`/app/app/`):**
- `dashboard/page.tsx` - 5 reportes principales
- `requirements/page.tsx` - Lista y crear requerimientos
- `tenders/page.tsx` - Ver licitaciones activas
- `reports/page.tsx` - Exportar reportes

**Dashboard Admin (`/app/admin/`):**
- `dashboard/page.tsx` - Vista global admin
- `clients/page.tsx` - Gestión de clientes
- `providers/page.tsx` - Gestión de proveedores
- `tenders/page.tsx` - Gestión de licitaciones

### 3. Componentes Compartidos

**En `/components/`:**
- `Sidebar.tsx` - Navegación lateral
- `DashboardCard.tsx` - Tarjetas de métricas
- `ChartComponents.tsx` - Gráficos con Recharts
- `RequirementForm.tsx` - Formulario de requerimientos
- `Modal.tsx` - Modal reutilizable
- `LoadingSpinner.tsx` - Loading states
- `Toast.tsx` - Notificaciones (usa react-hot-toast)

### 4. Tests Básicos

**En `/__tests__/`:**
- `Login.test.tsx`
- `DashboardClient.test.tsx`
- `AdminCreateClient.test.tsx`

---

## 🛠️ Setup del Proyecto

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL 14+ (o cuenta de Supabase)
- npm o yarn

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Configuración de Variables de Entorno

Copia el archivo `env.example` a `.env`:

```bash
cp env.example .env
```

Edita `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/naova_db"
JWT_SECRET="tu-secreto-super-seguro-cambiar-en-produccion"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-contraseña-app"
```

### 3. Base de Datos

**Generar cliente Prisma:**
```bash
npm run db:generate
```

**Ejecutar migraciones:**
```bash
npm run db:migrate
```

**Poblar con datos de prueba:**
```bash
npm run db:seed
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 🔑 Credenciales de Prueba

Después del seed, usa estas credenciales:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@naova.com | password123 |
| Cliente 1 | cliente1@empresa.com | password123 |
| Cliente 2 | cliente2@empresa.com | password123 |

---

## 📊 Los 5 Reportes Clave del Dashboard Cliente

### 1. Ahorro Generado
**Cálculo:** 
```typescript
avgHistoricalPrice - bestTenderPrice
```
Compara precio promedio histórico vs mejor oferta en licitaciones.

### 2. Top 5 Categorías de Gasto
**Query:**
```sql
SELECT category, SUM(totalPrice) 
FROM PurchaseHistory 
WHERE clientId = ? 
GROUP BY category 
ORDER BY SUM DESC 
LIMIT 5
```

### 3. Top 5 Proveedores
**Por:**
- Gasto total
- Número de órdenes
- Rating promedio

### 4. Histórico de Compras (12 meses)
**Gráfico de línea:**
Agrupa `PurchaseHistory` por mes y suma `totalPrice`.

### 5. Comparativa de Precios
**Muestra:**
- Precio promedio histórico por categoría
- Mejor precio obtenido en licitaciones
- % de ahorro

---

## 🏗️ Estructura de Carpetas

```
naova2.0/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       ✅ HECHO
│   │   │   ├── logout/route.ts      ✅ HECHO
│   │   │   └── me/route.ts          ✅ HECHO
│   │   ├── admin/
│   │   │   ├── create-client/       ⚠️ TODO
│   │   │   ├── clients/             ⚠️ TODO
│   │   │   └── reports/             ⚠️ TODO
│   │   ├── requirements/            ⚠️ TODO
│   │   ├── tenders/                 ⚠️ TODO
│   │   ├── reports/                 ⚠️ TODO
│   │   └── contact/                 ⚠️ TODO
│   ├── login/page.tsx               ⚠️ TODO
│   ├── precios/page.tsx             ⚠️ TODO
│   ├── contact/page.tsx             ⚠️ TODO
│   ├── app/
│   │   ├── dashboard/page.tsx       ⚠️ TODO
│   │   ├── requirements/page.tsx    ⚠️ TODO
│   │   ├── tenders/page.tsx         ⚠️ TODO
│   │   └── reports/page.tsx         ⚠️ TODO
│   ├── admin/
│   │   ├── dashboard/page.tsx       ⚠️ TODO
│   │   ├── clients/page.tsx         ⚠️ TODO
│   │   ├── providers/page.tsx       ⚠️ TODO
│   │   └── tenders/page.tsx         ⚠️ TODO
│   ├── layout.tsx                   ✅ EXISTENTE
│   ├── page.tsx                     ✅ EXISTENTE (landing)
│   └── globals.css                  ✅ EXISTENTE
├── components/
│   ├── Header.tsx                   ✅ EXISTENTE
│   ├── Hero.tsx                     ✅ EXISTENTE
│   ├── Footer.tsx                   ✅ EXISTENTE
│   ├── Sidebar.tsx                  ⚠️ TODO
│   ├── DashboardCard.tsx            ⚠️ TODO
│   ├── Charts/                      ⚠️ TODO
│   └── RequirementForm.tsx          ⚠️ TODO
├── lib/
│   ├── prisma.ts                    ✅ HECHO
│   ├── auth.ts                      ✅ HECHO
│   └── email.ts                     ✅ HECHO
├── prisma/
│   ├── schema.prisma                ✅ HECHO
│   └── seed.ts                      ✅ HECHO
├── middleware.ts                    ✅ HECHO
├── package.json                     ✅ ACTUALIZADO
├── tsconfig.json                    ✅ EXISTENTE
├── tailwind.config.js               ✅ EXISTENTE
└── env.example                      ✅ HECHO
```

---

## 🎯 Siguientes Pasos para Completar el MVP

### Paso 1: API Routes de Admin

Crea `/app/api/admin/create-client/route.ts`:

```typescript
// TODO: Implementar creación de cliente
// 1. Verificar que el usuario es admin (headers)
// 2. Validar datos con Zod
// 3. Generar contraseña temporal
// 4. Crear User + ClientProfile
// 5. Enviar email de bienvenida
// 6. Retornar 201 con datos del cliente
```

### Paso 2: Dashboard Cliente

Crea `/app/app/dashboard/page.tsx`:

```typescript
// TODO: Implementar dashboard
// 1. Fetch datos del usuario actual
// 2. Fetch reportes desde /api/reports/client/[id]
// 3. Mostrar 5 widgets con métricas
// 4. Agregar gráficos con Recharts
// 5. Card de "Insight rápido"
```

### Paso 3: Página de Login

Crea `/app/login/page.tsx`:

```typescript
// TODO: Formulario de login
// 1. Form con email + password
// 2. POST a /api/auth/login
// 3. Guardar token en cookie
// 4. Redirect según rol (admin -> /admin, client -> /app)
// 5. Mostrar mensaje si no tiene cuenta
```

### Paso 4: Página de Precios

Crea `/app/precios/page.tsx`:

```typescript
// TODO: Página de planes
// 1. Mostrar 3 planes (Trial, Básico, Empresarial)
// 2. Botón "Contactar a ventas" (no compra directa)
// 3. Modal o redirect a /contact
```

### Paso 5: Componentes de UI

Crea componentes reutilizables:
- `Sidebar` con navegación
- `DashboardCard` para métricas
- Gráficos con Recharts
- `RequirementForm` modal
- Toast notifications

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build
npm start

# Base de datos
npm run db:generate    # Genera Prisma Client
npm run db:push        # Push schema a BD
npm run db:migrate     # Crea y ejecuta migraciones
npm run db:seed        # Pobla BD con datos de prueba
npm run db:studio      # Abre Prisma Studio

# Testing
npm test
npm run test:watch

# Linting
npm run lint
```

---

## 🔐 Seguridad

### Implementado:
- ✅ Passwords hasheados con bcrypt
- ✅ JWT con expiración (7 días)
- ✅ HTTP-only cookies
- ✅ Middleware de autenticación
- ✅ Validación con Zod
- ✅ Protección de rutas por rol

### Pendiente:
- ⚠️ Rate limiting en login
- ⚠️ CSRF protection
- ⚠️ Validación de uploads
- ⚠️ Sanitización de inputs

---

## 📧 Configuración de Email

### Desarrollo:
Usa **Mailtrap.io** para testing:
```env
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT="2525"
SMTP_USER="tu-user"
SMTP_PASS="tu-pass"
```

### Producción:
Usa **SendGrid**, **AWS SES** o **Resend**:
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="tu-api-key"
```

---

## 🧪 Testing

Crea `/__tests__/Login.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/login/page'

describe('Login Page', () => {
  it('renders login form', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })
})
```

---

## 🚀 Deployment

### Vercel (Recomendado):

1. Push a GitHub
2. Conecta repo en Vercel
3. Configura variables de entorno
4. Deploy automático

### Variables de entorno en Vercel:
- `DATABASE_URL`
- `JWT_SECRET`
- `SMTP_*` variables
- `NEXT_PUBLIC_APP_URL`

---

## 📝 Notas Importantes

### Sin Registro Público
- **No existe** self-service signup
- Solo admins crean cuentas de cliente
- CTA "Crear cuenta" → redirige a /precios → contacto

### Flujo de Precios
- Planes mostrados sin precio final
- Botón "Contactar a ventas"
- No integración de pagos (Stripe/MercadoPago)
- Leads guardados en `ContactLead` table

### Reportes
- Cálculos en servidor (API routes)
- Export CSV con `papaparse`
- Export PDF con `jspdf`
- Agregaciones con Prisma

---

## 🆘 Troubleshooting

### Error: Prisma Client no generado
```bash
npm run db:generate
```

### Error: DATABASE_URL no definida
Verifica que `.env` existe y contiene `DATABASE_URL`

### Error: Cannot connect to database
Verifica que PostgreSQL está corriendo:
```bash
# Mac/Linux
pg_ctl status

# Windows
net start postgresql-x64-14
```

### Emails no se envían
En desarrollo, revisa que `SMTP_*` variables están configuradas.
Logs muestran el contenido del email si SMTP no está configurado.

---

## 📖 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Recharts](https://recharts.org)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🤝 Contribución

Este es un MVP. Para añadir features:

1. Crea branch feature
2. Implementa con tests
3. Update este README si aplica
4. PR para review

---

**© 2024 Naova. MVP funcional para compras industriales.**


