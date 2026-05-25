/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

let config = nextConfig

try {
  const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  })
  config = withPWA(nextConfig)
} catch (e) {
  // PWA disabled – next-pwa not installed or incompatible
  console.warn('next-pwa not available, skipping PWA configuration')
}

module.exports = config
