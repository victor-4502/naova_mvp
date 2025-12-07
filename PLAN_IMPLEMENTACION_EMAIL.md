# 📧 Plan de Implementación: Integración Completa de Email

## 🎯 Objetivo

Implementar la misma funcionalidad que WhatsApp pero para Email:
- ✅ Recibir emails y crear requests
- ✅ Continuación de conversaciones (asociar emails a requests existentes)
- ✅ Enviar respuestas por email desde la plataforma
- ✅ Identificación de clientes por email

## 📋 Tareas

### 1. Continuación de Conversaciones para Email
- [x] Agregar método `findActiveRequest()` en `EmailProcessor`
- [x] Modificar `processEmail()` para buscar requests activos antes de crear uno nuevo
- [x] Usar la misma lógica de 7 días que WhatsApp

### 2. EmailService para Enviar Emails
- [ ] Crear `lib/services/email/EmailService.ts`
- [ ] Métodos para enviar emails (similar a WhatsAppService)
- [ ] Usar la función existente `sendEmail()` de `lib/email.ts`

### 3. Integrar Envío en Admin Panel
- [ ] Modificar `app/api/admin/requests/[requestId]/messages/route.ts`
- [ ] Agregar lógica para enviar emails cuando `messageSource === 'email'`
- [ ] Integrar con EmailService

### 4. Configuración
- [ ] Documentar variables de entorno necesarias
- [ ] Crear guía de configuración de webhook de email
- [ ] Documentar proveedores de email soportados

## 🔄 Flujo Completo

```
1. Email llega → Webhook /api/inbox/webhook/email
2. Identificar cliente → EmailProcessor.identifyClient()
3. Buscar request activo → EmailProcessor.findActiveRequest()
4. Si existe → Agregar mensaje al request existente
5. Si no existe → Crear nuevo request

6. Admin responde → POST /api/admin/requests/[id]/messages
7. Detectar source = 'email'
8. Enviar email → EmailService.sendEmail()
9. Guardar mensaje en BD
```

