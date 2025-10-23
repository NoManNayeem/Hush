/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production'
const hasBasePath = process.env.NEXT_PUBLIC_BASE_PATH

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Always use basePath for GitHub Pages deployment
  basePath: '/hush',
  assetPrefix: '/hush/',
  // Add webpack configuration to fix module resolution issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
