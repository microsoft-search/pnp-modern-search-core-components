/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx,md,mdx}", "./docs/**/*.{md,mdx}"],
    theme: {
        extend: {},
    },
    plugins: [],
    darkMode: ["class", '[data-theme="dark"]'],
    corePlugins: {
        preflight: false,
    },
    blocklist: ["container"],
    theme: {
        extend: {

            colors: {
              primary: "var(--ifm-color-primary)",
              homeLink: "var(--homelink-color)",
              emphasis: "var(--ifm-color-gray-100)"
            }
        }
    }
}
  