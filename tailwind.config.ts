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
        // Earthy Construction Luxury Palette
        background: "#F5F0E8", // Warm Ivory
        surface: "#FFFFFF",    // Pure White
        ivory: {
          DEFAULT: "#F5F0E8",
          50: "#FAF7F2",
          100: "#F5F0E8",
          200: "#ECE3D5",
          300: "#E3D6C1",
        },
        espresso: {
          DEFAULT: "#40352E",
          50: "#ECE7E4",
          100: "#DACFCB",
          200: "#B8A39A",
          300: "#95786A",
          400: "#6B5548",
          500: "#40352E",
          600: "#362D27",
          700: "#2B241F",
          800: "#201A16",
          900: "#14100E",
        },
        mocha: {
          DEFAULT: "#806B59",
          50: "#F4F1EE",
          100: "#E8E2DD",
          200: "#D1C6BD",
          300: "#BAA99D",
          400: "#9D8878",
          500: "#806B59",
          600: "#6C5A4B",
          700: "#594A3D",
          800: "#45392F",
          900: "#322921",
        },
        sandstone: {
          DEFAULT: "#D8D0C5",
          50: "#FAF9F7",
          100: "#F5F3EF",
          200: "#ECE8E1",
          300: "#E2DCD3",
          400: "#D8D0C5",
          500: "#C4B9AA",
          600: "#ADA08F",
          700: "#928471",
        },
        bronze: {
          DEFAULT: "#A98559",
          50: "#F8F5F0",
          100: "#EFE8DC",
          200: "#DFD1B9",
          300: "#CFBA96",
          400: "#BCA077",
          500: "#A98559",
          600: "#916F46",
          700: "#755835",
          800: "#584227",
        },
        text: {
          primary: "#292522",
          secondary: "#77716E",
          muted: "#9C9590",
        },
        border: {
          DEFAULT: "#D8D0C5",
          light: "#EAE5DE",
          dark: "#C4B9AA",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        "hero": "24px",
        "card": "20px",
        "panel": "16px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(64, 53, 46, 0.05)",
        card: "0 2px 8px -1px rgba(64, 53, 46, 0.07), 0 1px 3px -1px rgba(64, 53, 46, 0.05)",
        luxury: "0 8px 24px -4px rgba(64, 53, 46, 0.08), 0 2px 6px -1px rgba(64, 53, 46, 0.04)",
        "luxury-hover": "0 16px 36px -6px rgba(64, 53, 46, 0.14), 0 6px 12px -2px rgba(64, 53, 46, 0.06)",
        bronze: "0 4px 16px 0 rgba(169, 133, 89, 0.28)",
        mocha: "0 4px 16px 0 rgba(128, 107, 89, 0.32)",
      },
    },
  },
  plugins: [],
};

export default config;
