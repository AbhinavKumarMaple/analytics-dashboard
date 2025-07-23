import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        "primary-purple": "rgb(var(--primary-purple) / <alpha-value>)",
        "primary-purple-dark": "rgb(var(--primary-purple-dark) / <alpha-value>)",
        "primary-purple-light": "rgb(var(--primary-purple-light) / <alpha-value>)",
        "primary-blue": "#007bff",
        "primary-green": "#28a745",
        "primary-red": "#dc3545",
        "primary-yellow": "#ffc107",

        // Secondary Colors
        "secondary-blue": "#2B3674",
        "secondary-green": "#10b981",
        "text-options": "#031D42",

        // Neutral Colors
        gray: {
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#212529",
          900: "#1a1d20",
        },

        // Brand Colors
        "kb-home": "#f59e0b",
        nvr: "#991b1b",
        lennar: "#1e40af",
        richmond: "#dc2626",

        // UI Colors
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
      fontSize: {
        display: ["3.75rem", { lineHeight: "1.2" }],
        h1: ["2.5rem", { lineHeight: "1.2" }],
        h2: ["2rem", { lineHeight: "1.3" }],
        h3: ["1.75rem", { lineHeight: "1.4" }],
        h4: ["1.5rem", { lineHeight: "1.4" }],
        h5: ["1.25rem", { lineHeight: "1.5" }],
        h6: ["1.125rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        xs: ["0.75rem", { lineHeight: "1.5" }],
      },
      spacing: {
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "8": "2rem",
        "10": "2.5rem",
        "12": "3rem",
        "16": "4rem",
        "20": "5rem",
        "24": "6rem",
        "32": "8rem",
        "40": "10rem",
        "48": "12rem",
        "56": "14rem",
        "64": "16rem",
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem", // 4px
        md: "0.375rem", // 6px
        lg: "0.5rem", // 8px
        xl: "0.75rem", // 12px
        "2xl": "1rem", // 16px
        "3xl": "1.5rem", // 24px
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        md: "0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        lg: "0 4px 6px 0 rgba(0, 0, 0, 0.05)",
        xl: "0 10px 15px 0 rgba(0, 0, 0, 0.05)",
        "2xl": "0 20px 25px 0 rgba(0, 0, 0, 0.05)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        dmsans: ["DM Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
