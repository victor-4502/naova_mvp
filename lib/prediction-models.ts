// Modelos de predicción simples para análisis de compras
export interface PriceDataPoint {
  date: string
  price: number
  quantity: number
  category: string
  seasonality?: number
}

export interface PredictionResult {
  predictedPrice: number
  confidence: number
  trend: 'ascending' | 'descending' | 'stable'
  factors: string[]
  nextPrediction?: number
}

export interface DemandPrediction {
  predictedDemand: number
  confidence: number
  seasonality: 'high' | 'medium' | 'low'
  recommendedAction: string
}

// Modelo de regresión lineal simple para predicción de precios
export class LinearRegressionPredictor {
  private data: PriceDataPoint[]
  private slope: number = 0
  private intercept: number = 0
  private rSquared: number = 0

  constructor(data: PriceDataPoint[]) {
    this.data = data
    this.calculateRegression()
  }

  private calculateRegression() {
    if (this.data.length < 2) return

    const n = this.data.length
    const dates = this.data.map((_, index) => index)
    const prices = this.data.map(d => d.price)

    // Calcular medias
    const meanX = dates.reduce((a, b) => a + b, 0) / n
    const meanY = prices.reduce((a, b) => a + b, 0) / n

    // Calcular pendiente y intercepto
    let numerator = 0
    let denominator = 0

    for (let i = 0; i < n; i++) {
      const xDiff = dates[i] - meanX
      const yDiff = prices[i] - meanY
      numerator += xDiff * yDiff
      denominator += xDiff * xDiff
    }

    this.slope = denominator === 0 ? 0 : numerator / denominator
    this.intercept = meanY - this.slope * meanX

    // Calcular R²
    let totalSumSquares = 0
    let residualSumSquares = 0

    for (let i = 0; i < n; i++) {
      const actual = prices[i]
      const predicted = this.slope * dates[i] + this.intercept
      const yDiff = actual - meanY
      
      totalSumSquares += yDiff * yDiff
      residualSumSquares += (actual - predicted) * (actual - predicted)
    }

    this.rSquared = 1 - (residualSumSquares / totalSumSquares)
  }

  predict(futurePeriods: number): PredictionResult {
    const lastIndex = this.data.length - 1
    const predictedPrice = this.slope * (lastIndex + futurePeriods) + this.intercept
    const confidence = Math.max(0, Math.min(1, this.rSquared))
    
    let trend: 'ascending' | 'descending' | 'stable' = 'stable'
    if (this.slope > 0.1) trend = 'ascending'
    else if (this.slope < -0.1) trend = 'descending'

    const factors = this.analyzeFactors()

    return {
      predictedPrice: Math.max(0, predictedPrice),
      confidence,
      trend,
      factors,
      nextPrediction: this.slope * (lastIndex + 1) + this.intercept
    }
  }

  private analyzeFactors(): string[] {
    const factors: string[] = []
    
    // Análisis de tendencia
    if (this.slope > 0.2) {
      factors.push('Inflación general')
      factors.push('Aumento de demanda')
    } else if (this.slope < -0.2) {
      factors.push('Competencia intensa')
      factors.push('Mejoras en eficiencia')
    }

    // Análisis de estacionalidad
    const seasonalPattern = this.analyzeSeasonality()
    if (seasonalPattern) {
      factors.push(seasonalPattern)
    }

    // Análisis de volatilidad
    const volatility = this.calculateVolatility()
    if (volatility > 0.3) {
      factors.push('Alta volatilidad de precios')
    }

    return factors
  }

  private analyzeSeasonality(): string | null {
    if (this.data.length < 12) return null

    const monthlyAverages = new Array(12).fill(0)
    const monthlyCounts = new Array(12).fill(0)

    this.data.forEach(point => {
      const month = new Date(point.date).getMonth()
      monthlyAverages[month] += point.price
      monthlyCounts[month]++
    })

    // Calcular promedios mensuales
    for (let i = 0; i < 12; i++) {
      if (monthlyCounts[i] > 0) {
        monthlyAverages[i] /= monthlyCounts[i]
      }
    }

    const overallAverage = monthlyAverages.reduce((a, b) => a + b, 0) / 12
    const maxDeviation = Math.max(...monthlyAverages.map(avg => Math.abs(avg - overallAverage)))
    
    if (maxDeviation > overallAverage * 0.2) {
      return 'Patrón estacional detectado'
    }

    return null
  }

  private calculateVolatility(): number {
    if (this.data.length < 2) return 0

    const returns = []
    for (let i = 1; i < this.data.length; i++) {
      const returnRate = (this.data[i].price - this.data[i-1].price) / this.data[i-1].price
      returns.push(returnRate)
    }

    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length
    
    return Math.sqrt(variance)
  }
}

// Modelo de predicción de demanda basado en patrones históricos
export class DemandPredictor {
  private data: PriceDataPoint[]
  private frequency: number = 0
  private seasonality: number = 0

  constructor(data: PriceDataPoint[]) {
    this.data = data
    this.analyzePatterns()
  }

