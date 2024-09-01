/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1ea3a7',
        'home-button': '#000e14',
        'oxford-blue': '#002147',
        'custom-cyan': '#10e4ff'
      },
    },
  },
  plugins: [],
}

