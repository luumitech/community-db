import type { CodegenConfig } from '@graphql-codegen/cli';
import { printSchema } from 'graphql';
import { schema } from './src/app/graphql/schema';

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['src/**/*.tsx', 'src/**/*.spec.ts'],
  generates: {
    './src/app/graphql/generated/': {
      preset: 'client',
      plugins: [],
      config: {
        scalars: {
          // ISOString (i.e. "2024-05-13T15:58:12.957Z")
          DateTime: 'string',
          Date: 'string',
        },
      },
    },
    './src/app/graphql/generated/type-policies.ts': {
      plugins: ['typescript-apollo-client-helpers'],
    },
  },
};

export default config;
