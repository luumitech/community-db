module.exports = {
  plugins: ['prettier-plugin-organize-imports'],
  arrowParens: 'always',
  singleQuote: true,
  trailingComma: 'es5',
  /**
   * prettier-plugin-organize-imports:
   * Don't want destructive code actions (like removing unused imports)
   */
  organizeImportsSkipDestructiveCodeActions: true,
};
