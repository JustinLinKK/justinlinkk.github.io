/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        paper: "#ebf4ff",
        accent: "#38bdf8",
        ocean: "#1d4ed8"
      },
      fontFamily: {
        display: ["Aptos", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
        body: ["Aptos", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"]
      }
    }
  },
  plugins: [typography]
};

export default config;
