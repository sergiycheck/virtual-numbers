import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "2rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    fontSize: {
      xs: ["12px", "16px"],
      sm: ["14px", "20px"],
      base: ["16px", "24px"],
      lg: ["18px", "28px"],
      xl: ["20px", "28px"],
      "2xl": ["24px", "32px"],
      "3xl": ["30px", "36px"],
      "4xl": ["36px", "40px"],
      "5xl": ["48px", "1"],
      "6xl": ["60px", "1"],
      "7xl": ["72px", "1"],
      "8xl": ["96px", "1"],
      "9xl": ["128px", "1"],
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        montserrat: ["Montserrat var", ...defaultTheme.fontFamily.sans],
      },

      dropShadow: {
        card: "0px 0px 250px 0px hsla(0, 0%, 0%, 0.15)",
      },
      colors: {
        border: "var(--border)",
        input: "hsl(var(--input))",
        dropdown_values_border: "hsl(var(--dropdown-values-border))",
        ring: "hsl(var(--ring))",
        border_brand: "hsl(var(--btn-primary))",
        border_primary: "hsl(var(--border-primary))",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // custom colors from metacarbon ui kit
        container_dark: "hsl(var(--container-dark))",
        container_light: "hsl(var(--container-light))",
        container_light_1: "hsl(var(--container-light-1))",
        container_light_2: "hsl(var(--container-light-2))",
        container_same_bg: "hsl(var(--container-same-bg))",
        container_brand_dark: "hsl(var(--container-brand-dark))",
        container_brand_darker: "hsl(var(--container-brand-darker))",
        container_success: "hsl(var(--container-success))",
        container_notice_dark: "hsl(var(--container-notice-dark))",
        container_warning_dark: "hsl(var(--container-warning-dark))",
        container_brand: "hsl(var(--container-brand))",
        container_markup: "hsl(var(--container-markup))",
        sidebar_bg: "var(--sidebar-bg)",

        // text colors
        text_title: "hsl(var(--text-title))",
        text_disabled: "hsl(var(--text-disabled))",
        text_01: "hsl(var(--text-01))",
        text_02: "hsl(var(--text-02))",
        text_03: "hsl(var(--text-03))",
        text_05: "hsl(var(--text-05))",
        text_05_07: "hsl(var(--text-05-07))",
        text_summary: "hsl(var(--text-summary))",
        text_primary_inverted: "hsl(var(--text-primary-inverted))",
        text_warning: "hsl(var(--text-warning))",
        text_brand: "hsl(var(--text-brand))",
        text_notice: "hsl(var(--text-notice))",
        text_success: "hsl(var(--text-success))",
        text_paragraph: "hsl(var(--text-paragraph))",
        text_subtitle: "hsl(var(--text-subtitle))",
        text_subtitle_bright: "hsl(var(--text-subtitle-bright))",
        text_faq_answer: "hsl(var(--text-faq-answer))",

        //icons
        icon_brand: "hsl(var(--icon-brand))",
        icond_dark_2: "hsl(var(--icon-dark-2))",
        icond_warning: "hsl(var(--icon-warning))",
        icond_light_2: "hsl(var(--icon-light-2))",
        icond_notice: "hsl(var(--icon-notice))",
        icon_dark: "hsl(var(--icon-dark))",

        // state colors
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // custom colors from metacarbon ui kit
        // primary button
        btn_primary: {
          DEFAULT: "hsl(var(--btn-primary))",
          foreground: "hsl(var(--btn-primary-foreground))",
        },
        btn_primary_hover: "hsl(var(--btn-primary-hover))",
        btn_primary_pressed: "hsl(var(--btn-primary-pressed))",
        btn_primary_disabled: "hsl(var(--btn-primary-disabled))",

        // secondary button
        btn_secondary: {
          DEFAULT: "hsl(var(--btn-secondary))",
          foreground: "hsl(var(--btn-secondary-foreground))",
        },
        btn_secondary_hover: "hsl(var(--btn-secondary-hover))",
        btn_secondary_pressed: "hsl(var(--btn-secondary-pressed))",
        btn_secondary_disabled: "hsl(var(--btn-secondary-disabled))",
        btn_secondary_disabled_foreground: "hsl(var(--btn-secondary-disabled-foreground))",

        // link button
        btn_link_foreground: "hsl(var(--btn-link-foreground))",
        btn_link_hover_foreground: "hsl(var(--btn-link-hover-foreground))",
        btn_link_disabled_foreground: "hsl(var(--btn-link-disabled-foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        // collapsible keyframes
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
        // spin keyframes
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        //otp input
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        // collapsible animations
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",

        // spit animation
        spin: "spin 1s linear infinite",
        //otp input
        "caret-blink": "caret-blink 1.2s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
