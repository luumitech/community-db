/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3443'] },
    /**
     * This is added to avoid the error
     *
     *     ./src/app/graphql/schema/payment/util.ts + 9 modules
     *     Cannot get final name for export 'status' of ./node_modules/http-status/dist/index.js
     */
    serverComponentsExternalPackages: ['http-status-codes'],
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
