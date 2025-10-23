/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production'
const hasBasePath = process.env.NEXT_PUBLIC_BASE_PATH

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Use basePath and assetPrefix when NEXT_PUBLIC_BASE_PATH is set (GitHub Actions) or in production
  ...((hasBasePath || isProduction) && {
    basePath: hasBasePath || '/hush',
    assetPrefix: hasBasePath ? `${hasBasePath}/` : '/hush/',
  }),
}

module.exports = nextConfig
