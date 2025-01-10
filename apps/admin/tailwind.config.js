/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        almostWhite: "#fefefe",
        wildSand: "#f5f5f5",
        butterflyBush: "#8F74B9",
        gallery: "#EBEBEB",
      },
    },
    fontFamily: {
      epkyoka: ["Epkyoka"],
      klee: ["Klee"],
      inter: ["Inter"],
    },
  },
  plugins: [],
};
