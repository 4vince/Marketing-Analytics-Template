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
      },
    },
  },
  plugins: [],
};
export default config;
