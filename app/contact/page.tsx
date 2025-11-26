'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function ContactForm\(\) \{
  const searchParams = useSearchParams\(\)
  const planFromUrl = searchParams.get('plan') || ''

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    planInterest: planFromUrl,
    message: '',
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'Error al enviar el formulario')
        return
      }

      setStatus('success')
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        planInterest: '',
        message: '',
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage('Error de conexi+¶n. Intenta nuevamente.')
    }
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 pt-20">
        <section className="section-padding">
          <div className="container-max max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Contacta con Ventas
              </h1>
              <p className="text-xl text-gray-800">
                D+¨janos tus datos y nuestro equipo se pondr+Ì en contacto contigo en menos de 24 horas
              </p>
            </motion.div>

            {/* Success Message */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center mb-8"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  -ÌMensaje Enviado!
                </h3>
                <p className="text-gray-800 mb-6">
                  Gracias por tu inter+¨s en Naova. Nuestro equipo se pondr+Ì en contacto contigo pronto.
                </p>
                <Link href="/">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                    Volver al inicio
                  </button>
                </Link>
              </motion.div>
            )}

            {/* Contact Form */}
            {status !== 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-medium p-8 md:p-12"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {status === 'error' && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                        placeholder="Tu nombre"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
                        Empresa
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                        placeholder="tu@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                        Tel+¨fono
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                        placeholder="+52 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Plan Interest */}
                  <div>
                    <label htmlFor="planInterest" className="block text-sm font-medium text-gray-900 mb-2">
                      Plan de Inter+¨s
                    </label>
                    <select
                      id="planInterest"
                      name="planInterest"
                      value={formData.planInterest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    >
                      <option value="">Selecciona un plan</option>
                      <option value="trial">Trial Gratuito (30 d+°as)</option>
                      <option value="basic">Plan B+Ìsico</option>
                      <option value="enterprise">Plan Empresarial</option>
                      <option value="other">Otro / No estoy seguro</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                      placeholder="Cu+¨ntanos sobre tus necesidades..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Enviar Mensaje
                        </>
                      )}
                    </motion.button>
                  </div>

                  <p className="text-sm text-gray-600 text-center">
                    Al enviar este formulario, aceptas que Naova te contacte por email o tel+¨fono.
                  </p>
                </form>
              </motion.div>
            )}

            {/* Additional Contact Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Otras formas de contactarnos
              </h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-soft">
                  <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                  <a href="mailto:ventas@naova.com" className="text-primary hover:underline">
                    ventas@naova.com
                  </a>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-soft">
                  <h4 className="font-semibold text-gray-900 mb-2">WhatsApp</h4>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Chatear ahora
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

