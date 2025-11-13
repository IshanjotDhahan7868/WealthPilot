/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B8F5A',
        primaryLight: '#D7F5E6',
        primaryDeep: '#146F46',
        gold: '#E4C26D',
        textMain: '#1F2933',
        textSoft: '#6B7280'
      },
    },
  },
  plugins: [],
};