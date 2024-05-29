/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    /**
     * omniconfig.js has a too complex require statement which
     * cannot be analyzed for bundling
     */
    serverComponentsExternalPackages: ['omniconfig.js'],
  },
};

module.exports = nextConfig;
