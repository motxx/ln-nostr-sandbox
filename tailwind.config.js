/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.tsx", "./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        rounded: ["M PLUS Rounded 1c", "sans-serif"],
      },
    },
  },
  plugins: [],
}

