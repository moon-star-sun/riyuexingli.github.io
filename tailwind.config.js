/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7f4',
          100: '#e8efea',
          200: '#d3e0d7',
          300: '#b5c9b6',
          400: '#93a695',
          500: '#8BA48B', // 莫兰迪绿
          600: '#6f8370',
          700: '#5a6a5c',
          800: '#485449',
          900: '#3d453d',
        },
        secondary: {
          50: '#fcfcd9',
          100: '#f8f9b2',
          200: '#f3f48a',
          300: '#ebed5f',
          400: '#e3e33b',
          500: '#F0E68C', // 低饱和黄色
          600: '#d1c044',
          700: '#b1a537',
          800: '#8f852d',
          900: '#746a25',
        },
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1, transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}