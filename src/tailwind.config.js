// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    // Nous simplifions le glob au cas où la syntaxe complexe pose problème
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}