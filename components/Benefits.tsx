'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Brain, BookOpen, FileText, TrendingUp, BarChart3 } from 'lucide-react'

const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Ahorro en tiempo de gestión',
      description: 'Reduce hasta 70% el tiempo dedicado a procesos de compra manuales.',
    },
    {
      icon: Brain,
      title: 'Estrategia de compras más inteligente',
      description: 'Análisis de datos y recomendaciones basadas en inteligencia artificial.',
    },
    {
      icon: BookOpen,
      title: 'Cero entrenamiento requerido',
      description: 'Interfaz intuitiva que se adapta a tu flujo de trabajo existente.',
    },
    {
      icon: FileText,
      title: 'Reportes claros y accionables',
      description: 'Dashboards en tiempo real con métricas clave y insights accionables.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="section-padding bg-gradient-to-br from-white to-purple-50">
      <div className="container-max">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Content */}
          <div>
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Beneficios adicionales que marcan la diferencia
            </motion.h2>
            
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-800 mb-8 leading-relaxed"
            >
              Más allá de los ahorros en costos, Naova te ofrece ventajas 
              estratégicas que transforman tu operación de compras.
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="space-y-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-800 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8">
              {/* Dashboard mockup */}
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">Dashboard</h4>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-primary">$45K</div>
                    <div className="text-sm text-gray-500">Ahorrado</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-secondary">23</div>
                    <div className="text-sm text-gray-500">Procesos</div>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Eficiencia</span>
                      <span className="text-primary font-semibold">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Tiempo ahorrado</span>
                      <span className="text-secondary font-semibold">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full w-3/5"></div>
                    </div>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Actividad reciente</h5>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Proceso #{i} completado</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-secondary" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Benefits
