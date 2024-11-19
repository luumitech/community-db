/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3443'] },
  },
  eslint: {
    /**
     * Make sure all directories are scanned. (by default, only 'src' is linted)
     *
     * See
     * https://nextjs.org/docs/pages/building-your-application/configuring/eslint#additional-configurations
     */
    dirs: ['.'],
  },
  // Pull all dependencies into .next build
  output: 'standalone',
};

export default nextConfig;
