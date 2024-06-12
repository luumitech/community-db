const config = {
  schema: 'src/app/graphql/generated/schema.graphql',
  documents: 'src/**/*.{ts,tsx}',
  extensions: {
    languageService: {
      /**
       * Disabling validation because:
       * - VSCODE graphql extension is flagging fragment as error
       *   when they are defined in another file
       * - "go to fragment definition" is not working correctly
       *   when the fragment definition is in another file
       *
       * See: https://github.com/graphql/graphiql/issues/3066
       */
      enableValidation: false,
    },
  },
};

export default config;
