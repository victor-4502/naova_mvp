'use client'

import { motion } from 'framer-motion'
import { Zap, DollarSign, TrendingUp } from 'lucide-react'

const ValueProps = () => {
  const valueProps = [
    {
      icon: Zap,
      title: 'Sin curva de aprendizaje',
      description: 'Nos adaptamos a la forma de trabajar del cliente. Integración transparente con tus procesos existentes.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: DollarSign,
      title: 'Gratis al inicio',
      description: '30 días de prueba sin costo. Sin compromisos, sin tarjetas de crédito. Empieza a ahorrar desde el primer día.',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      title: 'Resultados medibles',
      description: 'Ahorro en tiempo y costos con reportes claros y accionables. ROI visible desde el primer mes.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section id="value-props" className="section-padding bg-gradient-to-br from-white to-purple-50">
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
            ¿Por qué elegir Naova?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-800 max-w-3xl mx-auto"
          >
            Tres pilares fundamentales que nos convierten en tu mejor opción para 
            optimizar las compras industriales
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="text-center p-8 rounded-2xl hover:shadow-medium transition-all duration-300"
            >
              <div className={`w-16 h-16 ${prop.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <prop.icon className={`h-8 w-8 ${prop.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {prop.title}
              </h3>
              
              <p className="text-gray-800 leading-relaxed">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ValueProps
