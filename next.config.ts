import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3443'] },
  },
  serverExternalPackages: [
    /**
     * This is added to avoid the error
     *
     *     ./src/app/graphql/schema/payment/util.ts + 9 modules
     *     Cannot get final name for export 'status' of ./node_modules/http-status/dist/index.js
     */
    // 'http-status-codes',
    /**
     * ./node_modules/graphql-yoga/node_modules/@whatwg-node/fetch/dist/node-ponyfill.js
     * Critical dependency: the request of a dependency is an expression
     *
     * Import trace for requested module:
     * ./node_modules/graphql-yoga/node_modules/@whatwg-node/fetch/dist/node-ponyfill.js
     * ./node_modules/graphql-yoga/esm/server.js
     * ./node_modules/graphql-yoga/esm/index.js ./src/app/api/graphql/route.ts
     */
    // '@whatwg-node',
  ],
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
