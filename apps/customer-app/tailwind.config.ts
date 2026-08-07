import type { Config } from 'tailwindcss';
import { tailwindPreset } from '../../packages/theme/src/tailwindPreset';

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/theme/src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset'), tailwindPreset],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--color-text-primary, #0F172A)',
          soft: 'var(--color-text-soft, #64748B)',
          muted: 'var(--color-text-muted, #334155)',
        },
        surface: {
          DEFAULT: 'var(--color-background, #FFFFFF)',
          card: 'var(--color-surface, #F8FAFC)',
          elevated: 'var(--color-surface-elevated, #F1F5F9)',
        },
        border: {
          DEFAULT: 'var(--color-border, #E2E8F0)',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #1F7FC4)',
          light: '#58B9EA',
          dark: '#143A63',
        },
        success: {
          DEFAULT: 'var(--color-success, #059669)',
          light: '#34D399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: 'var(--color-warning, #D97706)',
          light: '#FBBF24',
        },
        error: {
          DEFAULT: 'var(--color-error, #DC2626)',
          light: '#F87171',
        },
        brand: {
          primary: 'var(--color-primary, #1F7FC4)',
          hover: 'var(--color-primary-hover, #1565C0)',
          light: 'var(--color-primary-light, #38BDF8)',
          dark: '#090D16',
          gold: '#D97706',
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
