# Design System Specification

## Overview
The Medivo Design System provides atomic design components, responsive layout grids, dark-mode CSS tokens, and custom micro-animations built with Vanilla CSS and TailwindCSS.

---

## Token Specifications

### Color Tokens
- `INK` (`var(--color-ink)`): Primary high-contrast text (`#1E1B4B` in Light, `#F8FAFC` in Dark).
- `INK_SOFT` (`var(--color-ink-soft)`): Soft indigo accent (`#312E81` in Light, `#A5B4FC` in Dark).
- `TEXT_SECONDARY` (`var(--color-text-sec)`): Secondary body text (`#57534E` in Light, `#CBD5E1` in Dark).
- `TEXT_TERTIARY` (`var(--color-text-tert)`): Subtitles & metadata (`#78716C` in Light, `#94A3B8` in Dark).
- `BG_GRADIENT` (`var(--bg-gradient)`): Adaptive page background gradient.
- `CARD_SHADOW` (`var(--card-shadow)`): Elevation box shadows.

---

## Theme Switcher Architecture (System, Dark, Light)
- **Single Toggle Button**: `<ThemeToggleButton />` cycles through `System` → `Dark` → `Light`.
- **System Preference Sync**: Listens to `window.matchMedia('(prefers-color-scheme: dark)')` when set to System.
- **Persistence**: Saved in `localStorage` under `medivo_theme`.

---

## Responsive Layout System
- **Mobile (<768px)**: Touch-optimized bottom navigation (`BottomNav`), single-column card stack.
- **Tablet (768px - 1023px)**: 2 to 3 column grid layouts, adaptive header.
- **Desktop (1024px+)**: Fixed left sidebar navigation (`DesktopSidebar`), sticky top bar (`DesktopHeader`), 4-column metric grids.