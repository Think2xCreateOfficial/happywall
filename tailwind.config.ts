import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#1C1C1C",
          dark: "#121212",
          card: "#181818",
          surface: "#222222",
          border: "#2A2A2A",
          muted: "#333333",
        },
        brand: {
          yellow: "#F5B700",
          yellowHover: "#E5AB00",
          cream: "#FFF8E6",
          white: "#FFFFFF",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        manrope: ["var(--font-manrope)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        "glow-yellow": "0 0 35px -5px rgba(245, 183, 0, 0.25)",
        "poster-frame": "0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        "poster-elevated": "0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 30px -10px rgba(245, 183, 0, 0.15)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

