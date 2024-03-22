import type { Config } from 'tailwindcss';

const convertToRGB = (variableName: string) => `rgba(var(${variableName}))`;

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        "custom-shadow-2xs": "var(--color-shadow-2xs)",
        "custom-shadow-xs": "var(--color-shadow-xs)",
        "custom-shadow-sm": "var(--color-shadow-sm)",
        "custom-shadow-rg": "var(--color-shadow-rg)",
        "custom-shadow-md": "var(--color-shadow-md)",
        "custom-shadow-lg": "var(--color-shadow-lg)",
        "custom-shadow-xl": "var(--color-shadow-xl)",
        "custom-shadow-2xl": "var(--color-shadow-2xl)",
        "custom-shadow-3xl": "var(--color-shadow-3xl)",
        "custom-sidebar-shadow-2xs": "var(--color-sidebar-shadow-2xs)",
        "custom-sidebar-shadow-xs": "var(--color-sidebar-shadow-xs)",
        "custom-sidebar-shadow-sm": "var(--color-sidebar-shadow-sm)",
        "custom-sidebar-shadow-rg": "var(--color-sidebar-shadow-rg)",
        "custom-sidebar-shadow-md": "var(--color-sidebar-shadow-md)",
        "custom-sidebar-shadow-lg": "var(--color-sidebar-shadow-lg)",
        "custom-sidebar-shadow-xl": "var(--color-sidebar-shadow-xl)",
        "custom-sidebar-shadow-2xl": "var(--color-sidebar-shadow-2xl)",
        "custom-sidebar-shadow-3xl": "var(--color-sidebar-shadow-3xl)",
      },
      colors: {
        custom: {
          primary: {
            0: "rgb(255, 255, 255)",
            10: convertToRGB("--color-primary-10"),
            20: convertToRGB("--color-primary-20"),
            30: convertToRGB("--color-primary-30"),
            40: convertToRGB("--color-primary-40"),
            50: convertToRGB("--color-primary-50"),
            60: convertToRGB("--color-primary-60"),
            70: convertToRGB("--color-primary-70"),
            80: convertToRGB("--color-primary-80"),
            90: convertToRGB("--color-primary-90"),
            100: convertToRGB("--color-primary-100"),
            200: convertToRGB("--color-primary-200"),
            300: convertToRGB("--color-primary-300"),
            400: convertToRGB("--color-primary-400"),
            500: convertToRGB("--color-primary-500"),
            600: convertToRGB("--color-primary-600"),
            700: convertToRGB("--color-primary-700"),
            800: convertToRGB("--color-primary-800"),
            900: convertToRGB("--color-primary-900"),
            1000: "rgb(0, 0, 0)",
            DEFAULT: convertToRGB("--color-primary-100"),
          },
          background: {
            0: "rgb(255, 255, 255)",
            10: convertToRGB("--color-background-10"),
            20: convertToRGB("--color-background-20"),
            30: convertToRGB("--color-background-30"),
            40: convertToRGB("--color-background-40"),
            50: convertToRGB("--color-background-50"),
            60: convertToRGB("--color-background-60"),
            70: convertToRGB("--color-background-70"),
            80: convertToRGB("--color-background-80"),
            90: convertToRGB("--color-background-90"),
            100: convertToRGB("--color-background-100"),
            200: convertToRGB("--color-background-200"),
            300: convertToRGB("--color-background-300"),
            400: convertToRGB("--color-background-400"),
            500: convertToRGB("--color-background-500"),
            600: convertToRGB("--color-background-600"),
            700: convertToRGB("--color-background-700"),
            800: convertToRGB("--color-background-800"),
            900: convertToRGB("--color-background-900"),
            1000: "rgb(0, 0, 0)",
            DEFAULT: convertToRGB("--color-background-100"),
          },
          text: {
            0: "rgb(255, 255, 255)",
            10: convertToRGB("--color-text-10"),
            20: convertToRGB("--color-text-20"),
            30: convertToRGB("--color-text-30"),
            40: convertToRGB("--color-text-40"),
            50: convertToRGB("--color-text-50"),
            60: convertToRGB("--color-text-60"),
            70: convertToRGB("--color-text-70"),
            80: convertToRGB("--color-text-80"),
            90: convertToRGB("--color-text-90"),
            100: convertToRGB("--color-text-100"),
            200: convertToRGB("--color-text-200"),
            300: convertToRGB("--color-text-300"),
            400: convertToRGB("--color-text-400"),
            500: convertToRGB("--color-text-500"),
            600: convertToRGB("--color-text-600"),
            700: convertToRGB("--color-text-700"),
            800: convertToRGB("--color-text-800"),
            900: convertToRGB("--color-text-900"),
            1000: "rgb(0, 0, 0)",
            DEFAULT: convertToRGB("--color-text-100"),
          },
          border: {
            0: "rgb(255, 255, 255)",
            100: convertToRGB("--color-border-100"),
            200: convertToRGB("--color-border-200"),
            300: convertToRGB("--color-border-300"),
            400: convertToRGB("--color-border-400"),
            1000: "rgb(0, 0, 0)",
            DEFAULT: convertToRGB("--color-border-200"),
          },
          sidebar: {
            background: {
              0: "rgb(255, 255, 255)",
              10: convertToRGB("--color-sidebar-background-10"),
              20: convertToRGB("--color-sidebar-background-20"),
              30: convertToRGB("--color-sidebar-background-30"),
              40: convertToRGB("--color-sidebar-background-40"),
              50: convertToRGB("--color-sidebar-background-50"),
              60: convertToRGB("--color-sidebar-background-60"),
              70: convertToRGB("--color-sidebar-background-70"),
              80: convertToRGB("--color-sidebar-background-80"),
              90: convertToRGB("--color-sidebar-background-90"),
              100: convertToRGB("--color-sidebar-background-100"),
              200: convertToRGB("--color-sidebar-background-200"),
              300: convertToRGB("--color-sidebar-background-300"),
              400: convertToRGB("--color-sidebar-background-400"),
              500: convertToRGB("--color-sidebar-background-500"),
              600: convertToRGB("--color-sidebar-background-600"),
              700: convertToRGB("--color-sidebar-background-700"),
              800: convertToRGB("--color-sidebar-background-800"),
              900: convertToRGB("--color-sidebar-background-900"),
              1000: "rgb(0, 0, 0)",
              DEFAULT: convertToRGB("--color-sidebar-background-100"),
            },
            text: {
              0: "rgb(255, 255, 255)",
              10: convertToRGB("--color-sidebar-text-10"),
              20: convertToRGB("--color-sidebar-text-20"),
              30: convertToRGB("--color-sidebar-text-30"),
              40: convertToRGB("--color-sidebar-text-40"),
              50: convertToRGB("--color-sidebar-text-50"),
              60: convertToRGB("--color-sidebar-text-60"),
              70: convertToRGB("--color-sidebar-text-70"),
              80: convertToRGB("--color-sidebar-text-80"),
              90: convertToRGB("--color-sidebar-text-90"),
              100: convertToRGB("--color-sidebar-text-100"),
              200: convertToRGB("--color-sidebar-text-200"),
              300: convertToRGB("--color-sidebar-text-300"),
              400: convertToRGB("--color-sidebar-text-400"),
              500: convertToRGB("--color-sidebar-text-500"),
              600: convertToRGB("--color-sidebar-text-600"),
              700: convertToRGB("--color-sidebar-text-700"),
              800: convertToRGB("--color-sidebar-text-800"),
              900: convertToRGB("--color-sidebar-text-900"),
              1000: "rgb(0, 0, 0)",
              DEFAULT: convertToRGB("--color-sidebar-text-100"),
            },
            border: {
              0: "rgb(255, 255, 255)",
              100: convertToRGB("--color-sidebar-border-100"),
              200: convertToRGB("--color-sidebar-border-200"),
              300: convertToRGB("--color-sidebar-border-300"),
              400: convertToRGB("--color-sidebar-border-400"),
              1000: "rgb(0, 0, 0)",
              DEFAULT: convertToRGB("--color-sidebar-border-200"),
            },
          },
          backdrop: "#131313",
        },
      },
      keyframes: {
        leftToaster: {
          "0%": { left: "-20rem" },
          "100%": { left: "0" },
        },
        rightToaster: {
          "0%": { right: "-20rem" },
          "100%": { right: "0" },
        },
        "bar-loader": {
          from: { left: "-100%" },
          to: { left: "100%" },
        },
      },
      typography: ({ theme }) => ({
        brand: {
          css: {
            "--tw-prose-body": convertToRGB("--color-text-100"),
            "--tw-prose-p": convertToRGB("--color-text-100"),
            "--tw-prose-headings": convertToRGB("--color-text-100"),
            "--tw-prose-lead": convertToRGB("--color-text-100"),
            "--tw-prose-links": convertToRGB("--color-primary-100"),
            "--tw-prose-bold": convertToRGB("--color-text-100"),
            "--tw-prose-counters": convertToRGB("--color-text-100"),
            "--tw-prose-bullets": convertToRGB("--color-text-100"),
            "--tw-prose-hr": convertToRGB("--color-text-100"),
            "--tw-prose-quotes": convertToRGB("--color-text-100"),
            "--tw-prose-quote-borders": convertToRGB("--color-border"),
            "--tw-prose-code": convertToRGB("--color-text-100"),
            "--tw-prose-pre-code": convertToRGB("--color-text-100"),
            "--tw-prose-pre-bg": convertToRGB("--color-background-100"),
            "--tw-prose-th-borders": convertToRGB("--color-border"),
            "--tw-prose-td-borders": convertToRGB("--color-border"),
          },
        },
      }),

      // scale down font sizes to 90% of default
      fontSize: {
        xs: "0.675rem",
        sm: "0.7875rem",
        base: "0.9rem",
        lg: "1.0125rem",
        xl: "1.125rem",
        "2xl": "1.35rem",
        "3xl": "1.6875rem",
        "4xl": "2.25rem",
        "5xl": "2.7rem",
        "6xl": "3.375rem",
        "7xl": "4.05rem",
        "8xl": "5.4rem",
        "9xl": "7.2rem",
      },
      // scale down spacing to 90% of default
      padding: {
        0: "0",
        0.5: "0.1125rem",
        1: "0.225rem",
        1.5: "0.3375rem",
        2: "0.45rem",
        2.5: "0.5625rem",
        3: "0.675rem",
        3.5: "0.7875rem",
        4: "0.9rem",
        5: "1.125rem",
        6: "1.35rem",
        7: "1.575rem",
        8: "1.8rem",
        9: "2.025rem",
        10: "2.25rem",
        11: "2.475rem",
        12: "2.7rem",
        16: "3.6rem",
        20: "4.5rem",
        24: "5.4rem",
        32: "7.2rem",
        40: "9rem",
        48: "10.8rem",
        56: "12.6rem",
        64: "14.4rem",
        72: "16.2rem",
        80: "18rem",
        96: "21.6rem",
      },
      margin: {
        0: "0",
        0.5: "0.1125rem",
        1: "0.225rem",
        1.5: "0.3375rem",
        2: "0.45rem",
        2.5: "0.5625rem",
        3: "0.675rem",
        3.5: "0.7875rem",
        4: "0.9rem",
        5: "1.125rem",
        6: "1.35rem",
        7: "1.575rem",
        8: "1.8rem",
        9: "2.025rem",
        10: "2.25rem",
        11: "2.475rem",
        12: "2.7rem",
        16: "3.6rem",
        20: "4.5rem",
        24: "5.4rem",
        32: "7.2rem",
        40: "9rem",
        48: "10.8rem",
        56: "12.6rem",
        64: "14.4rem",
        72: "16.2rem",
        80: "18rem",
        96: "21.6rem",
      },
      space: {
        0: "0",
        0.5: "0.1125rem",
        1: "0.225rem",
        1.5: "0.3375rem",
        2: "0.45rem",
        2.5: "0.5625rem",
        3: "0.675rem",
        3.5: "0.7875rem",
        4: "0.9rem",
        5: "1.125rem",
        6: "1.35rem",
        7: "1.575rem",
        8: "1.8rem",
        9: "2.025rem",
        10: "2.25rem",
        11: "2.475rem",
        12: "2.7rem",
        16: "3.6rem",
        20: "4.5rem",
        24: "5.4rem",
        32: "7.2rem",
        40: "9rem",
        48: "10.8rem",
        56: "12.6rem",
        64: "14.4rem",
        72: "16.2rem",
        80: "18rem",
        96: "21.6rem",
      },
      gap: {
        0: "0",
        0.5: "0.1125rem",
        1: "0.225rem",
        1.5: "0.3375rem",
        2: "0.45rem",
        2.5: "0.5625rem",
        3: "0.675rem",
        3.5: "0.7875rem",
        4: "0.9rem",
        5: "1.125rem",
        6: "1.35rem",
        7: "1.575rem",
        8: "1.8rem",
        9: "2.025rem",
        10: "2.25rem",
        11: "2.475rem",
        12: "2.7rem",
        16: "3.6rem",
        20: "4.5rem",
        24: "5.4rem",
        32: "7.2rem",
        40: "9rem",
        48: "10.8rem",
        56: "12.6rem",
        64: "14.4rem",
        72: "16.2rem",
        80: "18rem",
        96: "21.6rem",
      },
    },
    fontFamily: {
      custom: ["Inter", "sans-serif"],
    },
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [require("daisyui")],
}
export default config
