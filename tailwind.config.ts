import { nextui } from '@nextui-org/react';

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: '#7b4cff',
        pink: '#ff518f',
        green: '#4ff2a4',
        blue: '#66b6ff',
        yellow: '#ffd029',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        light: {
          layout: {},
          colors: {},
        },
        dark: {
          layout: {},
          colors: {},
        },
        baple: {
          extend: 'light',
          colors: {
            background: 'white',
            foreground: '#1E1E1E',
            primary: {
              DEFAULT: '#7b4cff',
              foreground: 'white',
            },

            secondary: {
              DEFAULT: '#FF518F',
              foreground: 'black',
            },

            focus: '#FFB629',
          },
          layout: {
            disabledOpacity: '0.3',
            radius: {
              small: '4px',
              medium: '6px',
              large: '8px',
            },
            borderWidth: {
              small: '1px',
              medium: '2px',
              large: '3px',
            },
          },
        },
      },
    }),
  ],
  safelist: [
    'h-[400px]',
    'visible',
    'invisible',
    'opacity-100',
    'opacity-0',
    'right-[-20rem]',
    'right-[20rem]',
    'right-0',
  ],
};

// export default config;
