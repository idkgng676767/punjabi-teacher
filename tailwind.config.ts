import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        saffron: "#ff9f1c",
        mango: "#ffd166",
        plum: "#7c3aed",
        mint: "#34d399"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(124,58,237,0.25)"
      }
    }
  },
  plugins: []
};

export default config;
