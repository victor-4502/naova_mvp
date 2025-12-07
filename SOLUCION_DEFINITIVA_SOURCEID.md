# ✅ Solución Definitiva: Error sourceId

## 🔍 Diagnóstico

El error indica que Prisma Client no reconoce la columna `sourceId` aunque ya está en la base de datos. Esto es porque Prisma Client está cacheado.

---

## ✅ Solución Completa (Paso a Paso)

### Paso 1: Verificar que la Columna Existe en la BD

**En Supabase SQL Editor, ejecuta:**

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Request' 
  AND column_name = 'sourceId';
```

**Si NO devuelve nada**, primero agrega la columna:

```sql
ALTER TABLE "Request" 
ADD COLUMN IF NOT EXISTS "sourceId" TEXT;
```

### Paso 2: Detener el Servidor

⚠️ **IMPORTANTE:** Detén el servidor de desarrollo primero (Ctrl+C en la terminal donde corre `npm run dev`)

### Paso 3: Sincronizar Schema con la Base de Datos

Ejecuta este comando para sincronizar el schema de Prisma con la BD:

```powershell
npx prisma db push
```

Esto debería mostrar algo como:
```
✔ Generated Prisma Client (X.XXXs)
✔ The database is now in sync with your schema.
```

### Paso 4: Reiniciar el Servidor

```powershell
npm run dev
```

### Paso 5: Probar Nuevamente

```powershell
npm run test:webhook:whatsapp
npm run test:webhook:email
```

---

## 🔧 Cambios en el Código

El código ya está modificado para ser más robusto:
- Solo incluye `sourceId` en el create si está definido
- Esto evita errores si la columna aún no existe

Pero **aún necesitas sincronizar Prisma Client** para que reconozca la columna.

---

## 🐛 Si Sigue Fallando

### Opción A: Verificar Todas las Columnas de Request

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'Request'
ORDER BY ordinal_position;
```

Compara con el schema en `prisma/schema.prisma` (líneas 202-239).

### Opción B: Usar Prisma Migrate

Si `db push` no funciona:

```powershell
# Generar migración
npx prisma migrate dev --name add_source_id_column

# Aplicar migración
npx prisma migrate deploy
```

### Opción C: Regenerar Prisma Client Manualmente

```powershell
# Limpiar cache de Prisma
Remove-Item -Recurse -Force node_modules\.prisma

# Regenerar cliente
npx prisma generate
```

---

## 📝 Verificación Final

Después de sincronizar, verifica que Prisma reconoce la columna:

```powershell
npx prisma studio
```

Abre Prisma Studio y navega a la tabla `Request`. Deberías ver la columna `sourceId` en la lista de columnas.

---

## ✅ Checklist

- [ ] La columna `sourceId` existe en la BD (verificado con SQL)
- [ ] El servidor está detenido
- [ ] Se ejecutó `npx prisma db push` exitosamente
- [ ] Se reinició el servidor
- [ ] Las pruebas pasan sin errores de `sourceId`

---

**Una vez completado esto, los webhooks deberían funcionar correctamente.**

