
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: {
    files: [
      './src/**/*.{html,ts,tsx}',
    ]
  },
  darkMode: 'class',
  theme: {
      extend: {
        fontFamily: {
          primary: ["var(--pnpsearch-internal-fontFamilyPrimary)","'Segoe  UI'", "'Arial, sans-serif'"],
          sans: ["var(--pnpsearch-internal-fontFamilySecondary)", "Roboto", ...defaultTheme.fontFamily.sans]
        },
        // Map the colors from EGG UI design system
        colors: {
          
          /* Default theme variables */

          primary: "var(--pnpsearch-internal-colorPrimary, #7C4DFF)",
          primaryHover: "var(--pnpsearch-internal-colorPrimaryHover, #651fff)",
          primaryBackgroundColor: "var(--pnpsearch-internal-colorBackgroundPrimary, #F3F5F6)",
          textColor: "var(--pnpsearch-internal-textColor, #1E252B)",

          /* Dark theme variables */
          primaryBackgroundColorDark: "var(--pnpsearch-internal-colorBackgroundDarkPrimary, #202831)",
          textColorDark: "var(--pnpsearch-internal-textColorDark, #FFF)",
        },
        keyframes: {
          shimmer: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: .5 },
          },
          fadein: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          }          
        },
        animation: {
          'shimmer': 'shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'fadein': 'fadein 0.8s ease ',
        }
    }
  },
  plugins: [
    require('@tailwindcss/forms'), // To be able to style inputs
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/container-queries')
  ],
  // List of classes including for templating purpose
  safelist: [

    'grid-cols-1',
    'grid-cols-2',    
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',

    '@sm:grid-cols-1',
    '@sm:grid-cols-2',    
    '@sm:grid-cols-3',
    '@sm:grid-cols-4',
    '@sm:grid-cols-5',

    '@md:grid-cols-1',
    '@md:grid-cols-2',    
    '@md:grid-cols-3',
    '@md:grid-cols-4',
    '@md:grid-cols-5',
    
    '@lg:grid-cols-1',
    '@lg:grid-cols-2',    
    '@lg:grid-cols-3',
    '@lg:grid-cols-4',
    '@lg:grid-cols-5',

    '@xl:grid-cols-1',
    '@xl:grid-cols-2',    
    '@xl:grid-cols-3',
    '@xl:grid-cols-4',
    '@xl:grid-cols-5',

    '@2xl:grid-cols-1',
    '@2xl:grid-cols-2',    
    '@2xl:grid-cols-3',
    '@2xl:grid-cols-4',
    '@2xl:grid-cols-5'
  ]
};