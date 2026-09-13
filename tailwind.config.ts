import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pure Monochrome Black & White Palette
        ivory: {
          DEFAULT: "#000000",
          warm: "#0B0B10",
          deep: "#14141A",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.06)",
          card: "rgba(255,255,255,0.08)",
          hover: "rgba(255,255,255,0.12)",
        },
        charcoal: {
          DEFAULT: "#FFFFFF",
          light: "#E4E4E7",
          muted: "#A1A1AA",
        },
        black: {
          DEFAULT: "#000000",
          panel: "#0A0A0E",
          panel2: "#121216",
        },
        cream: "#E4E4E7",
        gold: {
          DEFAULT: "#FFFFFF",
          bright: "#F4F4F5",
          warm: "#D4D4D8",
          light: "rgba(255,255,255,0.12)",
        },
        neon: {
          DEFAULT: "#FFFFFF",
          deep: "#E4E4E7",
          mint: "#FFFFFF",
          light: "rgba(255,255,255,0.12)",
        },
        coral: {
          DEFAULT: "#FFFFFF",
          light: "rgba(255,255,255,0.12)",
        },
        orange: {
          DEFAULT: "#FFFFFF",
          light: "rgba(255,255,255,0.12)",
        },
        muted: "#A1A1AA",
        border: {
          DEFAULT: "rgba(255,255,255,0.14)",
          dark: "rgba(255,255,255,0.14)",
        },
      },
      fontFamily: {
        scripture: ["'Jim Nightshade'", "cursive", "serif"],
        display: ["'Outfit'", "'Inter'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backdropBlur: {
        xs: "2px",
        "3xl": "64px",
      },
      boxShadow: {
        glow: "0 8px 30px rgba(255,255,255,0.25)",
        goldGlow: "0 8px 30px rgba(255,255,255,0.20)",
        card: "0 24px 50px rgba(0,0,0,0.6)",
        glass: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.15)",
        "glass-lg": "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.2)",
        "glass-xl": "0 24px 64px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.25)",
        float: "0 12px 40px rgba(0,0,0,0.6)",
        warm: "0 4px 24px rgba(255,255,255,0.15)",
      },
      animation: {
        "pulse-live": "pulse-live 1.4s infinite",
        ticker: "ticker 28s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -6px, 0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
