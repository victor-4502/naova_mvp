# 📱 Cómo Enviar Mensajes a Naova (Estado Actual)

## ⚠️ Importante: Estado Actual

**Actualmente NO puedes enviar mensajes reales de WhatsApp o Email** porque falta la integración con proveedores externos (Twilio, WhatsApp Business API, SendGrid, etc.).

---

## 🧪 Cómo Probar AHORA (Sin Integración Real)

### Opción 1: Script de Prueba (Recomendado)

**Para WhatsApp:**
```bash
npm run tsx scripts/probar-webhook-whatsapp.ts
```

Este script:
- Busca un cliente registrado con teléfono
- Simula un mensaje de WhatsApp entrante
- Crea el request en la base de datos
- Genera auto-respuesta automáticamente

**Para Email:**
```bash
npm run tsx scripts/probar-webhook-email.ts
```

Este script:
- Busca un cliente registrado con email
- Simula un email entrante
- Crea el request en la base de datos
- Genera auto-respuesta automáticamente

---

### Opción 2: Plataforma Web (Funciona Realmente)

1. Ve a `http://localhost:3000/login`
2. Inicia sesión como cliente
3. Ve a `/app/requests`
4. Escribe tu requerimiento
5. Haz clic en "Enviar a Naova"

**✅ Esto SÍ funciona en tiempo real** - No es simulado.

---

## 📞 Números y Correos Configurados

### WhatsApp:
- **Número:** `+52 33 1608 3075`
- **Estado:** ⚠️ Configurado pero NO conectado todavía
- **Para que funcione:** Necesitas configurar WhatsApp Business API o Twilio

### Email:
- **Principal:** `compras@naova.com`
- **Alternativos:** `pedidos@naova.com`, `contacto@naova.com`
- **Estado:** ⚠️ Configurados pero NO conectados todavía
- **Para que funcione:** Necesitas configurar SendGrid, AWS SES, etc.

---

## 🔧 Qué Falta para que Funcione Realmente

### Para WhatsApp:

1. **Configurar WhatsApp Business API** (Meta/Facebook) o **Twilio**
2. **Verificar el número** `+52 33 1608 3075` en el servicio
3. **Configurar el webhook** para que envíe mensajes a:
   ```
   https://tu-dominio.com/api/inbox/webhook/whatsapp
   ```

### Para Email:

1. **Configurar un servicio** (SendGrid, AWS SES, Mailgun, etc.)
2. **Configurar el dominio** `naova.com` para recibir emails
3. **Configurar el webhook** para que envíe emails a:
   ```
   https://tu-dominio.com/api/inbox/webhook/email
   ```

---

## 🎯 Resumen

| Canal | Estado | Cómo Probar Ahora |
|-------|--------|-------------------|
| **WhatsApp** | ❌ No conectado | Usa `npm run tsx scripts/probar-webhook-whatsapp.ts` |
| **Email** | ❌ No conectado | Usa `npm run tsx scripts/probar-webhook-email.ts` |
| **Plataforma Web** | ✅ Funciona | Ve a `/app/requests` y crea un requerimiento |

---

## 💡 Recomendación

**Para probar el sistema completo ahora:**

1. **Usa el script de WhatsApp:**
   ```bash
   npm run tsx scripts/probar-webhook-whatsapp.ts
   ```

2. **Usa el script de Email:**
   ```bash
   npm run tsx scripts/probar-webhook-email.ts
   ```

3. **Crea uno desde la plataforma:**
   - Ve a `/app/requests` y crea un requerimiento

4. **Verifica en `/admin/requests`:**
   - Deberías ver los 3 requests
   - Cada uno con su source (WhatsApp/Email/Plataforma)
   - Cada uno con su mensaje sugerido si está incompleto

---

## 📚 Documentación Relacionada

- `ESTADO_INTEGRACION_WEBHOOKS.md` - Estado de integraciones
- `CONFIGURACION_CONTACTO_CLIENTES.md` - Cómo configurar correos/números
- `GUIA_PRUEBA_COMPLETA.md` - Guía completa de pruebas

