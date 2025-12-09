import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import cssModules from 'eslint-plugin-css-modules';
import jest from 'eslint-plugin-jest';
import playwright from 'eslint-plugin-playwright';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'dist/**',
    'build/**',
    'next-env.d.ts',
    // ignore linting node_modules
    'node_modules',
    //  don't lint generated graphql types
    'src/app/graphql/generated',
    // playwright generated report or assets
    'playwright-report',
    'test-results',
  ]),
  {
    // Global settings
    plugins: {
      'css-modules': cssModules,
    },
    rules: {
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react-hooks/static-components': ['off'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': ['error'],
      curly: 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      tseslint.configs.recommended,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      // False positive with enum
      // See: https://github.com/typescript-eslint/typescript-eslint/issues/3329
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'always' },
      ],
    },
  },
  {
    files: ['__tests__/**/*'],
    plugins: { jest },
    extends: [jest.configs['flat/recommended']],
    env: {
      'jest/globals': true,
    },
  },
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx'],
    extends: [playwright.configs['flat/recommended']],
    languageOptions: {
      parserOptions: {
        project: './tests/tsconfig.json',
      },
    },
    rules: {
      'playwright/expect-expect': [
        'error',
        {
          assertFunctionNames: ['takeScreenshot', 'verifyTransaction'],
        },
      ],
    },
  },
]);

export default eslintConfig;
