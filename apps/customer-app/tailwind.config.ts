import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/theme/src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--color-text-primary, #FFFFFF)',
          soft: 'var(--color-text-soft, #577068)',
          muted: 'var(--color-text-muted, #9FC1B6)',
        },
        surface: {
          DEFAULT: 'var(--color-background, #0D1F1C)',
          card: 'var(--color-surface, #162E29)',
          elevated: 'var(--color-surface-elevated, #1C3833)',
        },
        border: {
          DEFAULT: 'var(--color-border, #2A4A43)',
        },
        accent: {
          DEFAULT: '#1F7FC4',
          light: '#58B9EA',
          dark: '#143A63',
        },
        success: {
          DEFAULT: '#0E9E86',
          light: '#46D9A2',
          dark: '#0B7C6B',
        },
        warning: {
          DEFAULT: '#E5876A',
          light: '#F2A65A',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
        },
        brand: {
          primary: '#0E9E86',
          hover: '#0B7C6B',
          light: '#46D9A2',
          dark: '#0D1F1C',
          gold: '#E5876A',
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Inter', 'system-ui', 'sans-serif'],
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
