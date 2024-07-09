/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    /**
     * omniconfig.js has a too complex require statement which
     * cannot be analyzed for bundling
     */
    serverComponentsExternalPackages: ['omniconfig.js'],
    serverActions: { allowedOrigins: ['localhost:3443'] },
  },
  // Pull all dependencies into .next build
  output: 'standalone',
};

export default nextConfig;
