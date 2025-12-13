# 🔍 Cómo Ver los Logs del Webhook de Email

## 📋 Necesitamos Ver los Logs del POST

Los logs que compartiste son solo de páginas GET. Necesitamos ver los logs del **webhook POST** para diagnosticar.

---

## 🔍 Pasos para Ver los Logs del Webhook

### 1. Ir a Vercel

1. Ve a: https://vercel.com
2. Inicia sesión
3. Selecciona tu proyecto `naova`

### 2. Ir a la Pestaña "Logs"

1. En el dashboard del proyecto, busca la pestaña **"Logs"**
2. Haz clic en ella

### 3. Filtrar los Logs

En la barra de búsqueda de logs, escribe:
```
POST /api/inbox/webhook/email
```

O simplemente:
```
/api/inbox/webhook/email
```

### 4. Buscar Logs Específicos

Busca estas líneas en los logs:

#### Logs del Payload Recibido:
```
[Email Webhook] Received payload:
```
Este muestra el payload completo que Resend está enviando.

#### Logs del Análisis:
```
[Email Webhook] 🔍 Análisis del contenido:
```
Este muestra qué campos tiene el payload (subject, text, html).

#### Logs del Procesamiento:
```
[EmailProcessor] 📧 Payload completo recibido:
[EmailProcessor] ✅ Usando texto plano:
[EmailProcessor] 📝 Contenido final:
```

---

## 📋 Qué Buscar Específicamente

### 1. ¿Qué está llegando en el payload?

Busca: `[Email Webhook] Received payload:`

**¿Qué deberías ver?**
- El payload completo de Resend
- Busca campos como: `text`, `html`, `subject`, `from`, `to`

### 2. ¿Tiene contenido el email?

Busca: `[Email Webhook] 🔍 Análisis del contenido:`

**¿Qué deberías ver?**
- `hasText: true/false` - ¿Hay texto plano?
- `hasHtml: true/false` - ¿Hay HTML?
- `textLength: X` - Longitud del texto
- `htmlLength: X` - Longitud del HTML

### 3. ¿Cómo se está procesando?

Busca: `[EmailProcessor] 📧 Payload completo recibido:`

**¿Qué deberías ver?**
- `textValue: ...` - El valor del texto
- `htmlValue: ...` - El valor del HTML
- Si ambos están vacíos, ese es el problema

---

## 💡 Si No Encuentras Logs del POST

**Posibles causas:**

1. **El webhook no está llegando**
   - Verifica en Resend que el webhook está activo
   - Verifica que Resend recibió el email

2. **El filtro está ocultando los logs**
   - Intenta buscar sin filtro
   - Busca por fecha/hora cuando enviaste el email

3. **El endpoint está dando error antes de los logs**
   - Busca errores 500 o 400
   - Revisa si hay errores de sintaxis

---

## 📋 Información que Necesito

Por favor, comparte:

1. **El payload completo** que aparece en:
   ```
   [Email Webhook] Received payload: { ... }
   ```

2. **El análisis del contenido**:
   ```
   [Email Webhook] 🔍 Análisis del contenido: { ... }
   ```

3. **El procesamiento**:
   ```
   [EmailProcessor] 📧 Payload completo recibido: { ... }
   [EmailProcessor] 📝 Contenido final: { ... }
   ```

Con esta información podré ver exactamente qué está llegando y por qué el contenido está vacío.

---

## 🎯 También Puedes Probar

Si no encuentras los logs, puedes probar manualmente:

```bash
npm run test:endpoint:email
```

Esto te mostrará si el endpoint funciona correctamente con un payload de prueba.

