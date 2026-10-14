/** @type {import('tailwindcss').Config} */
export default {
  /**
   * @notice Only the folders that render markup are scanned.
   * @dev Next.js builds from `app/` + `components/`; Vite's `index.html` is gone.
   */
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      /**
       * @notice Design tokens are declared once in `app/globals.css` as RGB
       * @notice triplets and consumed here, so a colour is never hard-coded in a
       * @notice component again. The `rgb(var(--token) / <alpha-value>)` form is
       * @dev required for opacity utilities (`bg-brand/10`) to keep working.
       * @dev Hex → RGB: #6C4FA6, #5B3F91, #8B6FC2, #F7F5FB, #F1EDF9, #E6E1F2.
       */
      colors: {
        brand: {
          DEFAULT: 'rgb(var(--color-brand) / <alpha-value>)',
          dark: 'rgb(var(--color-brand-dark) / <alpha-value>)',
          light: 'rgb(var(--color-brand-light) / <alpha-value>)',
        },
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--color-surface-alt) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      /** @notice Card radius token, declared in `app/globals.css`. */
      borderRadius: {
        card: 'var(--radius-card)',
      },
    },
  },
  plugins: [],
};
