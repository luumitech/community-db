import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3443'] },
  },
  transpilePackages: [
    /** Required by https://github.com/hustcc/echarts-for-react */
    'echarts',
    'zrender',
  ],
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
    /**
     * Concaveman uses require('rbush'), but webpack resolves rbush to its ESM
     * entry (index.js with `export default`) causing "RBush is not a
     * constructor". Externalizing lets Node's native require() resolve to the
     * correct CJS build.
     *
     * @turf/turf is also externalized to prevent webpack from re-bundling
     * the graphql schema module graph during HMR, which causes Pothos
     * "Duplicate typename" errors from type re-registration.
     */
    'concaveman',
    '@turf/turf',
  ],
  // Pull all dependencies into .next build
  output: 'standalone',
};

export default nextConfig;
