import type { CodegenConfig } from '@graphql-codegen/cli';
import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset';
import { printSchema } from 'graphql';
import { schema } from '~/graphql/schema';

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    './src/app/graphql/generated/': {
      preset: 'client',
      presetConfig: {
        persistedDocuments: true,
        fragmentMasking: { unmaskFunctionName: 'getFragment' },
      },
      documentTransforms: [addTypenameSelectionDocumentTransform],
      plugins: [],
      config: {
        nonOptionalTypename: true,
        dedupeFragments: true,
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
    './src/app/graphql/generated/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
