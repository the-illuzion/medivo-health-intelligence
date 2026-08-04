/** @type {import('tailwindcss').Config} */
export const tailwindPreset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-primary, #10B981)',
          hover: 'var(--color-primary-hover, #059669)',
          light: 'var(--color-primary-light, #34D399)',
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #6366F1)',
          hover: 'var(--color-accent-hover, #4F46E5)',
        },
        surface: {
          DEFAULT: 'var(--color-background, #0D1F1C)',
          card: 'var(--color-surface, #162E29)',
          elevated: 'var(--color-surface-elevated, #1C3833)',
        },
        border: {
          DEFAULT: 'var(--color-border, #2A4A43)',
        },
        ink: {
          primary: 'var(--color-text-primary, #FFFFFF)',
          muted: 'var(--color-text-muted, #94A3B8)',
          soft: 'var(--color-text-soft, #64748B)',
        },
      },
    },
  },
};

export default tailwindPreset;
