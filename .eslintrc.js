module.exports = {
  plugins: ['css-modules', '@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'plugin:prettier/recommended',
    'plugin:css-modules/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/self-closing-comp': ['error', { component: true, html: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': ['error'],
    '@typescript-eslint/no-unused-vars': 'off',
    // False positive with enum
    // See: https://github.com/typescript-eslint/typescript-eslint/issues/3329
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
  overrides: [
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
