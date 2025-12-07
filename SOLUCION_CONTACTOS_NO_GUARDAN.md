# Solución: Contactos no se guardan en Supabase

## 🔍 Problema

Los contactos aparecen en la app pero no en Supabase. Esto significa que **la tabla `ClientContact` probablemente no existe** en tu base de datos.

## ✅ Solución

### Paso 1: Verificar si la tabla existe

Ejecuta en **Supabase SQL Editor**:

```sql
-- Verificar si existe la tabla
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'ClientContact';
```

**Si no devuelve resultados**, la tabla no existe y necesitas crearla.

### Paso 2: Crear la tabla

Ejecuta en **Supabase SQL Editor** el script:

**Archivo:** `prisma/crear_tabla_clientcontact.sql`

O ejecuta directamente:

```sql
-- Crear tabla ClientContact
CREATE TABLE IF NOT EXISTS "ClientContact" (
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

-- Crear índices
CREATE INDEX IF NOT EXISTS "ClientContact_userId_idx" ON "ClientContact"("userId");
CREATE INDEX IF NOT EXISTS "ClientContact_type_value_idx" ON "ClientContact"("type", "value");
CREATE UNIQUE INDEX IF NOT EXISTS "ClientContact_userId_type_value_key" ON "ClientContact"("userId", "type", "value");

-- Crear foreign key (relación con User)
ALTER TABLE "ClientContact" 
ADD CONSTRAINT "ClientContact_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;
```

### Paso 3: Verificar que se creó

```sql
-- Ver contactos existentes
SELECT 
    c.id,
    c.type,
    c.value,
    c.label,
    u.name as cliente,
    u.email as email_principal
FROM "ClientContact" c
JOIN "User" u ON c."userId" = u.id
ORDER BY u.name, c.type;
```

## 🔧 Diagnóstico

He agregado logs en el código para diagnosticar:

1. **En el navegador (F12 > Console):**
   - Verás logs cuando agregas un contacto
   - Verás la respuesta del servidor

2. **En el servidor (terminal donde corre `npm run dev`):**
   - Verás logs cuando se intenta crear el contacto
   - Verás errores si hay algún problema

## 📋 Checklist

- [ ] Tabla `ClientContact` existe en Supabase
- [ ] Índices creados
- [ ] Foreign key creada (relación con User)
- [ ] Probar agregar un contacto
- [ ] Verificar en Supabase que se guardó

## 🚨 Si sigue sin funcionar

1. **Abre la consola del navegador (F12)**
2. **Intenta agregar un contacto**
3. **Revisa los logs en la consola**
4. **Revisa los logs en el servidor (terminal)**
5. **Comparte los errores que aparezcan**

## 💡 Nota

Si la tabla no existe, Prisma intentará crear el contacto pero fallará silenciosamente. Por eso aparece en la app (estado local) pero no en Supabase (base de datos real).

