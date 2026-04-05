
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tnRed: {
          DEFAULT: '#e31837', // Rouge du drapeau tunisien
          dark: '#a30019',
        },
        govDark: {
          DEFAULT: '#0a0c1a', // Fond très sombre
          card: '#0c1022',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Recommandé pour le style des inputs/checkboxes
  ],
}