import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#e50914",
          "red-dark": "#b20710",
          "red-light": "#ff1e2d",
        },
        dark: {
          bg: "#0a0a0a",
          card: "#111111",
          "card-hover": "#1a1a1a",
          border: "#222222",
          "border-light": "#2a2a2a",
          muted: "#333333",
        },
        text: {
          primary: "#ffffff",
          secondary: "#cccccc",
          muted: "#888888",
          dim: "#555555",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-card": "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.95) 100%)",
        "gradient-hero": "linear-gradient(to right, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.3) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-red": "pulseRed 2s infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        slideIn: { "0%": { transform: "translateX(-20px)", opacity: "0" }, "100%": { transform: "translateX(0)", opacity: "1" } },
        pulseRed: { "0%, 100%": { boxShadow: "0 0 0 0 rgba(229,9,20,0.4)" }, "50%": { boxShadow: "0 0 0 10px rgba(229,9,20,0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      boxShadow: {
        "card": "0 4px 20px rgba(0,0,0,0.5)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.8)",
        "red-glow": "0 0 20px rgba(229,9,20,0.3)",
        "red-glow-lg": "0 0 40px rgba(229,9,20,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
