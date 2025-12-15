import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Royal Emerald & Gold Color Scheme
        emerald: {
          DEFAULT: '#0F6F56',
          dark: '#043B2F',
        },
        gold: {
          DEFAULT: '#D4A657',
          light: '#E8C97A',
          dark: '#B8943F',
        },
        ivory: {
          DEFAULT: '#F7F6F2',
          light: '#FFFFFF',
          dark: '#E8E6E0',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          light: '#4A4A4A',
          lighter: '#6A6A6A',
        },
        // Legacy support - mapped to new colors
        primary: {
          50: '#F7F6F2',
          100: '#E8E6E0',
          200: '#D4A657',
          300: '#0F6F56',
          400: '#0F6F56',
          500: '#0F6F56',
          600: '#043B2F',
          700: '#043B2F',
          800: '#043B2F',
          900: '#1A1A1A',
        },
        success: {
          DEFAULT: '#0F6F56',
          light: '#E8F5F2',
        },
        warning: {
          DEFAULT: '#D4A657',
          light: '#F5F0E8',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        info: {
          DEFAULT: '#0F6F56',
          light: '#E8F5F2',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

