module.exports = {
  plugins: ['css-modules'],
  extends: [
    'next/core-web-vitals',
    'plugin:prettier/recommended',
    'plugin:css-modules/recommended',
    'plugin:react/recommended',
  ],
  rules: {
    'react/self-closing-comp': ['error', { component: true, html: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': ['error'],
    curly: 'error',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/stylistic-type-checked',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        // False positive with enum
        // See: https://github.com/typescript-eslint/typescript-eslint/issues/3329
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
    {
      files: ['__tests__/**/*'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      env: {
        'jest/globals': true,
      },
    },
    {
      files: ['tests/**/*.ts', 'tests/**/*.tsx'],
      parserOptions: {
        project: './tests/tsconfig.json',
      },
      extends: ['plugin:playwright/recommended'],
      rules: {
        'playwright/expect-expect': [
          'error',
          {
            assertFunctionNames: ['takeScreenshot'],
          },
        ],
      },
    },
  ],
};
