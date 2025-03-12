if (process.env.VSCODE_INSPECTOR_OPTIONS) {
  // Set timeout to 5 minutes while debugging
  jest.setTimeout(60 * 1000 * 5);
}
