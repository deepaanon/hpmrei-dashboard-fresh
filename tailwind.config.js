/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'trading': {
          'bg': '#1a1a1a',
          'card': '#2d2d2d',
          'border': '#404040',
          'green': '#00ff00',
          'light-green': '#90ee90',
          'yellow': '#ffd700',
          'orange': '#ffa07a',
          'red': '#ff0000'
        }
      }
    },
  },
  plugins: [],
}
