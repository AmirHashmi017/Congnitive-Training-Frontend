/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Duolingo-inspired palette
        primary: "#58cc02",
        "primary-dark": "#46a302",
        secondary: "#1cb0f6",
        "secondary-dark": "#1899d6",
        danger: "#ff4b4b",
        "danger-dark": "#d33131",
        warning: "#ffc800",
        "warning-dark": "#e5a400",
        background: "#ffffff",
        surface: "#f7f7f7",
        text: "#4b4b4b",
        "text-muted": "#afafaf",
      },
      fontFamily: {
        // Using a clean sans-serif as base, will suggest fonts later
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'duo': '0 4px 0 0 rgba(0,0,0,0.1)',
        'duo-active': '0 2px 0 0 rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}
