import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        text: "rgba(98, 92, 88, 0.75)",
      },
      lineHeight: {
        relaxed: "calc(1em + 0.8em)",
      },
      padding: {
        page: "3.5%",
      }
    },
  },
  plugins: [],
};

export default config;
