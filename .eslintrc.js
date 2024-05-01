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
  },
  overrides: [
    {
      files: ['__tests__/**/*'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      env: {
        'jest/globals': true,
      },
    },
  ],
};
