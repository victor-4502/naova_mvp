'use client'

import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export type PipelineStage =
  | 'new_request'
  | 'needs_info'
  | 'finding_suppliers'
  | 'quotes_in_progress'
  | 'selecting_quote'
  | 'purchase_in_progress'
  | 'delivered'
  | 'closed'

interface PipelineStep {
  id: PipelineStage
  label: string
  description: string
  icon: React.ReactNode
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'new_request',
    label: 'Nueva Solicitud',
    description: 'Solicitud recibida del cliente',
    icon: <Circle className="h-5 w-5" />,
  },
  {
    id: 'needs_info',
    label: 'Obteniendo Información',
    description: 'Comunicándonos con el cliente para obtener todos los detalles',
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    id: 'finding_suppliers',
    label: 'Buscando Proveedores',
    description: 'Identificando los mejores proveedores para esta solicitud',
    icon: <Circle className="h-5 w-5" />,
  },
  {
    id: 'quotes_in_progress',
    label: 'Solicitando Cotizaciones',
    description: 'Enviando RFQ a proveedores y esperando respuestas',
    icon: <Clock className="h-5 w-5" />,
  },
  {
    id: 'selecting_quote',
    label: 'Cliente Eligiendo',
    description: 'Mostrando cotizaciones al cliente para que elija',
    icon: <Circle className="h-5 w-5" />,
  },
  {
    id: 'purchase_in_progress',
    label: 'Orden de Compra',
    description: 'Procesando la orden de compra seleccionada',
    icon: <Circle className="h-5 w-5" />,
  },
  {
    id: 'delivered',
    label: 'Entregado',
    description: 'Producto entregado al cliente',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    id: 'closed',
    label: 'Cerrado',
    description: 'Proceso completado',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
]

interface RequestPipelineProps {
  currentStage: PipelineStage
  className?: string
}

export function RequestPipeline({ currentStage, className = '' }: RequestPipelineProps) {
  const currentIndex = PIPELINE_STEPS.findIndex((step) => step.id === currentStage)

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Progreso del Proceso</h3>
      
      <div className="relative">
        {/* Línea de progreso */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200">
          <motion.div
            className="absolute top-0 left-0 w-full bg-primary"
            initial={{ height: '0%' }}
            animate={{ height: `${(currentIndex / (PIPELINE_STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
            style={{ height: `${(currentIndex / (PIPELINE_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Pasos */}
        <div className="space-y-8">
          {PIPELINE_STEPS.map((step, index) => {
            const isActive = index === currentIndex
            const isCompleted = index < currentIndex
            const isUpcoming = index > currentIndex

            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Icono */}
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'bg-primary border-primary text-white'
                      : isActive
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <div className="flex items-center justify-center">{step.icon}</div>
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1 pt-2">
                  <div
                    className={`font-semibold mb-1 ${
                      isActive
                        ? 'text-primary text-lg'
                        : isCompleted
                          ? 'text-gray-900'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                    {isActive && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        Actual
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      isActive ? 'text-gray-700' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

