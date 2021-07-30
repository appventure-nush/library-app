const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
      },
    },
  },
  variants: {
    scrollSnapType: ['responsive'],
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [
    require('tailwindcss-scrollbar'),
    require('@tailwindcss/forms'),
    require('tailwindcss-scroll-snap'),
    require('@tailwindcss/typography'),
  ],
};
