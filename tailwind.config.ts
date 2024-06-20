import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        /**
         * top margin of <main/>
         */
        'main-top': '0.5rem',
        /**
         * The available height in <main/>
         * 64px is the height of header
         * 0.5rem is main-top
         */
        'main-height': 'calc(100vh - 64px - 0.5rem)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        /**
         * See https://nextui.org/docs/customization/colors
         * on customizing various themes
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
export default config;
