'use client'

import { motion } from 'framer-motion'
import { Send, Settings, Users, BarChart3, FileText, Building2, TrendingUp, CheckCircle } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: FileText,
      title: 'Cliente envía requerimientos',
      description: 'Envías tus necesidades de compra a través de nuestra plataforma intuitiva. Sin formularios complicados.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      illustration: 'form',
    },
    {
      number: '02',
      icon: Settings,
      title: 'Naova organiza y optimiza licitación',
      description: 'Nuestro sistema organiza automáticamente la licitación, categoriza proveedores y optimiza el proceso.',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      illustration: 'process',
    },
    {
      number: '03',
      icon: Building2,
      title: 'Proveedores compiten estratégicamente',
      description: 'Los proveedores precalificados compiten de manera transparente, ofreciendo las mejores condiciones.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      illustration: 'competition',
    },
    {
      number: '04',
      icon: TrendingUp,
      title: 'Cliente obtiene ahorros y reportes',
      description: 'Recibes propuestas optimizadas, reportes detallados y ahorros medibles en tiempo y costos.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      illustration: 'results',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section id="how-it-works" className="section-padding bg-gradient-to-br from-purple-100 to-purple-200">
      <div className="container-max">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Cómo funciona Naova
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-800 max-w-3xl mx-auto"
          >
            Un proceso simple y eficiente en 4 pasos que transforma 
            la manera en que gestionas tus compras industriales
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="space-y-12"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                  <span className="text-6xl font-bold text-gray-200">
                    {step.number}
                  </span>
                  <div className={`w-12 h-12 ${step.bgColor} rounded-xl flex items-center justify-center`}>
                    <step.icon className={`h-6 w-6 ${step.color}`} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-800 leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>

              {/* Visual */}
              <div className="flex-1 max-w-md">
                <div className={`${step.bgColor} rounded-2xl p-8 text-center`}>
                  <div className={`w-20 h-20 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-white shadow-soft`}>
                    <step.icon className={`h-10 w-10 ${step.color}`} />
                  </div>
                  
                  {/* Ilustraciones específicas para cada paso */}
                  {step.illustration === 'form' && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-soft">
                        <div className="space-y-2">
                          <div className="h-2 bg-blue-200 rounded w-full"></div>
                          <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                          <div className="h-2 bg-blue-200 rounded w-1/2"></div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <div className="w-8 h-6 bg-blue-100 rounded text-xs flex items-center justify-center">📝</div>
                          <div className="w-8 h-6 bg-blue-100 rounded text-xs flex items-center justify-center">📎</div>
                          <div className="w-8 h-6 bg-blue-100 rounded text-xs flex items-center justify-center">📊</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">Formulario inteligente</div>
                    </div>
                  )}

                  {step.illustration === 'process' && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-soft">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div className="h-1.5 bg-green-200 rounded flex-1"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <div className="h-1.5 bg-yellow-200 rounded flex-1"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <div className="h-1.5 bg-blue-200 rounded flex-1"></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">Proceso automatizado</div>
                    </div>
                  )}

                  {step.illustration === 'competition' && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-soft">
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="bg-purple-100 rounded p-2 text-center">
                            <div className="text-xs">🏭</div>
                            <div className="text-xs font-medium">A</div>
                          </div>
                          <div className="bg-purple-100 rounded p-2 text-center">
                            <div className="text-xs">🏢</div>
                            <div className="text-xs font-medium">B</div>
                          </div>
                          <div className="bg-purple-100 rounded p-2 text-center">
                            <div className="text-xs">🏗️</div>
                            <div className="text-xs font-medium">C</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">Competencia estratégica</div>
                    </div>
                  )}

                  {step.illustration === 'results' && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-soft">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs font-semibold text-orange-600">$45,230</div>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 bg-orange-200 rounded w-full"></div>
                          <div className="h-1.5 bg-orange-200 rounded w-3/4"></div>
                          <div className="h-1.5 bg-orange-200 rounded w-1/2"></div>
                        </div>
                        <div className="mt-2 flex justify-center">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">Resultados medibles</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
