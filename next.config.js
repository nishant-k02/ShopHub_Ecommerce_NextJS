/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    output: 'standalone',
    experimental: {
        // Enable if you want to use the new app directory features
        // appDir: true,
    },
}

module.exports = nextConfig 