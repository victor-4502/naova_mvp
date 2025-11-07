'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'María González',
      role: 'Directora de Compras',
      company: 'Industrias del Norte',
      content: 'Naova transformó completamente nuestra gestión de compras. Redujimos el tiempo de procesos en un 60% y ahorramos más de $200,000 en el primer año.',
      rating: 5,
      avatar: 'MG',
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Gerente de Operaciones',
      company: 'Manufacturas del Sur',
      content: 'La facilidad de uso es impresionante. Sin curva de aprendizaje, nuestro equipo se adaptó inmediatamente. Los reportes son claros y accionables.',
      rating: 5,
      avatar: 'CR',
    },
    {
      name: 'Ana Martínez',
      role: 'CFO',
      company: 'Grupo Industrial Central',
      content: 'El ROI fue visible desde el primer mes. Naova no solo optimiza costos, sino que nos da visibilidad total de nuestros procesos de compra.',
      rating: 5,
      avatar: 'AM',
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
    <section id="testimonials" className="section-padding bg-gradient-to-br from-white to-purple-50">
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
            Lo que dicen nuestros clientes
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-800 max-w-3xl mx-auto"
          >
            Empresas líderes confían en Naova para optimizar sus procesos 
            de compra y obtener resultados medibles
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-800 leading-relaxed mb-6 text-lg">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-800">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-primary font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-primary/5 rounded-2xl p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">30+</div>
              <div className="text-gray-800">Empresas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">$2M+</div>
              <div className="text-gray-800">Ahorrados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-800">Satisfacción</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">60%</div>
              <div className="text-gray-800">Menos tiempo</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
