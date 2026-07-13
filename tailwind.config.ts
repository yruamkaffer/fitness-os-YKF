import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.035), 0 18px 55px rgba(0,0,0,0.3)",
        "card-hover": "0 0 0 1px hsl(var(--primary) / 0.12), 0 18px 48px rgba(0,0,0,0.38), 0 0 34px hsl(var(--secondary) / 0.05)",
        "primary-glow": "0 8px 28px hsl(var(--primary) / 0.24)",
        "secondary-glow": "0 8px 28px hsl(var(--secondary) / 0.18)"
      },
      keyframes: {
        "save-pop": {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.045)" },
          "100%": { transform: "scale(1)" }
        },
        "soft-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0)" },
          "50%": { boxShadow: "0 0 0 5px hsl(var(--primary) / 0.12), 0 0 30px hsl(var(--primary) / 0.16)" }
        }
      },
      animation: {
        "save-pop": "save-pop 420ms cubic-bezier(0.2, 0.9, 0.25, 1)",
        "soft-pulse": "soft-pulse 2.4s ease-in-out infinite"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
