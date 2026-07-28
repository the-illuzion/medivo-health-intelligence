/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1E1B4B',
          soft: '#312E81',
        },
        textSec: '#57534E',
        textTert: '#78716C',
        textFaint: '#A8A29E',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 16px rgba(49,46,129,0.06)',
        lift: '0 10px 28px rgba(49,46,129,0.14)',
        nav: '0 14px 36px rgba(49,46,129,0.2)',
      },
    },
  },
  plugins: [],
};
