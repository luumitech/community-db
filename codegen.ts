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
    },
    './src/app/graphql/generated/type-policies.ts': {
      plugins: ['typescript-apollo-client-helpers'],
    },
  },
};

export default config;
