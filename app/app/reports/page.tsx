'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Clock, 
  Package, 
  TrendingUp, 
  ArrowLeft,
  LogOut,
  Download,
  RefreshCw,
  FileText,
  Table
} from 'lucide-react'
import Link from 'next/link'
import KPIWidget from '@/components/KPIWidget'
import ReportCard from '@/components/ReportCard'
import ChartWrapper from '@/components/ChartWrapper'
import NotificationCenter from '@/components/NotificationCenter'
import { exportClientReport } from '@/lib/export-utils'
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
  Cell
} from 'recharts'

interface ReportData {
  cliente: {
    id: string
    nombre: string
    email: string
  }
  resumen: {
    totalCompras: number
    montoTotal: number
    ahorroTotal: number
    licitacionesActivas: number
    proveedoresFrecuentes: number
  }
  comprasPorMes: Array<{
    mes: string
    cantidad: number
    monto: number
    ahorro: number
  }>
  comprasPorProducto: Array<{
    producto: string
    cantidad: number
    monto: number
    frecuencia: number
  }>
  comprasPorProveedor: Array<{
    proveedor: string
    monto: number
    participacion: number
    calificacion: number
  }>
  tendencias: {
    crecimientoMensual: number
    ahorroPromedio: number
    frecuenciaCompra: number
    proximaCompraEstimada: string
  }
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function ClientReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchReportData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/reports/comprasPorCliente')
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

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    if (reportData) {
      try {
        exportClientReport(reportData, format)
      } catch (error) {
        console.error('Error exporting report:', error)
        alert('Error al exportar el reporte')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <KPIWidget
                key={i}
                title="Cargando..."
                value="--"
                icon={DollarSign}
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar reportes</h2>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/app/dashboard" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Reportes de Compras</h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Exportar
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport('excel')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Table className="h-4 w-4" />
                      Exportar a Excel
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Exportar a CSV
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Exportar a PDF
                    </button>
                  </div>
                </div>
              </div>
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
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPIWidget
            title="Ahorro Total"
            value={`$${reportData.resumen.ahorroTotal.toLocaleString()}`}
            change={reportData.tendencias.ahorroPromedio}
            changeType="positive"
            icon={DollarSign}
            iconColor="text-green-500"
            subtitle={`${reportData.tendencias.ahorroPromedio}% promedio`}
          />
          <KPIWidget
            title="Tiempo Promedio"
            value={`${reportData.tendencias.frecuenciaCompra} días`}
            change={reportData.tendencias.crecimientoMensual}
            changeType="positive"
            icon={Clock}
            iconColor="text-blue-500"
            subtitle="Entre compras"
          />
          <KPIWidget
            title="Productos Únicos"
            value={reportData.comprasPorProducto.length}
            icon={Package}
            iconColor="text-purple-500"
            subtitle="Diferentes productos"
          />
          <KPIWidget
            title="Crecimiento"
            value={`${reportData.tendencias.crecimientoMensual}%`}
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-orange-500"
            subtitle="Este mes"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Evolución de Compras */}
          <ChartWrapper
            title="Evolución de Compras"
            description="Compras y ahorros por mes"
            height="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData.comprasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${value.toLocaleString()}`, 
                    name === 'monto' ? 'Compras' : 'Ahorro'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="monto" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Compras"
                />
                <Line 
                  type="monotone" 
                  dataKey="ahorro" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Ahorro"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Distribución por Proveedor */}
          <ChartWrapper
            title="Distribución por Proveedor"
            description="Participación en compras"
            height="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData.comprasPorProveedor}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ proveedor, participacion }) => `${proveedor} (${participacion}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="monto"
                >
                  {reportData.comprasPorProveedor.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Productos más comprados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReportCard
            title="Productos más Comprados"
            description="Top productos por frecuencia"
            icon={Package}
            iconColor="text-purple-500"
          >
            <div className="space-y-3">
              {reportData.comprasPorProducto.slice(0, 5).map((producto, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{producto.producto}</p>
                    <p className="text-sm text-gray-600">{producto.cantidad} unidades</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${producto.monto.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{producto.frecuencia} compras</p>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>

          <ReportCard
            title="Próxima Compra Estimada"
            description="Basado en tu patrón de compras"
            icon={Clock}
            iconColor="text-blue-500"
          >
            <div className="text-center py-8">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {new Date(reportData.tendencias.proximaCompraEstimada).toLocaleDateString()}
              </div>
              <p className="text-gray-600 mb-4">
                Basado en tu frecuencia promedio de {reportData.tendencias.frecuenciaCompra} días
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Recomendación:</strong> Considera comprar antes de esta fecha para aprovechar 
                  las tendencias de precios actuales.
                </p>
              </div>
            </div>
          </ReportCard>
        </div>
      </main>
    </div>
  )
}
