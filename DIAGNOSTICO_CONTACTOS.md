# Diagnóstico: Contactos no se guardan en Supabase

## 🔍 Pasos para Diagnosticar

### 1. Verificar en la Consola del Navegador (F12)

Cuando intentas agregar un contacto, deberías ver:

```
Agregando contacto: { userId: "...", type: "email", value: "...", ... }
Respuesta del servidor: { success: true, contact: { ... } }
Contacto creado exitosamente: { id: "...", ... }
```

**Si ves un error**, compártelo.

### 2. Verificar en el Terminal del Servidor

Cuando intentas agregar un contacto, deberías ver:

```
Creando contacto: { userId: "...", type: "email", value: "...", ... }
Contacto creado exitosamente: { id: "...", ... }
```

**Si ves un error**, compártelo.

### 3. Verificar en Supabase

Ejecuta en Supabase SQL Editor:

```sql
-- Ver todos los contactos
SELECT 
    c.id,
    c."userId",
    c.type,
    c.value,
    c.label,
    c."isPrimary",
    u.name as cliente,
    u.email as email_principal
FROM "ClientContact" c
LEFT JOIN "User" u ON c."userId" = u.id
ORDER BY c."createdAt" DESC
LIMIT 10;
```

### 4. Verificar la Relación Foreign Key

```sql
-- Verificar que la foreign key existe
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'ClientContact';
```

### 5. Verificar el userId

Cuando agregas un contacto, el `userId` debe ser el ID del cliente. Verifica:

```sql
-- Ver usuarios y sus IDs
SELECT id, name, email, role 
FROM "User" 
WHERE role = 'client_enterprise';
```

Luego compara con el `userId` que se está enviando en los logs.

## 🚨 Errores Comunes

### Error P2003: Foreign Key Constraint
**Causa:** El `userId` no existe en la tabla `User`
**Solución:** Verifica que el ID del cliente sea correcto

### Error P2002: Unique Constraint
**Causa:** Ya existe un contacto con el mismo `userId`, `type` y `value`
**Solución:** El contacto ya existe, no se puede duplicar

### Error P2011: Null Constraint
**Causa:** Falta un campo requerido
**Solución:** Verifica que todos los campos requeridos estén presentes

## ✅ Verificación Final

Después de agregar un contacto:

1. **En la app:** Debe aparecer en la lista
2. **En Supabase:** Ejecuta `SELECT * FROM "ClientContact" ORDER BY "createdAt" DESC LIMIT 1;`
3. **En los logs:** Debe aparecer "Contacto creado exitosamente" con un ID

Si el contacto aparece en la app pero NO en Supabase, puede ser:
- Un problema de transacción (rollback)
- Un problema de conexión a la base de datos
- Un problema de permisos

