module.exports = {
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-jsdoc'],
  arrowParens: 'always',
  singleQuote: true,
  trailingComma: 'es5',
  /**
   * prettier-plugin-organize-imports:
   * Don't want destructive code actions (like removing unused imports)
   */
  organizeImportsSkipDestructiveCodeActions: true,
  /**
   * Prettier-plugin-jsdoc
   *
   * See: https://www.npmjs.com/package/prettier-plugin-jsdoc
   */
  tsdoc: true,
};
