/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // brand
        brand: {
          green: "#18e25d",
          green2: "#12c451",
        },
        // dark UI surfaces
        night: "#0b0b0b",     // page bg
        coal: "#0f1116",      // deep panels / inputs
        surface: "#0c0f15",   // cards
        ink: "#181926",       // alt surface
      },
      ringColor: {
        DEFAULT: "#18e25d",
      },
    },
  },
  plugins: [],
};
