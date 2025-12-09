/* eslint-disable @typescript-eslint/no-require-imports */
const { heroui } = require('@heroui/react');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        'header-height': 'var(--header-height)',
        /** The available height in <main/> */
        'main-height': 'calc(100vh - var(--header-height))',
        /** Default spacing used below header */
        'page-top': '0.5rem',
        'page-x': '0.5rem',
      },
      dropShadow: {
        /**
         * Add border around text to make text show more clearly in front of
         * busy background
         */
        text: '0 1.5px 1.5px rgba(var(--background-end-rgb))',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        /**
         * See https://nextui.org/docs/customization/colors on customizing
         * various themes
         */
        // light: {
        //   colors: {
        //     primary: {
        //       DEFAULT: '#333333',
        //     },
        //   },
        // },
      },
    }),
  ],
};
