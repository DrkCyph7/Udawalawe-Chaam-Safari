/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    qualities: [75, 80, 85],
    remotePatterns: [
      {
        // Firebase Storage — used for popup poster images
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.139', '192.168.1.142'],
}

export default nextConfig
