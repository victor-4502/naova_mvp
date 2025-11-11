'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

const FinalCTA = () => {
  const benefits = [
    'Sin costo inicial',
    'Implementación en 24 horas',
    'Soporte dedicado',
    'Resultados garantizados',
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-primary to-purple-800">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Empieza a ahorrar en tus compras{' '}
            <span className="text-secondary">desde hoy</span> con Naova
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Estamos listos para acompañarte en tus próximas compras. Agenda una llamada y activa tu prueba sin costo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
              >
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span className="text-white font-medium">{benefit}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/523316083075?text=Hola%20Naova%20quiero%20una%20prueba%20gratis"
              target="_blank"
              rel="noreferrer"
              className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold shadow-soft hover:shadow-medium transition-all duration-300 flex items-center gap-2 text-lg"
            >
              Solicita tu prueba gratis
              <ArrowRight className="h-5 w-5" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/523316083075?text=Hola%20Naova%20quiero%20una%20prueba%20gratis"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 text-lg"
            >
              Hablar con un experto
            </motion.a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-blue-100 mt-8 text-sm"
          >
            Respuesta en menos de 24 horas • Sin compromisos • Cancelación en cualquier momento
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCTA

