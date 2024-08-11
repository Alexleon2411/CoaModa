/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
console.log(colors)

export default {
  content: ["./index.html", "./src/**/*.{vue,jsx,js,ts,tsx}", "./formkit.config.js", "./node_modules/vue-tailwind-datepicker/**/*.js",],
  theme: {
    extend: {
      colors: {
        "vtd-primary": colors.indigo
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
