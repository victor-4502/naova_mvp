'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PreciosPage() {
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  const plans = [
    {
      name: 'Trial Gratuito',
      price: 'Gratis',
      period: '30 días',
      description: 'Perfecto para probar Naova sin compromiso',
      features: [
        'Hasta 5 procesos de compra',
        'Acceso a dashboard básico',
        'Soporte por email',
        'Reportes básicos',
        'Integración con 1 sistema',
        'Sin tarjeta de crédito requerida',
      ],
      cta: 'Contactar a ventas',
      popular: false,
      color: 'border-gray-300',
      bgColor: 'bg-white',
    },
    {
      name: 'Plan Básico',
      price: 'Desde $299',
      period: 'por mes',
      description: 'Ideal para empresas medianas',
      features: [
        'Hasta 50 procesos de compra',
        'Dashboard completo con 5 reportes',
        'Soporte prioritario',
        'Reportes avanzados + export CSV/PDF',
        'Integración con 3 sistemas',
        'Análisis de ahorros en tiempo real',
        'Capacitación incluida',
        'API access',
      ],
      cta: 'Contactar a ventas',
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
        'Análisis predictivo con IA',
        'Capacitación premium on-site',
        'API personalizada',
        'SLA garantizado',
        'Account manager dedicado',
      ],
      cta: 'Contactar a ventas',
      popular: false,
      color: 'border-gray-300',
      bgColor: 'bg-purple-50',
    },
  ]

  const handleContactClick = (planName: string) => {
    setSelectedPlan(planName)
    setShowContactModal(true)
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 pt-20">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Planes y Precios
              </h1>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto">
                Elige el plan que mejor se adapte a las necesidades de tu empresa.
                Todos los planes incluyen soporte y actualizaciones.
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`relative ${plan.bgColor} rounded-2xl border-2 ${plan.color} p-8 shadow-medium hover:shadow-xl transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
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
                    onClick={() => handleContactClick(plan.name)}
                    className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-primary text-white hover:bg-purple-700 shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-16"
            >
              <p className="text-gray-800 mb-6 text-lg">
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

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-12"
            >
              <p className="text-gray-800 mb-4">
                ¿Prefieres hablar directamente con nosotros?
              </p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=Hola, me interesa conocer más sobre Naova`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Contactar por WhatsApp
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Solicitar Información
            </h3>
            <p className="text-gray-800 mb-6">
              Redirigiendo al formulario de contacto para el plan: <strong>{selectedPlan}</strong>
            </p>
            <div className="flex gap-4">
              <Link href={`/contact?plan=${encodeURIComponent(selectedPlan)}`} className="flex-1">
                <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                  Continuar
                </button>
              </Link>
              <button
                onClick={() => setShowContactModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

