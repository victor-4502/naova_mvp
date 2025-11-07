# 🚀 Guía de Setup Rápida - Naova SaaS

## Paso a Paso para Ejecutar el Proyecto

### ✅ Paso 1: Verificar Prerrequisitos

Asegúrate de tener instalado:
- **Node.js 18+** ([descargar](https://nodejs.org/))
- **PostgreSQL 14+** ([descargar](https://www.postgresql.org/download/))
- **Git** (opcional)

### ✅ Paso 2: Instalar Dependencias

Abre la terminal en la carpeta del proyecto:

```bash
cd naova2.0
npm install
```

Esto instalará todas las dependencias necesarias (~389 paquetes).

### ✅ Paso 3: Configurar Base de Datos

#### Opción A: PostgreSQL Local

1. Inicia PostgreSQL
2. Crea una base de datos:
```sql
CREATE DATABASE naova_db;
```

#### Opción B: Supabase (Recomendado para desarrollo)

1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto gratuito
3. Copia la connection string de PostgreSQL

### ✅ Paso 4: Crear Archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DATABASE_URL="postgresql://postgres:password@localhost:5432/naova_db"

# JWT Secret (genera uno aleatorio)
JWT_SECRET="mi-secreto-super-seguro-cambialo-en-produccion"

# Email (opcional para desarrollo)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-contraseña-de-app"
SMTP_FROM="Naova <noreply@naova.com>"

# Sales
SALES_EMAIL="ventas@naova.com"
NEXT_PUBLIC_WHATSAPP="+525512345678"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Nota:** Para emails en desarrollo, puedes usar [Mailtrap.io](https://mailtrap.io) (gratis).

### ✅ Paso 5: Configurar Prisma y Base de Datos

```bash
# 1. Generar Prisma Client
npm run db:generate

# 2. Crear las tablas en la base de datos
npm run db:push

# 3. Poblar con datos de prueba
npm run db:seed
```

Deberías ver:
```
🌱 Starting seed...
✅ Admin user created: admin@naova.com
✅ Client users created
✅ Providers created: 5
✅ Purchase history created: XX records
✅ Requirements created
✅ Tender and offers created
✅ Audit logs created

🎉 Seed completed successfully!

📝 Login credentials:
Admin: admin@naova.com / password123
Cliente 1: cliente1@empresa.com / password123
Cliente 2: cliente2@empresa.com / password123
```

### ✅ Paso 6: Ejecutar el Proyecto

```bash
npm run dev
```

El servidor iniciará en [http://localhost:3000](http://localhost:3000)

### ✅ Paso 7: Probar el Sistema

#### Como Cliente:
1. Ve a [http://localhost:3000/login](http://localhost:3000/login)
2. Ingresa: `cliente1@empresa.com` / `password123`
3. Explora el dashboard con los 5 reportes

#### Como Admin:
1. Ve a [http://localhost:3000/login](http://localhost:3000/login)
2. Ingresa: `admin@naova.com` / `password123`
3. Crea nuevos clientes, gestiona proveedores

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to database"

**Solución:**
- Verifica que PostgreSQL esté corriendo
- Confirma que el `DATABASE_URL` en `.env` sea correcto
- Prueba la conexión con: `npm run db:studio`

### Error: "Module not found"

**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Prisma Client not generated"

**Solución:**
```bash
npm run db:generate
```

### Emails no se envían

**Solución:**
- Los emails son opcionales en desarrollo
- Si no configuras SMTP, verás los logs en la consola
- Para testing real, usa [Mailtrap.io](https://mailtrap.io)

### Puerto 3000 ocupado

**Solución:**
```bash
# Usa otro puerto
PORT=3001 npm run dev
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Servidor de desarrollo
npm run build              # Build de producción
npm start                  # Servidor de producción

# Base de Datos
npm run db:generate        # Regenerar Prisma Client
npm run db:push            # Aplicar cambios al schema
npm run db:migrate         # Crear migración
npm run db:seed            # Volver a poblar datos
npm run db:studio          # Abrir Prisma Studio (GUI)

# Linting y Tests
npm run lint               # ESLint
npm test                   # Ejecutar tests
```

---

## 📊 Prisma Studio

Para explorar la base de datos visualmente:

```bash
npm run db:studio
```

Esto abre una interfaz web en [http://localhost:5555](http://localhost:5555) donde puedes:
- Ver todas las tablas
- Editar datos
- Crear registros manualmente

---

## 🎯 Rutas Principales

### Públicas
- `/` - Landing page
- `/login` - Inicio de sesión
- `/precios` - Planes
- `/contact` - Formulario de contacto

### Cliente (requiere login)
- `/app/dashboard` - Dashboard con 5 reportes
- `/app/requirements` - Gestión de requerimientos
- `/app/tenders` - Ver licitaciones

### Admin (requiere rol admin)
- `/admin/dashboard` - Vista global
- `/admin/clients` - CRUD de clientes
- `/admin/providers` - Lista de proveedores

---

## 🚀 Próximos Pasos

1. ✅ Ejecuta el proyecto
2. ✅ Explora el dashboard de cliente
3. ✅ Crea un requerimiento
4. ✅ Como admin, crea un nuevo cliente
5. ✅ Revisa los reportes y gráficos

---

## 📞 ¿Necesitas Ayuda?

- **Documentación completa:** Ver `FINAL_README.md`
- **Código de referencia:** Ver `IMPLEMENTATION_GUIDE.md`
- **Detalles técnicos:** Ver `MVP_README.md`

---

**¡Listo para empezar! 🎉**

