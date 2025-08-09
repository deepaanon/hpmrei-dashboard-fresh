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
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [
    // Ensure gradient classes are always included
    'bg-gradient-to-br',
    'bg-gradient-to-r',
    'from-blue-900',
    'via-purple-900',
    'to-indigo-900',
    'from-purple-600/20',
    'to-blue-600/20',
    'from-yellow-400',
    'to-orange-500',
    'from-gray-800/50',
    'to-gray-900/50',
    'from-green-400',
    'to-green-600',
    'from-green-300',
    'to-green-500',
    'from-yellow-400',
    'to-yellow-500',
    'from-orange-400',
    'to-orange-600',
    'from-red-500',
    'to-red-700',
    'from-gray-400',
    'to-gray-600',
    'from-green-500',
    'to-green-600',
    'from-blue-500',
    'to-blue-600',
    'from-purple-500',
    'to-purple-600',
    'from-red-500',
    'to-red-600',
    'from-blue-600',
    'to-blue-700',
    'bg-clip-text',
    'text-transparent',
    'backdrop-blur-lg',
    'backdrop-blur-md',
    'backdrop-blur-sm',
  ]
}
