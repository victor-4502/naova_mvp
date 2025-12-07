# 🔧 Solución: Prisma Client Cacheado

## ⚠️ Problema

Después de agregar la columna `sourceId` a la base de datos, Prisma Client sigue dando error porque está usando una versión cacheada que no reconoce la nueva columna.

---

## ✅ Solución: Sincronizar Schema con la Base de Datos

### Opción 1: Usar Prisma DB Push (Recomendado)

Este comando sincroniza el schema de Prisma con la base de datos sin crear migraciones:

```powershell
npx prisma db push
```

**Importante:** Detén el servidor (`npm run dev`) antes de ejecutar esto, o puede fallar por bloqueo de archivos.

### Opción 2: Regenerar Prisma Client

**Paso 1:** Detén el servidor de desarrollo (Ctrl+C)

**Paso 2:** Regenera Prisma Client:

```powershell
npx prisma generate
```

**Paso 3:** Reinicia el servidor:

```powershell
npm run dev
```

### Opción 3: Sincronización Completa

Si las opciones anteriores no funcionan:

```powershell
# 1. Detén el servidor
# 2. Sincroniza schema con BD
npx prisma db push

# 3. Regenera cliente
npx prisma generate

# 4. Reinicia servidor
npm run dev
```

---

## 🔍 Verificar que la Columna Existe

Antes de sincronizar, verifica que la columna realmente existe en la BD:

**En Supabase SQL Editor, ejecuta:**

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Request' 
  AND column_name = 'sourceId';
```

Si no devuelve nada, la columna NO existe y necesitas agregarla primero (ver `SOLUCION_ERROR_SOURCEID.md`).

---

## 🎯 Pasos Completos

1. **Verifica que la columna existe** (SQL arriba)
2. **Detén el servidor** (`Ctrl+C` en la terminal donde corre `npm run dev`)
3. **Sincroniza el schema:**
   ```powershell
   npx prisma db push
   ```
4. **Prueba nuevamente:**
   ```powershell
   npm run test:webhook:whatsapp
   npm run test:webhook:email
   ```

---

## 📝 Nota

El código ya está modificado para que sea más robusto - solo incluye `sourceId` si está definido, lo que debería evitar errores si la columna no existe aún.

