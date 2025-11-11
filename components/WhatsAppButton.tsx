'use client'

import { MessageCircle } from 'lucide-react'

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/523316083075?text=Hola%20Naova%20quiero%20una%20cotización"
      target="_blank"
      rel="noreferrer"
      aria-label="Contáctanos por WhatsApp"
      title="Contáctanos por WhatsApp"
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-600 transition-transform duration-300 hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline text-sm font-semibold">Contáctanos por WhatsApp</span>
    </a>
  )
}

export default WhatsAppButton

