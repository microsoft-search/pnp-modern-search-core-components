
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: {
    files: [
      './src/**/*.html',
    ]
  },
  corePlugins: {
    preflight: false, // Will conflict with base SPFx styles otherwise (ex: buttons background-color)
  },
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--pnpsearch-fontFamilyPrimary)","'Segoe  UI'", "'Arial, sans-serif'"],
        sans: ["var(--pnpsearch-fontFamilySecondary)", "Roboto", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        
      /* Default theme variables */

        primary: "var(--pnpsearch-colorPrimary, #7C4DFF)",
        primaryHover: "var(--pnpsearch-colorPrimaryHover, #651fff)",
        primaryBackgroundColor: "var(--pnpsearch-colorBackgroundPrimary, #F3F5F6)",
        textColor: "var(--pnpsearch-textColor, #1E252B)",

        /* Dark theme variables */
        primaryBackgroundColorDark: "var(--pnpsearch-colorBackgroundDarkPrimary, #202831)",
        textColorDark: "var(--pnpsearch-textColorDark, #FFF)",
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
  ]
};