# 📝 Ejemplo: Crear Cliente con Múltiples Teléfonos y Emails

## 🎯 Objetivo

Cada cliente puede tener **múltiples números de teléfono y correos electrónicos** asociados a su cuenta. Esto permite que:

- El cliente pueda recibir RFQs en diferentes emails
- El cliente pueda recibir mensajes de WhatsApp en diferentes números
- El sistema identifique al cliente desde cualquiera de sus contactos

---

## 📋 Ejemplo de Creación de Cliente

### Request a la API:

```json
POST /api/admin/create-client
{
  "name": "Juan Pérez",
  "email": "juan.perez@empresa.com",  // Email principal (para login)
  "company": "Empresa ABC S.A.",
  "phone": "521234567890",  // Teléfono principal
  "plan": "trial",
  
  // Múltiples emails adicionales
  "additionalEmails": [
    {
      "email": "compras@empresa.com",
      "label": "Compras",
      "isPrimary": false
    },
    {
      "email": "juan.personal@gmail.com",
      "label": "Personal",
      "isPrimary": false
    },
    {
      "email": "gerente@empresa.com",
      "label": "Gerencia",
      "isPrimary": true  // Este será el email principal para notificaciones
    }
  ],
  
  // Múltiples teléfonos adicionales
  "additionalPhones": [
    {
      "phone": "521234567891",
      "label": "WhatsApp Principal",
      "isPrimary": true  // Este será el teléfono principal para WhatsApp
    },
    {
      "phone": "521234567892",
      "label": "Teléfono Oficina",
      "isPrimary": false
    },
    {
      "phone": "521234567893",
      "label": "Celular Personal",
      "isPrimary": false
    }
  ]
}
```

### Resultado:

El sistema creará:

1. **Usuario principal:**
   - Email: `juan.perez@empresa.com` (para login)
   - Teléfono: `521234567890` (teléfono principal)

2. **3 contactos de email adicionales:**
   - `compras@empresa.com` (Compras)
   - `juan.personal@gmail.com` (Personal)
   - `gerente@empresa.com` (Gerencia) - marcado como principal

3. **3 contactos de teléfono adicionales:**
   - `521234567891` (WhatsApp Principal) - marcado como principal
   - `521234567892` (Teléfono Oficina)
   - `521234567893` (Celular Personal)

---

## 🔍 Cómo Funciona la Identificación

### Cuando llega un Email:

1. El sistema busca en:
   - Email principal del usuario: `juan.perez@empresa.com`
   - Contactos adicionales: `compras@empresa.com`, `juan.personal@gmail.com`, `gerente@empresa.com`

2. Si el email coincide con **cualquiera** de estos, se identifica al cliente correctamente.

### Cuando llega un WhatsApp:

1. El sistema busca en:
   - Teléfono principal: `521234567890`
   - Contactos adicionales: `521234567891`, `521234567892`, `521234567893`

2. Si el número coincide con **cualquiera** de estos, se identifica al cliente correctamente.

---

## 📊 Estructura en Base de Datos

Después de crear el cliente, la base de datos tendrá:

### Tabla `User`:
```
id: "user_123"
name: "Juan Pérez"
email: "juan.perez@empresa.com"  ← Email principal (para login)
phone: "521234567890"  ← Teléfono principal
role: "client_enterprise"
```

### Tabla `ClientContact`:
```
id: "contact_1", userId: "user_123", type: "email", value: "compras@empresa.com", label: "Compras"
id: "contact_2", userId: "user_123", type: "email", value: "juan.personal@gmail.com", label: "Personal"
id: "contact_3", userId: "user_123", type: "email", value: "gerente@empresa.com", label: "Gerencia", isPrimary: true
id: "contact_4", userId: "user_123", type: "phone", value: "521234567891", label: "WhatsApp Principal", isPrimary: true
id: "contact_5", userId: "user_123", type: "phone", value: "521234567892", label: "Teléfono Oficina"
id: "contact_6", userId: "user_123", type: "phone", value: "521234567893", label: "Celular Personal"
```

---

## ✅ Ventajas

1. **Flexibilidad:** El cliente puede usar diferentes emails/teléfonos según el contexto
2. **Identificación Automática:** El sistema identifica al cliente desde cualquier contacto
3. **Organización:** Se pueden etiquetar los contactos (Personal, Trabajo, etc.)
4. **Priorización:** Se puede marcar un contacto como "principal" para notificaciones

---

## 🛠️ Gestión de Contactos (Futuro)

En el futuro, se podrá:

1. **Agregar contactos desde el panel admin:**
   - Ir a `/admin/clients/[id]`
   - Sección "Contactos"
   - Botón "Agregar Email" o "Agregar Teléfono"

2. **Editar contactos:**
   - Cambiar etiqueta
   - Marcar como principal
   - Verificar contacto

3. **Eliminar contactos:**
   - Remover contactos que ya no se usan

---

## 📝 Notas Importantes

- El **email principal** (`User.email`) es el que se usa para **login** en la plataforma
- Los **contactos adicionales** (`ClientContact`) son para **identificación** en emails/WhatsApp
- Un cliente puede tener **tantos contactos como necesite**
- Los contactos pueden tener **etiquetas** para organización
- Se puede marcar un contacto como **"principal"** para notificaciones importantes

---

**¿Esto es lo que necesitas? ¿Quieres que agregue alguna funcionalidad adicional?**

