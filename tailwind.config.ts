import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm day-mode palette
        ivory: {
          DEFAULT: "#FFF9F0",
          warm: "#F5EDDF",
          deep: "#EDE3D1",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.55)",
          card: "rgba(255,255,255,0.65)",
          hover: "rgba(255,255,255,0.80)",
        },
        charcoal: {
          DEFAULT: "#1A1A2E",
          light: "#2D2D44",
          muted: "#6B6B80",
        },
        // Keep black for admin panel
        black: {
          DEFAULT: "#08080B",
          panel: "#111219",
          panel2: "#15161F",
        },
        cream: "#EDE6D3",
        gold: {
          DEFAULT: "#C9A876",
          bright: "#E3C48F",
          warm: "#D4A84B",
          light: "rgba(201,168,118,0.15)",
        },
        neon: {
          DEFAULT: "#7B5CFF",
          deep: "#5C3DEB",
          mint: "#33F2C7",
          light: "rgba(123,92,255,0.12)",
        },
        coral: {
          DEFAULT: "#FF4E6A",
          light: "rgba(255,78,106,0.12)",
        },
        orange: {
          DEFAULT: "#FF6B35",
          light: "rgba(255,107,53,0.12)",
        },
        muted: "#8A8A93",
        border: {
          DEFAULT: "rgba(26,26,46,0.08)",
          dark: "rgba(237,230,211,0.08)",
        },
      },
      fontFamily: {
        display: ["'Outfit'", "'Bebas Neue'", "sans-serif"],
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
        glow: "0 8px 30px rgba(123,92,255,0.35)",
        goldGlow: "0 8px 30px rgba(201,168,118,0.25)",
        card: "0 24px 50px rgba(26,26,46,0.10)",
        glass: "0 8px 32px rgba(26,26,46,0.08), 0 2px 8px rgba(26,26,46,0.04), inset 0 1.5px 1px rgba(255,255,255,0.95)",
        "glass-lg": "0 16px 48px rgba(26,26,46,0.10), 0 4px 16px rgba(26,26,46,0.06), inset 0 2px 1.5px rgba(255,255,255,0.98)",
        "glass-xl": "0 24px 64px rgba(26,26,46,0.12), 0 8px 24px rgba(26,26,46,0.08), inset 0 2px 1.5px rgba(255,255,255,1)",
        float: "0 12px 40px rgba(26,26,46,0.12), 0 4px 12px rgba(26,26,46,0.06)",
        warm: "0 4px 24px rgba(201,168,118,0.18)",
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
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(1deg)" },
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
