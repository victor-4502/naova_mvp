# Actualización Landing Naova

Este documento resume los ajustes realizados en la landing page basados en la presentación **Naova - Intro.pdf** y explica cómo actualizar los datos de contacto en caso necesario.

## Secciones modificadas

- `components/PlansCTA.tsx`: Se reemplazó la tabla de planes por una invitación a contactar al equipo con dos llamados a la acción (WhatsApp y correo).
- `components/ProblemSection.tsx` (nuevo): Describe los principales retos de las compras indirectas y se muestra justo después del `Hero`.
- `components/HowItWorks.tsx`: Se añadió el subtítulo narrativo “Así funciona Naova en la práctica” con los cuatro pasos resumidos.
- `components/Benefits.tsx`: Incluye un texto destacado sobre reportes automáticos y un ejemplo de uso para áreas operativas.
- `components/About.tsx`: Agrega el lema “No cambiamos tu proceso; lo hacemos más fácil y eficiente.”
- `components/WhatsAppButton.tsx` (nuevo) y `app/layout.tsx`: Implementan el botón flotante de WhatsApp visible en toda la web.

## Enlaces de contacto utilizados

- **WhatsApp – sección de planes**: `https://wa.me/message/UP7NK5BPILPCC1?text=Hola%20Naova%20quiero%20conocer%20sus%20planes`
- **WhatsApp – botón flotante**: `https://wa.me/message/UP7NK5BPILPCC1?text=Hola%20Naova%20quiero%20una%20cotización`
- **Correo – sección de planes**: `mailto:contacto@naova.com.mx?subject=Solicitud%20de%20cotización%20Naova`

## Cómo actualizar el número o correo

1. **Sección de planes** (`components/PlansCTA.tsx`):
   - Modifica el atributo `href` del primer `<motion.a>` para actualizar el enlace de WhatsApp.
   - Ajusta el `href` del segundo `<motion.a>` para cambiar el correo o el asunto del mensaje.

2. **Botón flotante** (`components/WhatsAppButton.tsx`):
   - Cambia la URL en el atributo `href` para actualizar el número o el mensaje prellenado.

3. **Texto visible**:
   - Los textos “Hablar con un experto”, “Solicitar cotización” y “Contáctanos por WhatsApp” se pueden ajustar directamente en los mismos archivos.

## Estilos y consistencia

Todos los cambios respetan la tipografía, paleta de colores y espaciados definidos por TailwindCSS en el proyecto. Si necesitas variar estilos adicionales, utiliza las clases utilitarias existentes para mantener consistencia visual.

