# 🔗 Cómo Usar Tu Cuenta de OpenAI

## ⚠️ Diferencia Importante

### ChatGPT Pro (Lo que Tienes):
- ✅ **Interfaz web** para usar ChatGPT
- ✅ Te da acceso a GPT-4 en chat.openai.com
- ✅ **NO incluye acceso a la API** (es aparte)

### OpenAI API (Lo que Necesitas):
- ✅ **Acceso programático** para integrar en tu código
- ✅ Se paga por uso (tokens consumidos)
- ✅ **Necesitas crear API Key** separada

---

## 🔑 Cómo Usar Tu Cuenta Existente

**¡Buena noticia!** Si tienes ChatGPT Pro, ya tienes cuenta en OpenAI, así que puedes usar la misma cuenta para la API.

### Pasos:

1. **Ve a:** https://platform.openai.com/
2. **Inicia sesión** con la misma cuenta de ChatGPT
3. **Ve a:** "API Keys" (o "API keys" en el menú)
4. **Crea una nueva API Key:**
   - Click en "Create new secret key"
   - Dale un nombre (ej: "Naova Production")
   - **Copia la key** (solo se muestra una vez)

5. **Agrega créditos** (si no tienes):
   - Ve a "Billing" → "Add payment method"
   - Agrega tarjeta
   - Configura límite de gasto (recomendado)

6. **Agrega la key a tu proyecto:**
   - En tu archivo `.env`:
   ```env
   OPENAI_API_KEY=sk-tu-key-aqui
   ```

---

## 💳 Planes y Créditos

### ChatGPT Pro:
- ✅ Acceso a ChatGPT web
- ❌ NO incluye créditos para API
- 💰 **$20/mes fijo**

### OpenAI API:
- ✅ Acceso a la API
- ✅ Pago por uso (pay-as-you-go)
- 💰 **Desde $5 mínimo** de crédito inicial

**Son servicios separados.** ChatGPT Pro NO incluye créditos de API, pero puedes usar la misma cuenta.

---

## 🎯 Configuración Recomendada

### Opción 1: Usar la Misma Cuenta (Más Simple)
- ✅ Ya tienes la cuenta
- ✅ Solo agregas método de pago
- ✅ Configuras límite de gasto

### Opción 2: Crear Cuenta Separada (Más Control)
- ✅ Separas gastos de ChatGPT vs API
- ✅ Más fácil de rastrear costos
- ✅ Puedes dar acceso solo a desarrolladores

---

## 🔧 Configuración en Naova

Una vez que tengas tu API Key, podemos configurarla así:

```env
# .env
OPENAI_API_KEY=sk-tu-key-aqui
USE_AI=true
AI_MODEL=gpt-4o-mini
AI_DAILY_LIMIT=100
AI_MONTHLY_BUDGET=10
```

---

## 💡 Recomendación

**Sí, puedes usar tu cuenta existente de ChatGPT Pro:**
1. Ve a platform.openai.com
2. Inicia sesión con la misma cuenta
3. Crea una API Key
4. Agrega método de pago (separado del plan Pro)
5. Configura límite de gasto ($5-10/mes para empezar)

**La cuenta es la misma, pero el pago es separado.**

---

## 📝 Próximos Pasos

1. Ve a https://platform.openai.com/
2. Crea tu API Key
3. Avísame y te ayudo a configurarla en el proyecto

**¿Quieres que te ayude a configurar la integración una vez que tengas la API Key?**

