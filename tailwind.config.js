/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./frontend/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050810",
        surface: "#0d1320",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 0, 0, 0.28)",
      },
    },
  },
  plugins: [],
};
