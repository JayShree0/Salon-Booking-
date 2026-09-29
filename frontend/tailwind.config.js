/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
        colors: {
        'primary-color': '#019031',
        'secondary-color': '#EAF0F1',
      },
    },
  },
  plugins: [],
}
