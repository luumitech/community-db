module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:prettier/recommended',
    'plugin:css-modules/recommended',
    'plugin:react/recommended',
  ],
  plugins: ['css-modules'],
  rules: {
    'react/self-closing-comp': ['error', { component: true, html: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': ['error'],
  },
  overrides: [
    {
      files: ['./*.ts', './*.tsx'],
      extends: [
        'plugin:@typescript-eslint/strict',
        'plugin:@typescript-eslint/stylistic-type-checked',
      ],
      plugins: ['@typescript-eslint'],
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
      },
    },
    {
      files: ['__tests__/**/*'],
      extends: ['plugin:jest/recommended'],
      plugins: ['jest'],
      env: {
        'jest/globals': true,
      },
    },
  ],
};
