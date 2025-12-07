# 🔍 Verificar Conexión a la Base de Datos Correcta

## ⚠️ Problema

El error dice "La tabla Request no existe" pero en Supabase sí existe. Esto sugiere que **puede estar conectándose a otro proyecto de Supabase**.

---

## ✅ Pasos para Verificar

### Paso 1: Ver el Error Real en los Logs del Servidor

1. **Abre la terminal donde corre `npm run dev`**
2. **Recarga la página** `/admin/requests`
3. **Busca en la consola del servidor** el error completo

Deberías ver algo como:
```
Error en consulta a base de datos: [error]
Error completo: { message: "...", stack: "...", error: ... }
```

**Comparte ese error completo** para diagnosticar.

---

### Paso 2: Verificar DATABASE_URL

El archivo `.env` (o `.env.local`) debe tener:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"
```

**Verifica:**
1. ¿El `DATABASE_URL` apunta al proyecto correcto de Supabase?
2. ¿El proyecto de Supabase es el mismo donde creaste la tabla Request?

---

### Paso 3: Verificar en Supabase

Ejecuta esto en **el mismo proyecto de Supabase** donde creaste la tabla:

```sql
-- 1. Verificar que la tabla existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'Request';

-- 2. Ver el proyecto/host de la conexión
SELECT current_database(), current_user, inet_server_addr(), inet_server_port();
```

**Anota el `current_database`** y compáralo con tu `DATABASE_URL`.

---

### Paso 4: Probar Conexión Directa

Crea un script de prueba:

```typescript
// scripts/test-connection.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Probando conexión...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    // Intentar consultar la tabla Request
    const count = await prisma.$queryRaw`SELECT COUNT(*) FROM "Request"`
    console.log('✅ Conexión exitosa!')
    console.log('Total de requests:', count)
    
    // Verificar que la tabla tiene las columnas correctas
    const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Request'
    `
    console.log('Columnas de Request:', columns)
    
  } catch (error) {
    console.error('❌ Error de conexión:', error)
    if (error instanceof Error) {
      console.error('Mensaje:', error.message)
      console.error('Stack:', error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
```

Ejecuta:
```bash
npx tsx scripts/test-connection.ts
```

**Esto te dirá:**
- Si la conexión funciona
- Si la tabla existe
- Qué columnas tiene

---

### Paso 5: Verificar Múltiples Proyectos de Supabase

Si tienes múltiples proyectos de Supabase abiertos:

1. **Verifica en qué proyecto ejecutaste la migración**
2. **Verifica qué `DATABASE_URL` está en `.env`**
3. **Asegúrate de que coincidan**

---

## 🔧 Solución Rápida

### Si estás en el proyecto incorrecto:

1. **Ve a Supabase** → Selecciona el proyecto correcto
2. **Copia la nueva `DATABASE_URL`**:
   - Ve a Settings → Database
   - Copia "Connection string" → "URI"
3. **Actualiza `.env`**:
   ```env
   DATABASE_URL="[nueva_url_correcta]"
   ```
4. **Reinicia el servidor:**
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run dev
   ```

---

## 🎯 Checklist

- [ ] Revisé los logs del servidor para ver el error completo
- [ ] Verifiqué que `DATABASE_URL` en `.env` apunta al proyecto correcto
- [ ] Verifiqué en Supabase que la tabla Request existe en ese proyecto
- [ ] Ejecuté el script de prueba de conexión
- [ ] Reinicié el servidor después de cambiar `.env`

---

## 💡 Información Útil

**Comparte:**
1. El error completo de los logs del servidor
2. Los primeros caracteres de tu `DATABASE_URL` (sin la contraseña)
3. El resultado del script de prueba de conexión

Con esa información podremos identificar exactamente qué está pasando.

