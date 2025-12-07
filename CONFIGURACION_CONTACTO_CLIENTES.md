# 📧📱 Configuración de Contacto para Clientes

## Resumen

Este documento explica cómo configurar los correos y números de WhatsApp donde los clientes pueden enviar requerimientos a Naova.

---

## 🔧 Configuración Actual

### Email de Naova

**Email principal:**
- `compras@naova.com` (por defecto)

**Emails alternativos:**
- `pedidos@naova.com`
- `contacto@naova.com`

### WhatsApp de Naova

**Número principal:**
- `+52 33 1608 3075` (por defecto)
- Formato normalizado para webhooks: `523316083075`

---

## ⚙️ Cómo Cambiar la Configuración

### Opción 1: Variables de Entorno (Recomendado)

Crea o edita el archivo `.env.local` en la raíz del proyecto:

```env
# Email principal de Naova
NAOVA_EMAIL_PRIMARY=compras@naova.com

# Emails alternativos (opcional)
NAOVA_EMAIL_ALT_1=pedidos@naova.com
NAOVA_EMAIL_ALT_2=contacto@naova.com

# WhatsApp de Naova
NAOVA_WHATSAPP_PRIMARY=+52 33 1608 3075
NAOVA_WHATSAPP_DISPLAY=+52 33 1608 3075
NAOVA_WHATSAPP_NORMALIZED=523316083075

# URLs de webhooks (para integración con proveedores)
WEBHOOK_EMAIL_URL=https://tu-dominio.com/api/inbox/webhook/email
WEBHOOK_WHATSAPP_URL=https://tu-dominio.com/api/inbox/webhook/whatsapp
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

### Opción 2: Editar el Archivo de Configuración

Edita `lib/config/contactInfo.ts` directamente:

```typescript
export const NAOVA_CONTACT_INFO = {
  email: {
    primary: 'tu-email@naova.com',
    alternatives: ['otro-email@naova.com'],
  },
  whatsapp: {
    primary: '+52 33 1234 5678',
    display: '+52 33 1234 5678',
    normalized: '521234567890',
  },
  // ...
}
```

---

## 📍 Dónde se Muestra esta Información

### 1. Página de Requerimientos del Cliente (`/app/requests`)

Los clientes ven una sección destacada con:
- Email principal de Naova (con enlace `mailto:`)
- Número de WhatsApp (con enlace directo a WhatsApp)
- Mensaje explicativo sobre cómo usar los canales

### 2. Footer del Sitio Web (Landing Page)

El footer muestra `contacto@naova.com` como email de contacto general.

### 3. Componente FinalCTA

El componente de CTA final incluye enlaces a WhatsApp con el número configurado.

---

## 🔗 Integración con Proveedores Externos

### Email (SendGrid, AWS SES, etc.)

Cuando configures tu proveedor de email:

1. **Configura el webhook** para que envíe emails entrantes a:
   ```
   https://tu-dominio.com/api/inbox/webhook/email
   ```

2. **Configura el email de recepción** en tu proveedor:
   - Email principal: `compras@naova.com`
   - Emails alternativos: `pedidos@naova.com`, `contacto@naova.com`

3. **Formato del webhook esperado:**
   ```json
   {
     "from": {
       "email": "cliente@empresa.com",
       "name": "Juan Pérez"
     },
     "to": ["compras@naova.com"],
     "subject": "Solicitud de cotización",
     "text": "Necesito cotizar tornillos...",
     "messageId": "unique-message-id",
     "timestamp": "2024-01-15T10:30:00Z"
   }
   ```

### WhatsApp (Twilio, WhatsApp Business API, etc.)

Cuando configures tu proveedor de WhatsApp:

1. **Configura el webhook** para que envíe mensajes entrantes a:
   ```
   https://tu-dominio.com/api/inbox/webhook/whatsapp
   ```

2. **Configura el número de WhatsApp** en tu proveedor:
   - Número: `+52 33 1608 3075` (o el que configures)
   - Formato normalizado: `523316083075`

3. **Formato del webhook esperado:**
   ```json
   {
     "from": "521234567890",
     "to": "523316083075",
     "message": {
       "id": "unique-message-id",
       "type": "text",
       "text": {
         "body": "Necesito cotizar tornillos..."
       }
     },
     "timestamp": "2024-01-15T10:30:00Z"
   }
   ```

---

## 📝 Verificación

### Verificar que la Configuración Funciona

1. **Ver en la interfaz:**
   - Ve a `/app/requests` como cliente
   - Deberías ver el email y WhatsApp configurados

2. **Verificar en el código:**
   ```typescript
   import { NAOVA_CONTACT_INFO } from '@/lib/config/contactInfo'
   
   console.log('Email:', NAOVA_CONTACT_INFO.email.primary)
   console.log('WhatsApp:', NAOVA_CONTACT_INFO.whatsapp.display)
   ```

3. **Probar webhooks:**
   - Usa los scripts en `scripts/probar-webhook-email.ts` y `scripts/probar-webhook-whatsapp.ts`
   - Verifica que los requests se crean correctamente

---

## 🎯 Valores por Defecto

Si no configuras variables de entorno, el sistema usa:

- **Email:** `compras@naova.com`
- **WhatsApp:** `+52 33 1608 3075` (normalizado: `523316083075`)

Estos valores están en `lib/config/contactInfo.ts`.

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo tener múltiples emails?**
R: Sí, puedes configurar un email principal y emails alternativos. Todos recibirán requerimientos.

**P: ¿Cómo cambio el número de WhatsApp?**
R: Edita las variables de entorno `NAOVA_WHATSAPP_*` o el archivo `lib/config/contactInfo.ts`.

**P: ¿Los clientes ven esta información?**
R: Sí, se muestra en `/app/requests` en una sección destacada.

**P: ¿Necesito configurar algo en Supabase?**
R: No, esta configuración es solo en el código. Los webhooks funcionan independientemente.

---

## 🔄 Próximos Pasos

1. **Configura tus variables de entorno** con los valores reales
2. **Integra con proveedores de email/WhatsApp** y configura los webhooks
3. **Prueba el flujo completo** enviando requerimientos por ambos canales
4. **Personaliza los mensajes** si es necesario

---

## 📚 Archivos Relacionados

- `lib/config/contactInfo.ts` - Configuración centralizada
- `app/app/requests/page.tsx` - Página donde se muestra la información
- `app/api/inbox/webhook/email/route.ts` - Webhook de email
- `app/api/inbox/webhook/whatsapp/route.ts` - Webhook de WhatsApp
- `COMO_PROBAR_AUTO_RESPUESTA.md` - Cómo probar el sistema

