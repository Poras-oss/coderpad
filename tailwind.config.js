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

      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        shimmer: 'linear-gradient(90deg, #e0e0e0 25%, #f6f6f6 50%, #e0e0e0 75%)',
      },
    },
  },
  plugins: [],
}

