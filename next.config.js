/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: []
  },
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    DASHBOARD_PASSWORD: process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD,
    ALLOWED_IPS: process.env.NEXT_PUBLIC_ALLOWED_IPS
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.BACKEND_API_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ]
  }
}

module.exports = nextConfig
