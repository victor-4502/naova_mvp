# ✅ Cambios Realizados: Modo Prueba

## 🎯 Objetivo

Modificar el sistema para que:
1. **Genere mensajes automáticamente** cuando llegue un request incompleto
2. **NO los envíe automáticamente** - queden listos para revisar
3. **Toggle para activar envío** - control manual durante pruebas

---

## ✅ Cambios Implementados

### 1. AutoReplyService (`lib/services/inbox/AutoReplyService.ts`)

**ANTES:**
- Generaba mensaje con IA
- **Enviaba automáticamente** al cliente

**AHORA:**
- Genera mensaje con IA
- **Guarda el mensaje** con `processed: false`
- **NO envía automáticamente**
- Listo para revisar y enviar cuando quieras

### 2. Toggle de Auto-Respuesta Mejorado (`app/api/admin/requests/[requestId]/auto-reply/route.ts`)

**Funcionalidad:**
- Cuando activas el toggle, busca el mensaje pendiente
- Si encuentra un mensaje no procesado, lo envía automáticamente
- Funciona con WhatsApp y Email
- Si no hay mensaje pendiente, solo actualiza el estado

**Uso:**
1. Request incompleto llega → Mensaje generado automáticamente
2. En `/admin/requests` ves el mensaje sugerido
3. Activas el toggle → Mensaje se envía automáticamente
4. Desactivas el toggle → Solo desactiva para futuros requests

---

## 🧹 Script de Limpieza

### Creado: `scripts/limpiar-requests-prueba.ts`

**Uso:**
```bash
npm run limpiar:requests
```

**Lo que hace:**
- Elimina **TODOS** los requests
- Elimina **TODOS** los messages
- Elimina **TODOS** los attachments
- Muestra estadísticas antes y después

**⚠️ ADVERTENCIA:** Este script elimina TODO. Solo úsalo para limpiar datos de prueba.

---

## 🔄 Flujo Completo

### Cuando llega un Request Incompleto:

1. **Cliente envía mensaje** (WhatsApp/Email)
   ```
   "Necesito tornillos"
   ```

2. **Sistema analiza**
   - Detecta categoría
   - Identifica campos faltantes

3. **IA genera mensaje personalizado**
   - Usa OpenAI GPT
   - Incluye contexto completo
   - Mensaje personalizado y profesional

4. **Mensaje se guarda** (NO se envía)
   - `processed: false`
   - Listo para revisar
   - Aparece en `/admin/requests` como "Mensaje sugerido"

5. **Admin revisa y activa toggle**
   - Ve el mensaje sugerido
   - Activa el toggle "Activar respuesta automática"
   - **Mensaje se envía automáticamente**

6. **Cliente recibe mensaje personalizado**
   - Mensaje claro y profesional
   - Pide información faltante específicamente

---

## 📋 Estado del Toggle

### En `/admin/requests`:

- **Checkbox:** "Activar respuesta automática por el mismo canal"
- **Estado inicial:** Según `autoReplyEnabled` en el request
- **Acción:** Al activar, envía mensaje pendiente (si existe)

### Comportamiento:

- **Toggle ON:** 
  - Si hay mensaje pendiente → Lo envía
  - Futuros requests incompletos → Generará y guardará mensajes (pero NO enviará automáticamente hasta que actives el toggle para ese request)

- **Toggle OFF:**
  - Desactiva auto-respuesta para ese request
  - No enviará mensajes automáticos

---

## 🧪 Próximos Pasos para Probar

1. **Limpiar datos de prueba:**
   ```bash
   npm run limpiar:requests
   ```

2. **Enviar request de prueba:**
   - WhatsApp: "Necesito tornillos"
   - Email: "Quiero cotizar herramientas"

3. **Verificar en `/admin/requests`:**
   - Debe aparecer el request
   - Debe aparecer mensaje sugerido (generado con IA)
   - Toggle debe estar disponible

4. **Activar toggle:**
   - Activar checkbox
   - Mensaje debe enviarse automáticamente
   - Cliente debe recibir mensaje personalizado

5. **Verificar logs en Vercel:**
   - `[AutoReply] Mensaje generado y guardado`
   - `[Auto-Reply Toggle] Enviando mensaje pendiente`
   - `[Auto-Reply Toggle] Mensaje de WhatsApp/Email enviado`

---

## ✅ Ventajas de este Enfoque

1. **Control total:** Revisas mensajes antes de enviar
2. **Pruebas seguras:** No envía automáticamente durante pruebas
3. **Flexibilidad:** Activas el toggle cuando estés listo
4. **Trazabilidad:** Mensajes quedan registrados aunque no se envíen
5. **Producción ready:** Una vez probado, puedes dejar toggles activados

---

## 🔧 Configuración

**Variables de entorno necesarias:**
- `OPENAI_API_KEY` - Para generar mensajes con IA
- `WHATSAPP_ACCESS_TOKEN` - Para enviar por WhatsApp (cuando actives toggle)
- `SMTP_*` - Para enviar por Email (cuando actives toggle)

---

## 📝 Notas

- Los mensajes generados automáticamente tienen `processed: false`
- Solo se envían cuando activas el toggle
- Si desactivas el toggle después de enviar, no afecta mensajes ya enviados
- El toggle controla tanto el estado como el envío de mensajes pendientes

