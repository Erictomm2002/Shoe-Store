/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        slide: 'slide 10s infinite',
      },
    },
  },
  plugins: [],
};
