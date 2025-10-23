/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Only use basePath and assetPrefix in production
  ...(isProduction && {
    basePath: '/hush',
    assetPrefix: '/hush/',
  }),
}

module.exports = nextConfig
