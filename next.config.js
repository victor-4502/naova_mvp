/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 has app directory enabled by default
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables
  env: {
    PORT: process.env.PORT || '3000'
  },
  
  // Vercel maneja el output automáticamente
}

module.exports = nextConfig
