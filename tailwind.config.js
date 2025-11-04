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
        /**
         * The available height in <main/>
         *
         * 0.5rem is the default page-top (assuming it is used)
         */
        'main-height': 'calc(100vh - var(--header-height) - 0.5rem)',
        /** Default spacing used below header */
        'page-top': '0.5rem',
        'page-x': '0.5rem',
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
