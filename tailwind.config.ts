import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'display': ['var(--font-editorial)', 'Georgia', 'serif'],
        'mono': ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.3vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)',
        'fluid-lg': 'clamp(1.25rem, 1rem + 1vw, 2rem)',
        'fluid-xl': 'clamp(1.5rem, 1rem + 2vw, 3rem)',
        'fluid-2xl': 'clamp(2rem, 1.5rem + 2.5vw, 4rem)',
        'fluid-3xl': 'clamp(2.5rem, 2rem + 3vw, 5.5rem)',
        'fluid-4xl': 'clamp(3rem, 2rem + 5vw, 8rem)',
      },
      letterSpacing: {
        'tightest': '-0.05em',
        'super-tight': '-0.03em',
      },
      lineHeight: {
        'compressed': '0.85',
        'tight-reading': '1.3',
        'reading': '1.6',
        'spacious': '1.8',
      },
    },
  },
  plugins: [],
};
export default config;