  private analyzePatterns() {
    if (this.data.length < 3) return

    // Calcular frecuencia promedio entre compras
    const intervals = []
    for (let i = 1; i < this.data.length; i++) {
      const prevDate = new Date(this.data[i-1].date)
      const currDate = new Date(this.data[i].date)
      const daysDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      intervals.push(daysDiff)
    }

    this.frequency = intervals.reduce((a, b) => a + b, 0) / intervals.length

    // Calcular estacionalidad
    this.seasonality = this.calculateSeasonality()
  }

  private calculateSeasonality(): number {
    if (this.data.length < 12) return 0

    const monthlyData = new Array(12).fill(0)
    const monthlyCounts = new Array(12).fill(0)

    this.data.forEach(point => {
      const month = new Date(point.date).getMonth()
      monthlyData[month] += point.quantity
      monthlyCounts[month]++
    })

    // Calcular promedios mensuales
    for (let i = 0; i < 12; i++) {
      if (monthlyCounts[i] > 0) {
        monthlyData[i] /= monthlyCounts[i]
      }
    }

    const overallAverage = monthlyData.reduce((a, b) => a + b, 0) / 12
    const maxValue = Math.max(...monthlyData)
    const minValue = Math.min(...monthlyData.filter(val => val > 0))

    return (maxValue - minValue) / overallAverage
  }

  predict(futureDays: number): DemandPrediction {
    const lastDate = new Date(this.data[this.data.length - 1].date)
    const nextPurchaseDate = new Date(lastDate.getTime() + this.frequency * 24 * 60 * 60 * 1000)
    const daysUntilNext = Math.ceil((nextPurchaseDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    let predictedDemand = 0
    let confidence = 0.5
    let seasonality: 'high' | 'medium' | 'low' = 'low'

    if (this.frequency > 0) {
      // Estimar demanda basada en frecuencia histórica
      const avgQuantity = this.data.reduce((sum, point) => sum + point.quantity, 0) / this.data.length
      predictedDemand = avgQuantity

      // Ajustar por estacionalidad
      const currentMonth = new Date().getMonth()
      const monthlyAvg = this.getMonthlyAverage(currentMonth)
      if (monthlyAvg > 0) {
        predictedDemand = monthlyAvg
      }

      // Calcular confianza basada en consistencia de datos
      confidence = Math.min(0.9, Math.max(0.3, this.data.length / 20))
    }

    // Determinar nivel de estacionalidad
    if (this.seasonality > 0.5) seasonality = 'high'
    else if (this.seasonality > 0.2) seasonality = 'medium'

    const recommendedAction = this.getRecommendedAction(daysUntilNext, predictedDemand, seasonality)

    return {
      predictedDemand: Math.round(predictedDemand),
      confidence,
      seasonality,
      recommendedAction
    }
  }

  private getMonthlyAverage(month: number): number {
    const monthlyData = this.data.filter(point => new Date(point.date).getMonth() === month)
    if (monthlyData.length === 0) return 0
    return monthlyData.reduce((sum, point) => sum + point.quantity, 0) / monthlyData.length
  }

  private getRecommendedAction(daysUntilNext: number, predictedDemand: number, seasonality: string): string {
    if (daysUntilNext < 7) {
      return 'Compra urgente recomendada - próxima compra en menos de una semana'
    } else if (daysUntilNext < 30) {
      return 'Planificar compra en las próximas 2-3 semanas'
    } else if (seasonality === 'high') {
      return 'Considerar compra anticipada debido a estacionalidad alta'
    } else {
      return 'Mantener patrón de compra actual'
    }
  }
}

// Función principal para generar predicciones
export function generatePredictions(data: PriceDataPoint[], type: 'price' | 'demand' = 'price') {
  if (data.length < 3) {
    return {
      error: 'Se necesitan al menos 3 puntos de datos para predicciones confiables'
    }
  }

  if (type === 'price') {
    const predictor = new LinearRegressionPredictor(data)
    return predictor.predict(3) // Predecir 3 períodos adelante
  } else {
    const predictor = new DemandPredictor(data)
    return predictor.predict(30) // Predecir demanda para los próximos 30 días
  }
}

// Función para análisis de tendencias de mercado
export function analyzeMarketTrends(data: PriceDataPoint[]) {
  const trends = {
    overall: 'stable' as 'ascending' | 'descending' | 'stable',
    volatility: 0,
    seasonality: 0,
    recommendations: [] as string[]
  }

  if (data.length < 2) return trends

  // Análisis de tendencia general
  const firstPrice = data[0].price
  const lastPrice = data[data.length - 1].price
  const priceChange = (lastPrice - firstPrice) / firstPrice

  if (priceChange > 0.1) trends.overall = 'ascending'
  else if (priceChange < -0.1) trends.overall = 'descending'

  // Análisis de volatilidad
  const returns = []
  for (let i = 1; i < data.length; i++) {
    const returnRate = (data[i].price - data[i-1].price) / data[i-1].price
    returns.push(returnRate)
  }
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length
  trends.volatility = Math.sqrt(variance)

  // Generar recomendaciones
  if (trends.overall === 'ascending') {
    trends.recommendations.push('Considerar compra anticipada - precios en tendencia alcista')
  } else if (trends.overall === 'descending') {
    trends.recommendations.push('Posponer compra - precios en tendencia bajista')
  }

  if (trends.volatility > 0.2) {
    trends.recommendations.push('Alta volatilidad detectada - considerar estrategias de cobertura')
  }

  return trends
}
