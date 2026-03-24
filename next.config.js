/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'supabase.co'],
  },
  // Optimización para WhatsApp en producción
  webpack: (config, { dev, isServer }) => {
    if (isServer && !dev) {
      config.externals.push('puppeteer')
    }
    return config
  },
  // Headers de seguridad y cache busting AGRESIVO
  async headers() {
    const buildTime = Date.now().toString()
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Cache busting headers SUPER AGRESIVOS
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'X-Accel-Expires',
            value: '0',
          },
          {
            key: 'Surrogate-Control',
            value: 'no-store',
          },
          // Build time único
          {
            key: 'X-Build-Time',
            value: buildTime,
          },
          // Forzar reload
          {
            key: 'X-Force-Reload',
            value: buildTime,
          },
        ],
      },
    ]
  },
  // Generate build ID SUPER único
  generateBuildId: async () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    return `build-${timestamp}-${random}`
  },
}

module.exports = nextConfig