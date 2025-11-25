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
        // Dynasty theme colors
        dynasty: {
          bg: '#0a0f1a',
          card: '#111827',
          border: '#1f2937',
          accent: '#c9a227',
          gold: '#fbbf24',
          silver: '#9ca3af',
        }
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;



