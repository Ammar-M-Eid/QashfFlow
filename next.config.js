/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Optimize for Vercel deployment
    compress: true,
    poweredByHeader: false,

    // Image optimization
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

    // Environment variables available to browser
    env: {
        FASTAPI_URL: process.env.FASTAPI_URL || '',
    },
};

module.exports = nextConfig;
