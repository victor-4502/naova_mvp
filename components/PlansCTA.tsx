'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Mail } from 'lucide-react'

const PlansCTA = () => {
  return (
    <section
      id="pricing"
      className="section-padding bg-gradient-to-br from-purple-100 to-purple-200"
    >
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            ¿Quieres conocer nuestros planes?
          </h2>
          <p className="text-xl text-gray-800 mb-10">
            Contáctanos para recibir una propuesta personalizada según tus necesidades.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/523316083075?text=Hola%20Naova%20quiero%20conocer%20sus%20planes"
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Hablar con un experto
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:contacto@naova.com.mx?subject=Solicitud%20de%20cotización%20Naova"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white text-primary font-semibold shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <Mail className="h-5 w-5" />
              Solicitar cotización
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PlansCTA

