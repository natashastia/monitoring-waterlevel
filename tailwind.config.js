/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      black: "#000000",
      blue: { DEFAULT: "#4880FF", 800: "#1106BB" },
      darkblue: "#020D25",
      grayblue: "#1106BB",
      lightblue: "#D4E5FF",
      gray: "#F5F6FA",
      brown: "#E8B800",
      darkgray: "#E5E7EB",
      green: "#3EB157",
      red: "#B42200",
    },
    extend: {
      fontFamily: {
        NunitoSans: ['"NunitoSans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
