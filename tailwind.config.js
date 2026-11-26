/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F5E8D5',
          surface: '#ECDAC0',
          border: '#D5B892',
        },
        ink: {
          DEFAULT: '#1E242B',
          muted: '#555B61',
        },
        terracotta: '#B85336',
        forest: '#2F5D50',
        indigo: {
          atlas: '#2B4570',
        },
        ochre: '#C68B2C',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
