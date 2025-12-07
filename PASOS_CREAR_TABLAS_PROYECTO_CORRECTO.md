# 📋 Pasos para Crear Tablas en el Proyecto Correcto de Supabase

## ✅ Proyecto Correcto
- **Project Reference ID:** `aptijeklzfxcxemnqpil`
- **Host:** `db.aptijeklzfxcxemnqpil.supabase.co`

## 🎯 Pasos a Seguir

### 1. Abre el Proyecto Correcto en Supabase
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Busca el proyecto con reference ID: `aptijeklzfxcxemnqpil`
3. Verifica en **Settings → Database** que el host sea: `db.aptijeklzfxcxemnqpil.supabase.co`
4. Abre ese proyecto

### 2. Ejecuta el Script de Migración Completa
1. Ve a **SQL Editor** (menú lateral izquierdo)
2. Haz clic en **"New query"**
3. **IMPORTANTE:** Usa el archivo: `prisma/manual_migration_safe.sql` ⭐ (RECOMENDADO)
   - Este script es SEGURO: verifica antes de crear (no falla si ya existe)
   - Tiene TODAS las tablas del sistema completo
   - Maneja enums existentes correctamente
   
   **Si ya ejecutaste manual_migration.sql y falló:**
   - Usa `prisma/manual_migration_safe.sql` (este no fallará)
   
4. Copia TODO el contenido del archivo
5. Pégalo en el SQL Editor
6. Haz clic en **"Run"** o presiona `Ctrl+Enter`
7. Espera a que termine (puede tomar 30-60 segundos)

### 3. Verifica que se Crearon las Tablas
1. Ve a **Table Editor** (menú lateral izquierdo)
2. Deberías ver muchas tablas, incluyendo:
   - `User`
   - `ClientProfile`
   - `ClientContact`
   - `Request`
   - `Supplier`
   - `RFQ`
   - `Quote`
   - `PurchaseOrder`
   - Y muchas más...

### 4. Crea los Usuarios Admin y Operador
1. Vuelve a **SQL Editor**
2. Haz clic en **"New query"** (nueva consulta)
3. Abre el archivo: `prisma/create_admin_ready.sql`
4. Copia TODO el contenido
5. Pégalo en el SQL Editor
6. Haz clic en **"Run"**
7. Deberías ver un mensaje de éxito y una lista con los usuarios creados

### 5. Verifica los Usuarios
1. En **SQL Editor**, ejecuta esta query:
```sql
SELECT id, name, email, role, active 
FROM "User" 
WHERE email IN ('admin@naova.com', 'operador@naova.com');
```

Deberías ver 2 usuarios:
- `admin@naova.com` con rol `admin_naova`
- `operador@naova.com` con rol `operator_naova`

## ✅ Después de Completar

Una vez que hayas ejecutado ambos scripts:

1. **Verifica la conexión local:**
   ```bash
   npx tsx scripts/verificar-login.ts
   ```

2. **Prueba el login:**
   - Ve a `http://localhost:3000/login`
   - Email: `admin@naova.com`
   - Password: `AdminNaova2024!`

## ⚠️ Si Hay Errores

Si ves errores como "table already exists" o "enum already exists":
- El script `complete_safe_migration.sql` usa `IF NOT EXISTS`, así que es seguro ejecutarlo varias veces
- Si hay conflictos, puedes ejecutar primero `prisma/verificar_tablas.sql` para ver qué existe

## 📝 Archivos a Usar (en orden)

1. **`prisma/manual_migration_safe.sql`** ⭐ (RECOMENDADO - USA ESTE)
   - Script SEGURO que verifica antes de crear
   - No falla si enums/tablas ya existen
   - Crea TODAS las tablas del sistema completo
   - Incluye: User, Request, Supplier, RFQ, Quote, PurchaseOrder, etc.
   
   **Si obtienes error "already exists", usa este script seguro**
   
   **Alternativas (NO recomendadas si ya hay enums):**
   - `prisma/manual_migration.sql` - Puede fallar si enums ya existen
   - `prisma/complete_safe_migration.sql` - Solo 3 tablas básicas

2. **`prisma/create_admin_ready.sql`** - Crea usuarios admin y operador

