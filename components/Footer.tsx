'use client'

import { motion } from 'framer-motion'
import { Linkedin, Mail, ArrowUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const footerLinks = {
    'Navegación': [
      { name: 'Inicio', id: 'hero' },
      { name: 'Funcionalidades', id: 'value-props' },
      { name: 'Precios', id: 'pricing' },
      { name: 'Contacto', id: 'contact' },
    ],
    'Empresa': [
      { name: 'Nosotros', id: 'about' },
      { name: 'Testimonios', id: 'testimonials' },
      { name: 'Blog', href: '#' },
      { name: 'Carreras', href: '#' },
    ],
    'Soporte': [
      { name: 'Centro de ayuda', href: '#' },
      { name: 'Documentación', href: '#' },
      { name: 'API', href: '#' },
      { name: 'Estado del sistema', href: '#' },
    ],
  } as const

  return (
    <footer id="contact" className="bg-gradient-to-br from-purple-900 to-purple-800 text-white">
      <div className="container-max">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo and description */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-2xl font-bold text-white mb-4">
                  Naova
                </div>
                <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                  Tu socio estratégico en compras industriales. Simplificamos la complejidad 
                  y maximizamos el valor en cada proceso de compra.
                </p>
                <div className="flex items-center gap-4">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300"
                  >
                    <Linkedin className="h-5 w-5" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="mailto:contacto@naova.com"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300"
                  >
                    <Mail className="h-5 w-5" />
                  </motion.a>
                </div>
              </motion.div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <div key={category}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <button
                          onClick={() => {
                            if ('id' in link && link.id) {
                              scrollToSection(link.id)
                            }
                          }}
                          className="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                        >
                          {link.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-gray-400 text-sm"
            >
              © 2024 Naova. Todos los derechos reservados.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-6 text-sm text-gray-400"
            >
              <a 
                href="/politica-privacidad"
                className="hover:text-white transition-colors duration-300"
              >
                Política de Privacidad
              </a>
              <button className="hover:text-white transition-colors duration-300">
                Términos de Servicio
              </button>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
