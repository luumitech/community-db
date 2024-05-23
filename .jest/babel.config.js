/**
 * This is only used by .jest
 * next project uses SWC to transpile typesript
 */
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};
