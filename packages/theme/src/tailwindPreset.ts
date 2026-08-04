/** @type {import('tailwindcss').Config} */
export const tailwindPreset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-primary, #1F7FC4)',
          hover: 'var(--color-primary-hover, #1565C0)',
          light: 'var(--color-primary-light, #38BDF8)',
          50: '#eef6fc',
          100: '#d5e8f7',
          500: '#1f7fc4',
          600: '#1565c0',
          700: '#0f426f',
          900: '#090d16',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #0284C7)',
          hover: 'var(--color-accent-hover, #0369A1)',
        },
        surface: {
          DEFAULT: 'var(--color-background, #FFFFFF)',
          card: 'var(--color-surface, #F8FAFC)',
          elevated: 'var(--color-surface-elevated, #F1F5F9)',
        },
        border: {
          DEFAULT: 'var(--color-border, #E2E8F0)',
        },
        ink: {
          primary: 'var(--color-text-primary, #0F172A)',
          muted: 'var(--color-text-muted, #334155)',
          soft: 'var(--color-text-soft, #64748B)',
        },
      },
    },
  },
};

export default tailwindPreset;
