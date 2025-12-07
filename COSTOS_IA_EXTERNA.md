# 💰 Costos de IA Externa - Explicación Completa

## 📊 Modelos de Precio Más Comunes

### 1. **OpenAI (GPT-4, GPT-3.5)**

#### Modelos Disponibles:

**GPT-4o-mini** (Más barato, recomendado):
- Input: **$0.15 por 1M tokens** (~$0.00015 por 1K tokens)
- Output: **$0.60 por 1M tokens** (~$0.0006 por 1K tokens)
- ✅ Bueno para: Clasificación, extracción simple

**GPT-4o** (Más caro, más inteligente):
- Input: **$2.50 por 1M tokens** (~$0.0025 por 1K tokens)
- Output: **$10.00 por 1M tokens** (~$0.01 por 1K tokens)
- ✅ Bueno para: Análisis complejos, mensajes personalizados

**GPT-3.5-turbo** (Más antiguo, barato):
- Input: **$0.50 por 1M tokens** (~$0.0005 por 1K tokens)
- Output: **$1.50 por 1M tokens** (~$0.0015 por 1K tokens)

---

## 💵 Cálculo de Costos Reales

### Ejemplo: Procesar un Mensaje

**Mensaje del cliente:**
```
"Necesito servicio de mantenimiento para mi compresor de aire"
```

**Prompt que enviamos a la IA (~400 tokens):**
```json
{
  "messages": [{
    "role": "user",
    "content": "Analiza este mensaje: 'Necesito servicio de mantenimiento para mi compresor de aire'. Extrae: categoría, campos presentes, campos faltantes."
  }]
}
```

**Respuesta de la IA (~200 tokens):**
```json
{
  "category": "servicios",
  "extractedFields": {
    "equipmentType": "Compresor de aire"
  },
  "missingFields": ["serviceScope", "deliveryLocation"]
}
```

---

### Costos por Mensaje (GPT-4o-mini):

- **Input:** 400 tokens × $0.00015/1K = **$0.00006**
- **Output:** 200 tokens × $0.0006/1K = **$0.00012**
- **Total por mensaje:** **~$0.00018** (menos de 1 centavo)

**Redondeado para facilidad:** **~$0.001 por mensaje** (1 centavo)

---

## 📈 Escenarios de Uso

### Escenario 1: Pequeña Empresa (10 mensajes/día)
- Mensajes/día: 10
- Costo/día: 10 × $0.001 = **$0.01**
- Costo/mes: $0.01 × 30 = **~$0.30/mes**
- Costo/año: **~$3.60/año**

### Escenario 2: Empresa Mediana (100 mensajes/día)
- Mensajes/día: 100
- Costo/día: 100 × $0.001 = **$0.10**
- Costo/mes: $0.10 × 30 = **~$3/mes**
- Costo/año: **~$36/año**

### Escenario 3: Empresa Grande (1,000 mensajes/día)
- Mensajes/día: 1,000
- Costo/día: 1,000 × $0.001 = **$1**
- Costo/mes: $1 × 30 = **~$30/mes**
- Costo/año: **~$360/año**

---

## 🎯 Factores que Afectan el Costo

### 1. **Tamaño del Prompt**
- Más contexto = más tokens input = más costo
- Mensajes largos = más tokens = más costo

### 2. **Complejidad de la Tarea**
- Extracción simple: ~200 tokens output
- Análisis complejo: ~500-1000 tokens output
- Generación de mensajes: ~300-600 tokens output

### 3. **Modelo Elegido**
- GPT-4o-mini: Más barato
- GPT-4o: Más caro pero más preciso

---

## 💡 Optimizaciones para Reducir Costos

### 1. **Usar Modelo Más Barato**
- GPT-4o-mini es suficiente para la mayoría de casos
- Ahorro: 6-10x más barato que GPT-4o

### 2. **Prompts Más Cortos**
- Solo enviar información necesaria
- Ahorro: 20-30% de tokens

### 3. **Cache de Respuestas**
- Si el mismo tipo de mensaje aparece frecuentemente, cachear
- Ahorro: 50-80% en mensajes repetitivos

