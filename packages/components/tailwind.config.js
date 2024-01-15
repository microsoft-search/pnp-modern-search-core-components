const {tailwindTransform} = require("postcss-lit");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: {
    files: [
      "./src/**/*.ts",
    ],
    transform: {
      ts: tailwindTransform
    }
  },
  darkMode: "class",
  theme: {
    extend: {
        gridTemplateColumns: {
          "searchResult": "32px 2fr 0fr"
        },
        fontFamily: {
          primary: ["var(--pnpsearch-internal-fontFamilyPrimary)","'Segoe  UI'", "'Arial, sans-serif'"],
          sans: ["var(--pnpsearch-internal-fontFamilySecondary)", "Roboto", ...defaultTheme.fontFamily.sans]
        },
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
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: .5 },
          },
          fadein: {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          }          
        },
        animation: {
          "shimmer": "shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          "fadein": "fadein 0.8s ease ",
        }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require('@tailwindcss/line-clamp')
  ],
};