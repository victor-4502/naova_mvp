'use client'

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'

const Pricing = () => {
  const plans = [
    {
      name: 'Gratuito',
      price: '$0',
      period: '30 días',
      description: 'Perfecto para probar Naova',
      features: [
        'Hasta 5 procesos de compra',
        'Acceso a dashboard básico',
        'Soporte por email',
        'Reportes básicos',
        'Integración con 1 sistema',
      ],
      cta: 'Empezar prueba',
      popular: false,
      color: 'border-gray-200',
      bgColor: 'bg-white',
    },
    {
      name: 'Básico',
      price: '$299',
      period: 'por mes',
      description: 'Ideal para empresas medianas',
      features: [
        'Hasta 50 procesos de compra',
        'Dashboard completo',
        'Soporte prioritario',
        'Reportes avanzados',
        'Integración con 3 sistemas',
        'Análisis de ahorros',
        'Capacitación incluida',
      ],
      cta: 'Comenzar plan',
      popular: true,
      color: 'border-primary',
      bgColor: 'bg-white',
    },
    {
      name: 'Empresarial',
      price: 'Personalizado',
      period: 'consulta',
      description: 'Para grandes corporaciones',
      features: [
        'Procesos ilimitados',
        'Dashboard personalizado',
        'Soporte dedicado 24/7',
        'Reportes personalizados',
        'Integraciones ilimitadas',
        'Análisis predictivo',
        'Capacitación premium',
        'API personalizada',
        'SLA garantizado',
      ],
      cta: 'Contactar ventas',
      popular: false,
      color: 'border-gray-200',
      bgColor: 'bg-gray-50',
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
    <section id="pricing" className="section-padding bg-gradient-to-br from-purple-100 to-purple-200">
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
            Planes y Precios
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-800 max-w-3xl mx-auto"
          >
            Elige el plan que mejor se adapte a las necesidades de tu empresa. 
            Todos los planes incluyen soporte y actualizaciones.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`relative ${plan.bgColor} rounded-2xl border-2 ${plan.color} p-8 shadow-soft hover:shadow-medium transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Más Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-800 mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-800 ml-2">
                    {plan.period}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-800 mb-4">
            ¿Necesitas un plan personalizado? Contáctanos para discutir tus necesidades específicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Check className="h-4 w-4 text-secondary" />
              Sin compromisos
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Check className="h-4 w-4 text-secondary" />
              Cancelación en cualquier momento
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Check className="h-4 w-4 text-secondary" />
              Soporte incluido
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