### 4. **Sistema Híbrido**
- Usar IA solo para casos complejos
- Usar reglas para casos simples
- Ahorro: 60-70% del costo total

### 5. **Límites de Rate**
- Limitar cuántos mensajes por día usan IA
- Ahorro: Control directo del gasto

---

## 🔧 Configuración Recomendada para Naova

### Sistema Híbrido (Mejor Balance):

```typescript
// Configuración por cliente o por caso
const USE_AI = {
  // Casos simples → Reglas (gratis)
  simple: false,
  
  // Casos complejos → IA ($0.001/mensaje)
  complex: true,
  
  // Límite diario por cliente
  dailyLimit: 50, // mensajes/día
  
  // Modelo a usar
  model: 'gpt-4o-mini' // más barato
}
```

**Resultado:**
- 70% de mensajes usan reglas (gratis)
- 30% de mensajes usan IA (costo)
- **Costo real: ~30% del calculado arriba**

---

## 📊 Comparación de Costos Mensuales

| Mensajes/Día | Solo Reglas | Solo IA (mini) | Híbrido (70/30) |
|--------------|-------------|----------------|-----------------|
| 10 | $0 | $0.30 | $0.09 |
| 100 | $0 | $3.00 | $0.90 |
| 1,000 | $0 | $30.00 | $9.00 |
| 10,000 | $0 | $300.00 | $90.00 |

**Híbrido = Usa IA solo cuando es necesario**

---

## 💳 Cómo Te Cobran

### OpenAI:
1. **Creas cuenta** en platform.openai.com
2. **Agregas tarjeta** de crédito
3. **Consumo automático** - te cobran al final del mes
4. **Límites opcionales** - puedes poner límite de gasto diario/mensual

### Facturación:
- **Período:** Mensual
- **Pago:** Automático con tarjeta
- **Factura:** Disponible en la plataforma
- **Límites:** Puedes configurar alertas y límites de gasto

---

## 🎯 Recomendación para Naova

### Fase 1: MVP (Ahora)
- ✅ **Solo reglas** (gratis)
- Funciona bien para la mayoría de casos
- Sin costos adicionales

### Fase 2: Crecimiento (100+ mensajes/día)
- 🔄 **Sistema híbrido**
- IA solo para casos complejos
- Costo estimado: **$1-3/mes**

### Fase 3: Producción (1,000+ mensajes/día)
- 🤖 **IA mejorada** (más uso)
- Personalización por cliente
- Costo estimado: **$10-30/mes**

---

## 📝 Ejemplo de Implementación con Límites

```typescript
// Configuración de costo
const AI_CONFIG = {
  enabled: process.env.USE_AI === 'true',
  model: 'gpt-4o-mini',
  maxDailyRequests: 100, // Límite por día
  costPerRequest: 0.001, // $0.001 por request
  monthlyBudget: 10, // $10/mes máximo
}

// Tracking de gastos
let dailyRequests = 0
let monthlySpent = 0

async function processWithAI(content: string) {
  // Verificar límites
  if (dailyRequests >= AI_CONFIG.maxDailyRequests) {
    console.log('Límite diario alcanzado, usando reglas')
    return fallbackToRules(content)
  }
  
  if (monthlySpent >= AI_CONFIG.monthlyBudget) {
    console.log('Presupuesto mensual alcanzado, usando reglas')
    return fallbackToRules(content)
  }
  
  // Procesar con IA
  dailyRequests++
  monthlySpent += AI_CONFIG.costPerRequest
  
  return await callOpenAI(content)
}
```

---

## ✅ Conclusión

### Costos Reales Estimados:

| Escenario | Costo/Mes |
|-----------|-----------|
| Solo reglas (actual) | **$0** |
| 100 mensajes/día con IA | **~$3/mes** |
| 1,000 mensajes/día con IA | **~$30/mes** |
| Híbrido (70% reglas, 30% IA) | **~$1-10/mes** |

**Para empezar, el costo es muy bajo. Puedes controlarlo con límites.**

---

**¿Quieres que configure un sistema híbrido con límites de costo?**

