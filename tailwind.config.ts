import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.5625rem",
      },
      fontFamily: {
        oswald: ['var(--font-oswald)'],
        newZealand: ['var(--font-newZealand)'],
      },
      colors: {
        slate: "#cbd5e1",
        darkSlate: "#334155",
        mediumSlate: "#5E6C84",
        lightSlate: "#f8fafc",
        text: "#020617"
      }
    },
  },
  plugins: [],
};
export default config;
