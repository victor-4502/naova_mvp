# 📋 Instrucciones para Crear Tablas en Supabase

## ✅ Método: SQL Editor de Supabase

Como el pooler no permite crear tablas con múltiples comandos, vamos a crearlas desde el SQL Editor de Supabase.

### Pasos:

1. **Ve a Supabase Dashboard**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Abre el SQL Editor**
   - En el menú lateral, haz clic en **"SQL Editor"**
   - O ve directamente a: https://supabase.com/dashboard/project/[TU-PROJECT]/sql/new

3. **Copia el Script SQL**
   - Abre el archivo `CREAR_TABLAS_SUPABASE.sql` que acabo de crear
   - Copia TODO el contenido (Ctrl+A, Ctrl+C)

4. **Pega en el SQL Editor**
   - Pega el script completo en el editor
   - Haz clic en **"Run"** o presiona Ctrl+Enter

5. **Verifica que Funcionó**
   - Deberías ver un mensaje de éxito
   - Ejecuta esta query para verificar:
     ```sql
     SELECT table_name 
     FROM information_schema.tables 
     WHERE table_schema = 'public'
     ORDER BY table_name;
     ```
   - Deberías ver todas las tablas: User, ClientProfile, Requirement, Tender, Offer, Provider, PurchaseHistory, ContactLead, AuditLog

6. **Crear Usuarios Base**
   - Después de crear las tablas, ejecuta desde tu terminal:
     ```bash
     npm run db:seed
     ```
   - Esto creará los usuarios base (admin@naova.com, etc.)

## ✅ Listo!

Una vez creadas las tablas, podrás:
- ✅ Conectarte desde tu aplicación
- ✅ Crear usuarios
- ✅ Usar todas las funcionalidades
- ✅ Desplegar a Vercel

## 🧪 Probar Conexión

Después de crear las tablas, prueba:

```bash
node scripts/test-simple-prisma.js
```

Deberías ver:
```
✅ Conexión exitosa!
✅ Usuarios encontrados: X
```

