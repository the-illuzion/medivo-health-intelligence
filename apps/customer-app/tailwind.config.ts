import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--color-ink)',
          soft: 'var(--color-ink-soft)',
        },
        surface: {
          DEFAULT: '#0D1F1C',
          elevated: '#162E29',
          card: '#1C3833',
        },
        accent: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
        },
        brand: {
          primary: '#10B981',
          dark: '#0D1F1C',
          gold: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
      },
      borderRadius: {
        'card': '16px',
        'pill': '24px',
      },
    },
  },
  plugins: [],
} satisfies Config;
