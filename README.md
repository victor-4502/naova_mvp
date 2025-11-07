# Naova Landing Page

Una página web one-page profesional para **Naova**, un SaaS de compras industriales. Diseñada con un estilo limpio, minimalista y corporativo.

## 🚀 Tecnologías

- **Next.js 14** con TypeScript
- **React 18** 
- **TailwindCSS** para estilos
- **Framer Motion** para animaciones
- **Lucide React** para íconos

## 🎨 Características

- ✅ Diseño responsive (mobile y desktop)
- ✅ Animaciones suaves con Framer Motion
- ✅ Paleta de colores corporativa (azul #1D4ED8, verde #10B981)
- ✅ Componentes reutilizables
- ✅ Navegación suave entre secciones
- ✅ Optimizado para Lighthouse

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# La aplicación se ejecuta en http://localhost:3000
# Este es el único puerto usado en todo el proyecto

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🏗️ Estructura del Proyecto

```
naova2.0/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── ValueProps.tsx
│   ├── HowItWorks.tsx
│   ├── Benefits.tsx
│   ├── Pricing.tsx
│   ├── Testimonials.tsx
│   ├── About.tsx
│   ├── FinalCTA.tsx
│   └── Footer.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🎯 Secciones

1. **Header fijo** - Navegación y CTA
2. **Hero** - Pantalla principal con propuesta de valor
3. **Propuesta de Valor** - 3 pilares fundamentales
4. **Cómo Funciona** - Proceso en 4 pasos
5. **Beneficios** - Ventajas adicionales
6. **Precios** - Planes y precios
7. **Testimonios** - Casos de éxito
8. **Nosotros** - Información de la empresa
9. **CTA Final** - Llamada a la acción
10. **Footer** - Enlaces y contacto

## 🎨 Paleta de Colores

- **Primario**: #1D4ED8 (Azul)
- **Secundario**: #10B981 (Verde)
- **Grises**: #F3F4F6, #6B7280, #374151
- **Fondo**: #FFFFFF, #F9FAFB

## 📱 Responsive Design

- Mobile First
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid system con TailwindCSS
- Navegación móvil con menú hamburguesa

## ⚡ Performance

- Optimizado para Core Web Vitals
- Lazy loading de componentes
- Imágenes optimizadas
- CSS purgado automáticamente

## 🔧 Desarrollo

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📄 Licencia

Este proyecto es privado y pertenece a Naova.
