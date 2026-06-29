import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#fef2f2",
          "100": "#fee2e2",
          "500": "#f24139",
          "600": "#d6302a",
          "700": "#b91c1c",
        },
        brand: {
          pitch: "#0c0c0c",
          clay: "#1a1614",
          risen: "#26211e",
          fence: "#332d29",
          "warm-white": "#f5f2ed",
          muted: "#a39a94",
          yolk: "#f59e0b",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "grain": "grain 8s steps(10) infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -5%)" },
          "20%": { transform: "translate(-10%, 5%)" },
          "30%": { transform: "translate(5%, -10%)" },
          "40%": { transform: "translate(-5%, 15%)" },
          "50%": { transform: "translate(-10%, 5%)" },
          "60%": { transform: "translate(15%, 0)" },
          "70%": { transform: "translate(0, 10%)" },
          "80%": { transform: "translate(-15%, 0)" },
          "90%": { transform: "translate(10%, 5%)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(242, 65, 57, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(242, 65, 57, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
