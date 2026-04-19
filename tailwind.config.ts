import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#040816",
        panel: "#0b132b",
        panelStrong: "#111c3f",
        accent: "#2f78ff",
        accentSoft: "#6fb7ff",
        text: "#edf4ff",
        textMuted: "#9eb3da",
        line: "rgba(146, 183, 255, 0.16)"
      },
      boxShadow: {
        glow: "0 0 60px rgba(47, 120, 255, 0.18)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(47,120,255,0.18), transparent 35%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
      },
      backgroundSize: {
        "hero-grid": "auto, 42px 42px, 42px 42px"
      }
    }
  },
  plugins: []
};

export default config;
