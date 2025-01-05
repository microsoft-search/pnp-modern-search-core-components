/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx,md,mdx}", "./docs/**/*.{md,mdx}"],
    theme: {
        extend: {},
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
    ],
    darkMode: ["class", '[data-theme="dark"]'],
    corePlugins: {
        preflight: false,
    },
    blocklist: ["container"],
    theme: {
        extend: {
            gridTemplateColumns: {
                "searchResult": "32px 2fr 0fr"
            },
            colors: {
              primary: "var(--ifm-color-primary)",
              homeLink: "var(--homelink-color)",
              emphasis: "var(--ifm-color-gray-100)"
            }
        }
    }
}
  