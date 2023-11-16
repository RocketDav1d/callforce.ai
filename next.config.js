/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
      },
    images: {
        domains: ['localhost', 'ui-avatars.com'],
    },
}

module.exports = nextConfig
