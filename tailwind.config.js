/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#685BC7', // Pantone 2725 C
        secondary: '#10B981',
        purple: {
          50: '#f8f7ff',
          100: '#f0f0ff',
          200: '#e6e3ff',
          300: '#d1ccff',
          400: '#b8b0ff',
          500: '#9d8eff',
          600: '#7c6bff',
          700: '#685BC7',
          800: '#5a4f9f',
          900: '#4c4280',
        },
        gray: {
          50: '#f8f7ff',
          100: '#f0f0ff',
          200: '#e6e3ff',
          300: '#d1ccff',
          400: '#b8b0ff',
          500: '#9d8eff',
          600: '#7c6bff',
          700: '#685BC7',
          800: '#5a4f9f',
          900: '#4c4280',
        }
      },
      fontFamily: {
        sans: ['Wondra', 'system-ui', 'sans-serif'],
        display: ['Glancyr', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
