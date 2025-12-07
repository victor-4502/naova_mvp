# Verificación de Contactos de Cliente

## ✅ ¿Necesitas cambiar algo en Supabase?

**NO, no necesitas cambiar nada manualmente.** Todo está configurado automáticamente.

## 🔍 Cómo Funciona

### 1. **Estructura de Base de Datos**

La tabla `ClientContact` ya está diseñada para relacionar contactos con clientes:

```sql
ClientContact
├── id (PK)
├── userId (FK → User.id)  ← Esto relaciona el contacto con el cliente
├── type ('email' | 'phone')
├── value (el email o teléfono)
├── label (etiqueta opcional)
├── isPrimary (si es principal)
└── verified (si está verificado)
```

**La relación `userId` asegura que cada contacto pertenece a un cliente específico.**

### 2. **Proceso Automático**

Cuando agregas un contacto desde la interfaz:

1. ✅ Se guarda en la tabla `ClientContact` con el `userId` del cliente
2. ✅ La relación `userId` → `User.id` asegura que pertenece al mismo cliente
3. ✅ Los procesadores de email/WhatsApp buscan automáticamente en `ClientContact`

### 3. **Identificación de Órdenes**

Cuando llega una orden:

**EmailProcessor:**
1. Busca primero en `User.email` (email principal)
2. Si no encuentra, busca en `ClientContact` donde `type = 'email'` y `value = email`
3. Si encuentra, usa el `userId` del contacto → **mismo cliente**

**WhatsAppProcessor:**
1. Busca primero en `User.phone` (teléfono principal)
2. Si no encuentra, busca en `ClientContact` donde `type = 'phone'` y `value` contiene el número
3. Si encuentra, usa el `userId` del contacto → **mismo cliente**

## 🔧 Verificación

### Si quieres verificar que todo está bien:

1. **Ejecuta en Supabase SQL Editor:**
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

2. **O ejecuta el script de verificación:**
   - Archivo: `prisma/verificar_clientcontact.sql`
   - Ejecuta en Supabase SQL Editor

## 📋 Checklist

- ✅ Tabla `ClientContact` creada (si ejecutaste `manual_migration_safe.sql`)
- ✅ Relación `userId` → `User.id` configurada
- ✅ Índices creados para búsquedas rápidas
- ✅ EmailProcessor busca en `ClientContact`
- ✅ WhatsAppProcessor busca en `ClientContact`
- ✅ API de contactos guarda con `userId` correcto

## 🚨 Si la tabla no existe

Si por alguna razón la tabla `ClientContact` no existe en Supabase:

1. Ejecuta en Supabase SQL Editor el script:
   - `prisma/manual_migration_safe.sql`
   
   O solo la parte de `ClientContact`:

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

-- Crear foreign key
ALTER TABLE "ClientContact" 
ADD CONSTRAINT "ClientContact_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;
```

## ✅ Conclusión

**No necesitas hacer nada manual en Supabase.** Todo funciona automáticamente:

- Los contactos se guardan con el `userId` correcto
- La relación asegura que pertenecen al mismo cliente
- Los procesadores buscan automáticamente en `ClientContact`
- Las órdenes se asignan al cliente correcto

**Solo asegúrate de que la tabla `ClientContact` esté creada** (debería estar si ejecutaste el script de migración).

