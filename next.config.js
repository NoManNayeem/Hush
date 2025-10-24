/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production'
const hasBasePath = process.env.NEXT_PUBLIC_BASE_PATH

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Always use basePath for GitHub Pages deployment
  basePath: '/Hush',
  assetPrefix: '/Hush/',
      // Performance optimizations
      experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
      },
  // Compression
  compress: true,
  // Add webpack configuration to fix module resolution issues
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    // Optimize bundle size
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      }
    }

    return config
  },
}

module.exports = nextConfig
