import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#08080C",
        surface: "#111116",
        elevated: "#1A1A20",
        accent: "#D77E00",
        electric: "#00B4D8",
        ink: "#F0F0F2",
        muted: "#888",
        border: "#2A2A2E",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
