# 🤖 Configurar OpenAI para Mensajes Personalizados con IA

## 📋 Resumen

El sistema ahora puede generar mensajes personalizados usando **OpenAI GPT** cuando está configurado. Si no está configurado, usa plantillas predefinidas como fallback.

---

## 🔑 Configuración

### Paso 1: Obtener API Key de OpenAI

1. Ve a: https://platform.openai.com
2. Inicia sesión o crea una cuenta
3. Ve a **"API keys"** en el menú lateral
4. Haz clic en **"Create new secret key"**
5. **Copia la API key** (empieza con `sk-`)
6. ⚠️ **IMPORTANTE:** Guárdala bien, solo se muestra una vez

---

### Paso 2: Agregar a Variables de Entorno

#### En `.env.local` (desarrollo local):
```env
OPENAI_API_KEY=sk-tu_api_key_aqui
OPENAI_MODEL=gpt-4o-mini  # Opcional: modelo a usar (default: gpt-4o-mini)
```

#### En Vercel (producción):
1. Ve a: https://vercel.com
2. Selecciona tu proyecto `naova`
3. Ve a **"Settings"** → **"Environment Variables"**
4. Agrega:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Tu API key de OpenAI
   - **Environment**: Production, Preview, Development (marcar todos)
5. (Opcional) Agrega:
   - **Name**: `OPENAI_MODEL`
   - **Value**: `gpt-4o-mini` (o el modelo que prefieras)
   - **Environment**: Production, Preview, Development
6. Haz clic en **"Save"**

---

## 💰 Costos

### Modelos Recomendados:

1. **gpt-4o-mini** (Recomendado - más económico)
   - Costo: ~$0.15 por 1M tokens de entrada, ~$0.60 por 1M tokens de salida
   - Calidad: Excelente para este caso de uso
   - Velocidad: Rápida

2. **gpt-4o** (Más potente, más caro)
   - Costo: ~$2.50 por 1M tokens de entrada, ~$10 por 1M tokens de salida
   - Calidad: Superior
   - Velocidad: Más lenta

3. **gpt-3.5-turbo** (Más económico, menos potente)
   - Costo: ~$0.50 por 1M tokens de entrada, ~$1.50 por 1M tokens de salida
   - Calidad: Buena
   - Velocidad: Muy rápida

### Estimación de Costos:

Para **gpt-4o-mini**:
- Cada mensaje generado: ~500 tokens
- Costo aproximado: **$0.0003 por mensaje** (muy económico)
- 1,000 mensajes: ~$0.30
- 10,000 mensajes: ~$3.00

---

## 🎯 Cómo Funciona

### Con IA Configurada:
1. El sistema analiza el request del cliente
2. Incluye contexto: nombre, empresa, historial de conversación
3. Genera un mensaje personalizado usando GPT
4. El mensaje es natural, contextualizado y profesional

### Sin IA (Fallback):
1. El sistema usa plantillas predefinidas
2. Los mensajes son funcionales pero menos personalizados
3. No requiere configuración adicional

---

## ✅ Verificar que Funciona

Después de configurar:

1. **Crea un request incompleto** (por WhatsApp, email, etc.)
2. **Verifica los logs** en Vercel:
   ```
   [AIService] Generando mensaje con IA...
   [AIService] Mensaje generado exitosamente
   ```
3. **Revisa el mensaje generado** en el admin panel
4. Debería ser más personalizado y natural

---

## 🔧 Troubleshooting

### "OpenAI no configurado, usando fallback"
- Verifica que `OPENAI_API_KEY` esté en las variables de entorno
- Asegúrate de que el deploy en Vercel incluyó la variable
- Reinicia el servidor si estás en local

### "Error generando mensaje con IA"
- Verifica que la API key sea válida
- Revisa que tengas créditos en tu cuenta de OpenAI
- Verifica los logs para el error específico

### Costos muy altos
- Cambia a `gpt-4o-mini` (más económico)
- O desactiva la IA temporalmente removiendo `OPENAI_API_KEY`

---

## 📝 Notas

- La IA se usa **solo para generar mensajes de seguimiento** cuando falta información
- Si la IA no está disponible, el sistema funciona normalmente con plantillas
- Los mensajes generados con IA son más naturales y contextualizados
- El sistema incluye automáticamente el historial de conversación para mejor contexto

