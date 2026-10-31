/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}", // Added to catch files in root
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151f32',
          900: '#0f172a',
          950: '#020617',
        },
        primary: {
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}