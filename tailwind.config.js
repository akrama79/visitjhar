/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#0f172a',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        primary: {
          DEFAULT: '#1e3d30',
          foreground: '#ffffff',
          light: '#2d5a47',
          dark: '#142a21',
        },
        secondary: {
          DEFAULT: '#f4f6f4',
          foreground: '#1e3d30',
        },
        accent: {
          DEFAULT: '#d97706',
          foreground: '#ffffff',
          light: '#f59e0b',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        border: '#e2e8f0',
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
