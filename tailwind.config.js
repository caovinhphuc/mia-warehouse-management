/** @type {import('tailwindcss').Config} */

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

module.exports = {
  darkMode: "class",
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: (theme) => ({
      colors: {
        primary: flattenColorPalette(theme("colors.blue")),
        secondary: flattenColorPalette(theme("colors.gray")),
      },
    }),
  },
  plugins: [require("@tailwindcss/forms")],
};
