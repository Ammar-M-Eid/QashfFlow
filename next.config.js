/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Optimize for Vercel deployment
    compress: true,
    poweredByHeader: false,

    // Image optimization (updated for Next.js 16)
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
    },

    // Production optimizations
    productionBrowserSourceMaps: false,

    // Use Turbopack (Next.js 16+ default)
    turbopack: {},

    // Environment variables available to browser
    env: {
        FASTAPI_URL: process.env.FASTAPI_URL || 'http://localhost:8001',
    },
};

module.exports = nextConfig;
