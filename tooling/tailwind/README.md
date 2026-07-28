# TailwindCSS Configuration

> Shared TailwindCSS preset and design token configuration for the Medivo Health Intelligence Platform.

## Overview

This package provides a centralized TailwindCSS configuration that maps to the design system tokens defined in `packages/design-system`. All apps consume this preset for visual consistency.

## Design Token Mapping

### Colors
| Token | CSS Variable | Light | Dark |
|-------|-------------|-------|------|
| `ink` | `--color-ink` | `#1E1B4B` | `#F8FAFC` |
| `ink-soft` | `--color-ink-soft` | `#312E81` | `#A5B4FC` |
| `surface` | `--color-surface` | `#FFFFFF` | `#0F172A` |
| `surface-elevated` | `--color-surface-elevated` | `#F8FAFC` | `#1E293B` |
| `accent` | `--color-accent` | `#6366F1` | `#818CF8` |
| `success` | `--color-success` | `#10B981` | `#34D399` |
| `warning` | `--color-warning` | `#F59E0B` | `#FBBF24` |
| `error` | `--color-error` | `#EF4444` | `#F87171` |

### Breakpoints
| Name | Value | Target |
|------|-------|--------|
| `sm` | `640px` | Small mobile |
| `md` | `768px` | Tablet |
| `lg` | `1024px` | Desktop |
| `xl` | `1280px` | Large desktop |

### Typography Scale
Based on `packages/design-system/src/tokens/typography`:
- Font family: Inter (primary), system-ui (fallback)
- Scale: xs (12px) → 5xl (48px)

### Spacing & Radius
- Spacing: 4px grid system (0.5rem increments)
- Border radius: `sm` (4px), `md` (8px), `lg` (12px), `xl` (16px), `full`

## Usage

In any app's `tailwind.config.ts`:
```typescript
import { medivoPeset } from '@medivo/tailwind-config';

export default {
  presets: [medivoPreset],
  content: ['./src/**/*.{ts,tsx}'],
};
```

## Dark Mode

Uses `class` strategy: dark mode activated by `<html class="dark">`.
Theme switcher cycles: System → Dark → Light.

## Responsive Design Rules
- Mobile-first: Base styles target mobile
- Use `md:` prefix for tablet adaptations
- Use `lg:` prefix for desktop layouts
- NEVER create desktop-only components

## Status
✅ Configuration defined — see `index.js` for preset export