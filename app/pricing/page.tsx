'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight, Users, Building2, BarChart3, Shield } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const plans = [
    {
      name: 'Básico',
      price: 'Desde $299',
      period: '/mes',
      description: 'Perfecto para pequeñas empresas',
      features: [
        'Hasta 5 licitaciones activas',
        'Hasta 3 usuarios',
        'Reportes básicos',
        'Soporte por email',
        'Integración con 1 proveedor'
      ],
      limitations: [
        'Sin análisis predictivo',
        'Reportes limitados'
      ],
      popular: false
    },
    {
      name: 'Profesional',
      price: 'Desde $599',
      period: '/mes',
      description: 'Ideal para empresas en crecimiento',
      features: [
        'Hasta 20 licitaciones activas',
        'Hasta 10 usuarios',
        'Reportes avanzados',
        'Análisis predictivo básico',
        'Soporte prioritario',
        'Integración con múltiples proveedores',
        'Exportación de datos'
      ],
      limitations: [],
      popular: true
    },
    {
      name: 'Empresarial',
      price: 'Personalizado',
      period: '',
      description: 'Para grandes organizaciones',
      features: [
        'Licitaciones ilimitadas',
        'Usuarios ilimitados',
        'Reportes personalizados',
        'IA avanzada y predicciones',
        'Soporte 24/7',
        'Integración completa',
        'API personalizada',
        'Consultoría especializada'
      ],
      limitations: [],
      popular: false
    }
  ]

  const benefits = [
    {
      icon: Users,
      title: 'Gestión de Usuarios',
      description: 'Control total sobre quién puede acceder y qué puede hacer en la plataforma'
    },
    {
      icon: Building2,
      title: 'Proveedores Verificados',
      description: 'Base de datos de proveedores previamente verificados y calificados'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avanzados',
      description: 'Reportes detallados y análisis predictivo para optimizar tus compras'
    },
    {
      icon: Shield,
      title: 'Seguridad Empresarial',
      description: 'Cumplimiento con estándares de seguridad y privacidad de datos'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                Naova
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Iniciar Sesión
              </Link>
              <Link 
                href="/login" 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Solicitar Demo
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Precios que se adaptan a tu
              <span className="text-primary"> negocio</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Desde pequeñas empresas hasta corporaciones, tenemos el plan perfecto 
              para optimizar tus procesos de compras y licitaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#contacto"
                className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center justify-center"
              >
                Contactar Ventas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/login"
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Ver Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Elige tu plan ideal
            </h2>
            <p className="text-xl text-gray-600">
              Todos los planes incluyen acceso completo a la plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                  plan.popular ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <li key={limitationIndex} className="flex items-start">
                      <span className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0">×</span>
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="#contacto"
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.name === 'Empresarial' ? 'Contactar Ventas' : 'Comenzar Prueba'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Naova?
            </h2>
            <p className="text-xl text-gray-600">
              Funcionalidades diseñadas para optimizar tus procesos de compras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para optimizar tus compras?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Contacta con nuestro equipo de ventas para obtener un presupuesto personalizado
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:ventas@naova.com"
                className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                ventas@naova.com
              </a>
              <a 
                href="tel:+1234567890"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                +1 (234) 567-890
              </a>
            </div>
            <p className="text-purple-200 mt-6">
              Respuesta garantizada en menos de 24 horas
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-white mb-4 inline-block">
              Naova
            </Link>
            <p className="text-gray-400">
              Optimizando procesos de compras para empresas de todos los tamaños
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
