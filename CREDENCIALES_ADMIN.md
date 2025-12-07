# 🔐 Credenciales de Administrador - Naova 2.0

## 👤 Usuario Administrador por Defecto

Después de ejecutar el seed de la base de datos, se crea un usuario administrador con las siguientes credenciales:

### Credenciales de Admin:
- **Email:** `admin@naova.com`
- **Password:** `AdminNaova2024!`
- **Rol:** `admin_naova`

### Credenciales de Operador:
- **Email:** `operador@naova.com`
- **Password:** `OperadorNaova2024!`
- **Rol:** `operator_naova`

---

## 🚀 Cómo Ejecutar el Seed

Para crear los usuarios por defecto, ejecuta:

```bash
npm run prisma:seed
```

O directamente:

```bash
npx tsx prisma/seed.ts
```

---

## ⚠️ IMPORTANTE - Seguridad

**Estas credenciales son solo para desarrollo/pruebas.**

En producción, debes:

1. **Cambiar las contraseñas inmediatamente** después del primer login
2. **Usar variables de entorno** para las contraseñas del seed
3. **Eliminar o desactivar** estas credenciales si no son necesarias
4. **Implementar autenticación de dos factores** para usuarios admin

---

## 📝 Notas

- El seed verifica si los usuarios ya existen antes de crearlos
- Puedes ejecutar el seed múltiples veces sin duplicar usuarios
- Las contraseñas se hashean con bcrypt antes de guardarse
- Los usuarios se crean con `active: true` por defecto

---

## 🔄 Cambiar Contraseña

Para cambiar la contraseña de un usuario admin:

1. Login como admin
2. Ir a `/admin/users`
3. Editar el usuario
4. Cambiar la contraseña

O directamente en la base de datos:

```typescript
import { hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const newPassword = 'NuevaPasswordSegura123!'
const passwordHash = await hashPassword(newPassword)

await prisma.user.update({
  where: { email: 'admin@naova.com' },
  data: { passwordHash }
})
```

---

**Última actualización:** $(date)

