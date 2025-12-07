# Información de Login para Clientes

## 🔐 Sistema de Autenticación

### Credenciales de Login

**Los clientes usan su EMAIL PRINCIPAL como nombre de usuario para hacer login.**

- **Campo de login:** Email principal del usuario (campo `email` en la tabla `User`)
- **Contraseña:** La contraseña asignada al crear el cliente

### Ejemplo

Si un cliente tiene:
- **Email principal:** `juan@empresa.com`
- **Contraseña:** `Cliente2024!`

Entonces para hacer login:
- **Email:** `juan@empresa.com`
- **Password:** `Cliente2024!`

---

## 📧 Múltiples Emails y Teléfonos

### Contactos Adicionales

Los clientes pueden tener **hasta 5 emails adicionales** y **hasta 5 teléfonos adicionales** además del email y teléfono principal.

### Identificación de Órdenes

**IMPORTANTE:** Si llega una orden desde:
- ✅ Cualquier email registrado (principal o adicional) → Se asigna al cliente
- ✅ Cualquier teléfono registrado (principal o adicional) → Se asigna al cliente

### Proceso de Identificación

1. **EmailProcessor** busca primero en el email principal, luego en `ClientContact` (emails adicionales)
2. **WhatsAppProcessor** busca primero en el teléfono principal, luego en `ClientContact` (teléfonos adicionales)

---

## 🎯 Gestión de Contactos

### Desde el Panel de Admin

1. Ve a **Gestión de Clientes** (`/admin/clients`)
2. Selecciona un cliente
3. En la sección de **Emails** o **Teléfonos**, haz clic en **"Agregar Email"** o **"Agregar Teléfono"**
4. Completa el formulario:
   - Email/Teléfono (requerido)
   - Etiqueta (opcional, ej: "Trabajo", "Personal", "WhatsApp")
   - Marcar como principal (opcional)

### Límites

- **Máximo 5 emails adicionales** por cliente
- **Máximo 5 teléfonos adicionales** por cliente
- El email principal del usuario (`User.email`) NO cuenta en este límite
- El teléfono principal del usuario (`User.phone`) NO cuenta en este límite

---

## 📝 Notas Importantes

1. **El login SIEMPRE usa el email principal** (`User.email`), no los emails adicionales
2. Los emails/teléfonos adicionales solo se usan para **identificar órdenes entrantes**
3. Si un cliente tiene múltiples emails, cualquiera de ellos puede recibir órdenes y se asignarán automáticamente
4. Los contactos adicionales se almacenan en la tabla `ClientContact`

---

## 🔄 Flujo Completo

### Crear Cliente Nuevo

1. Admin crea cliente con:
   - Email principal: `cliente@empresa.com`
   - Teléfono principal: `+52 33 1234 5678`
   - Contraseña: `Cliente2024!`

2. Cliente puede hacer login con:
   - Email: `cliente@empresa.com`
   - Password: `Cliente2024!`

3. Admin puede agregar contactos adicionales:
   - Email: `ventas@empresa.com` (etiqueta: "Ventas")
   - Teléfono: `+52 33 8765 4321` (etiqueta: "WhatsApp")

4. Si llega una orden a `ventas@empresa.com` o al WhatsApp `+52 33 8765 4321`, se asigna automáticamente al cliente.

---

## 🛠️ APIs Disponibles

### Obtener contactos de un cliente
```
GET /api/admin/clients/[clientId]/contacts
```

### Agregar contacto
```
POST /api/admin/clients/[clientId]/contacts
Body: {
  type: 'email' | 'phone',
  value: string,
  label?: string,
  isPrimary?: boolean
}
```

### Actualizar contacto
```
PATCH /api/admin/clients/[clientId]/contacts/[contactId]
Body: {
  label?: string,
  isPrimary?: boolean,
  verified?: boolean
}
```

### Eliminar contacto
```
DELETE /api/admin/clients/[clientId]/contacts/[contactId]
```

