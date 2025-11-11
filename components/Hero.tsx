'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero" className="min-h-screen flex items-center bg-gradient-to-br from-purple-50 to-purple-100 pt-20">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Simplifica tus{' '}
              <span className="text-primary">compras de indirectos</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-800 leading-relaxed max-w-2xl"
            >
              Naova es tu socio estratégico en compras industriales. Sin curva de aprendizaje,
              sin costo inicial, con resultados medibles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                Empieza gratis hoy
                <ArrowRight className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('pricing')}
                className="flex items-center justify-center gap-2 px-8 py-4 text-gray-600 hover:text-primary transition-colors duration-300 border border-primary/40 rounded-lg"
              >
                Conoce cómo trabajamos
              </motion.button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-base text-gray-700 leading-relaxed max-w-2xl"
            >
              Confía en especialistas que integran proveedores, licitaciones y seguimiento continuo para que cada compra llegue a tiempo.
            </motion.p>
          </motion.div>

          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Laptop mockup */}
              <div className="bg-gray-800 rounded-lg p-4 shadow-2xl">
                <div className="bg-white rounded-md overflow-hidden">
                  <div className="bg-gray-100 h-8 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="p-6">
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">N</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Dashboard Naova</h3>
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-blue-600 font-medium">Ahorro Total</div>
                        <div className="text-lg font-bold text-blue-700">$45,230</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-xs text-green-600 font-medium">Procesos</div>
                        <div className="text-lg font-bold text-green-700">23</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-xs text-purple-600 font-medium">Eficiencia</div>
                        <div className="text-lg font-bold text-purple-700">87%</div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Actividad Reciente</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div className="text-xs text-gray-600">Licitación #001 completada</div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <div className="text-xs text-gray-600">Nuevo proveedor agregado</div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <div className="text-xs text-gray-600">Reporte mensual generado</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile mockup */}
              <div className="absolute -bottom-8 -right-8 bg-gray-800 rounded-2xl p-3 shadow-2xl">
                <div className="bg-white rounded-xl overflow-hidden w-48 h-80">
                  <div className="bg-gray-100 h-8 flex items-center justify-center">
                    <div className="w-16 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="p-4">
                    {/* Mobile Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">N</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Naova</span>
                    </div>

                    {/* Mobile Stats */}
                    <div className="space-y-3 mb-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <div className="text-xs text-blue-600">Ahorro Hoy</div>
                        <div className="text-sm font-bold text-blue-700">$2,340</div>
                      </div>
                      <div className="bg-green-50 p-2 rounded-lg">
                        <div className="text-xs text-green-600">Procesos Activos</div>
                        <div className="text-sm font-bold text-green-700">5</div>
                      </div>
                    </div>

                    {/* Mobile Activity */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700">Últimas Actividades</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">Licitación completada</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">Nuevo proveedor</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">Reporte listo</span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile CTA */}
                    <div className="mt-4">
                      <div className="bg-primary text-white text-xs text-center py-2 rounded-lg font-medium">
                        Ver Dashboard
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl -z-10 transform rotate-3"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

