/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palet diambil dari screenshot desain Kosply Admin (sidebar ungu,
        // badge "OPS" lavender, aksen ungu di tombol/link).
        brand: {
          DEFAULT: '#6C4FA6',
          dark: '#5B3F91',
          light: '#8B6FC2',
        },
        surface: '#F7F5FB',
        'surface-alt': '#F1EDF9',
        border: '#E6E1F2',
      },
    },
  },
  plugins: [],
};
