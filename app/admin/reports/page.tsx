'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Building2, 
  TrendingUp, 
  ArrowLeft,
  LogOut,
  Download,
  RefreshCw,
  AlertTriangle,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import KPIWidget from '@/components/KPIWidget'
import ReportCard from '@/components/ReportCard'
import ChartWrapper from '@/components/ChartWrapper'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts'

interface GlobalReportData {
  periodo: {
    inicio: string
    fin: string
    meses: number
  }
  kpis: {
    totalLicitaciones: number
    licitacionesActivas: number
    licitacionesCerradas: number
    clientesActivos: number
    proveedoresActivos: number
    montoTotalTransacciones: number
    ahorroTotalGenerado: number
    ahorroPromedio: number
  }
  tendencias: {
    crecimientoLicitaciones: number
    crecimientoClientes: number
    crecimientoProveedores: number
    tendenciaAhorro: number
  }
  distribucionPorCliente: Array<{
    cliente: string
    licitaciones: number
    monto: number
    ahorro: number
  }>
  distribucionPorCategoria: Array<{
    categoria: string
    licitaciones: number
    monto: number
    participacion: number
  }>
  topProveedores: Array<{
    proveedor: string
    licitaciones: number
    monto: number
    tasaExito: number
  }>
  metricasTemporales: {
    licitacionesPorMes: Array<{
      mes: string
      licitaciones: number
      monto: number
    }>
    ahorroPorMes: Array<{
      mes: string
      ahorro: number
      porcentaje: number
    }>
  }
  alertas: Array<{
    tipo: string
    mensaje: string
    severidad: string
    fecha: string
  }>
  predicciones: {
    proximoMes: {
      licitacionesEsperadas: number
      montoEsperado: number
      ahorroEsperado: number
    }
    proximos3Meses: {
      licitacionesEsperadas: number
      montoEsperado: number
      ahorroEsperado: number
    }
  }
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export default function AdminReports() {
  const [reportData, setReportData] = useState<GlobalReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchReportData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/reports/resumenGlobal')
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchReportData()
  }, [])

  const handleRefresh = () => {
    fetchReportData()
  }

  const handleExport = () => {
    // TODO: Implementar exportación
    console.log('Exporting global report...')
  }

  const getSeverityColor = (severidad: string) => {
    switch (severidad) {
      case 'alta': return 'text-red-600 bg-red-50'
      case 'media': return 'text-yellow-600 bg-yellow-50'
      case 'baja': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <KPIWidget
                key={i}
                title="Cargando..."
                value="--"
                icon={BarChart3}
                loading={true}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar reportes</h2>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Reportes Globales</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Exportar
              </button>
              <button 
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  window.location.href = '/login'
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* KPIs Globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPIWidget
            title="Total Licitaciones"
            value={reportData.kpis.totalLicitaciones}
            change={reportData.tendencias.crecimientoLicitaciones}
            changeType="positive"
            icon={BarChart3}
            iconColor="text-blue-500"
            subtitle={`${reportData.kpis.licitacionesActivas} activas`}
          />
          <KPIWidget
            title="Clientes Activos"
            value={reportData.kpis.clientesActivos}
            change={reportData.tendencias.crecimientoClientes}
            changeType="positive"
            icon={Users}
            iconColor="text-green-500"
            subtitle="Últimos 30 días"
          />
          <KPIWidget
            title="Proveedores Activos"
            value={reportData.kpis.proveedoresActivos}
            change={reportData.tendencias.crecimientoProveedores}
            changeType="positive"
            icon={Building2}
            iconColor="text-purple-500"
            subtitle="Participando activamente"
          />
          <KPIWidget
            title="Ahorro Generado"
            value={`$${reportData.kpis.ahorroTotalGenerado.toLocaleString()}`}
            change={reportData.tendencias.tendenciaAhorro}
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-orange-500"
            subtitle={`${reportData.kpis.ahorroPromedio}% promedio`}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Licitaciones por Mes */}
          <ChartWrapper
            title="Licitaciones por Mes"
            description="Evolución de licitaciones y montos"
            height="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={reportData.metricasTemporales.licitacionesPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'licitaciones' ? value : `$${value.toLocaleString()}`,
                    name === 'licitaciones' ? 'Licitaciones' : 'Monto'
                  ]}
                />
                <Bar yAxisId="left" dataKey="licitaciones" fill="#3B82F6" name="Licitaciones" />
                <Line yAxisId="right" type="monotone" dataKey="monto" stroke="#10B981" strokeWidth={2} name="Monto" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Distribución por Categoría */}
          <ChartWrapper
            title="Distribución por Categoría"
            description="Participación de cada categoría"
            height="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData.distribucionPorCategoria}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, participacion }) => `${categoria} (${participacion}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="monto"
                >
                  {reportData.distribucionPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Clientes */}
          <ReportCard
            title="Top Clientes por Volumen"
            description="Clientes con mayor participación"
            icon={Users}
            iconColor="text-green-500"
          >
            <div className="space-y-3">
              {reportData.distribucionPorCliente.slice(0, 5).map((cliente, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{cliente.cliente}</p>
                      <p className="text-sm text-gray-600">{cliente.licitaciones} licitaciones</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${cliente.monto.toLocaleString()}</p>
                    <p className="text-sm text-green-600">${cliente.ahorro.toLocaleString()} ahorro</p>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>

          {/* Top Proveedores */}
          <ReportCard
            title="Top Proveedores"
            description="Proveedores por rendimiento"
            icon={Building2}
            iconColor="text-purple-500"
          >
            <div className="space-y-3">
              {reportData.topProveedores.slice(0, 5).map((proveedor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{proveedor.proveedor}</p>
                    <p className="text-sm text-gray-600">{proveedor.licitaciones} licitaciones</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${proveedor.monto.toLocaleString()}</p>
                    <p className="text-sm text-purple-600">{proveedor.tasaExito}% éxito</p>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>
        </div>

        {/* Alertas e Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReportCard
            title="Alertas del Sistema"
            description="Notificaciones importantes"
            icon={AlertTriangle}
            iconColor="text-red-500"
          >
            <div className="space-y-3">
              {reportData.alertas.map((alerta, index) => (
                <div key={index} className={`p-3 rounded-lg ${getSeverityColor(alerta.severidad)}`}>
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alerta.mensaje}</p>
                      <p className="text-xs opacity-75 mt-1">{alerta.fecha}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>

          <ReportCard
            title="Predicciones"
            description="Proyecciones para los próximos meses"
            icon={Lightbulb}
            iconColor="text-yellow-500"
          >
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Próximo Mes</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">Licitaciones</p>
                    <p className="font-bold text-blue-900">{reportData.predicciones.proximoMes.licitacionesEsperadas}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Monto Esperado</p>
                    <p className="font-bold text-blue-900">${reportData.predicciones.proximoMes.montoEsperado.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Próximos 3 Meses</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-700">Licitaciones</p>
                    <p className="font-bold text-green-900">{reportData.predicciones.proximos3Meses.licitacionesEsperadas}</p>
                  </div>
                  <div>
                    <p className="text-green-700">Ahorro Esperado</p>
                    <p className="font-bold text-green-900">${reportData.predicciones.proximos3Meses.ahorroEsperado.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </ReportCard>
        </div>
      </main>
    </div>
  )
}
