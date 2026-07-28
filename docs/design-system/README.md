# Design System Specification

## Overview

The Medivo Design System (`packages/design-system`) provides the complete visual language for the platform. Built with **TailwindCSS**, **TypeScript**, and **shadcn/ui** principles, it uses **Atomic Design** methodology to create a hierarchy of reusable, accessible components.

> **Rule**: Atomic Design applies ONLY inside `packages/design-system`. Business applications must use Domain-Driven Feature Architecture instead.

---

## Atomic Design Hierarchy

```
packages/design-system/src/
├── tokens/                 # Design tokens (the foundation)
│   ├── colors.ts           # Color palette (light + dark mode)
│   ├── typography.ts       # Font families, sizes, weights, line heights
│   ├── spacing.ts          # 4px grid spacing scale
│   ├── radius.ts           # Border radius values
│   └── shadows.ts          # Elevation/box-shadow definitions
├── atoms/                  # Smallest UI elements
│   ├── Button/
│   ├── Input/
│   ├── Badge/
│   ├── Avatar/
│   ├── Icon/
│   ├── Spinner/
│   ├── Toggle/
│   └── Tooltip/
├── molecules/              # Combinations of atoms
│   ├── FormField/          # Label + Input + Error
│   ├── SearchBar/          # Input + Icon + Clear button
│   ├── MetricCard/         # Icon + Value + Label + Delta
│   ├── NavItem/            # Icon + Label + Badge
│   └── ActionPill/         # Icon + Text (quick action)
├── organisms/              # Complex UI sections
│   ├── Header/
│   ├── BottomNav/          # Mobile bottom navigation
│   ├── Sidebar/            # Desktop sidebar navigation
│   ├── DataTable/
│   ├── ScoreRing/          # SVG circular score display
│   └── ChatBubble/         # AI Coach message bubble
├── templates/              # Page-level layout compositions
│   ├── DashboardTemplate/
│   ├── AuthTemplate/
│   ├── ListTemplate/
│   └── DetailTemplate/
└── layouts/                # Responsive shell layouts
    ├── AppLayout/           # Main app shell (nav + content)
    ├── AuthLayout/          # Login/register shell
    └── FullScreenLayout/    # Camera/scanning overlay
```

---

## Design Token Reference

### Color Tokens

| Token | CSS Variable | Light Mode | Dark Mode |
|-------|-------------|------------|-----------|
| `ink` | `--color-ink` | `#1E1B4B` | `#F8FAFC` |
| `ink-soft` | `--color-ink-soft` | `#312E81` | `#A5B4FC` |
| `text-secondary` | `--color-text-sec` | `#57534E` | `#CBD5E1` |
| `text-tertiary` | `--color-text-tert` | `#78716C` | `#94A3B8` |
| `surface` | `--color-surface` | `#FFFFFF` | `#0F172A` |
| `surface-elevated` | `--color-surface-elevated` | `#F8FAFC` | `#1E293B` |
| `accent` | `--color-accent` | `#6366F1` | `#818CF8` |
| `success` | `--color-success` | `#10B981` | `#34D399` |
| `warning` | `--color-warning` | `#F59E0B` | `#FBBF24` |
| `error` | `--color-error` | `#EF4444` | `#F87171` |

### Typography Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `display` | 36px | 700 | 1.2 | Hero headings |
| `h1` | 30px | 700 | 1.25 | Page titles |
| `h2` | 24px | 600 | 1.3 | Section headers |
| `h3` | 20px | 600 | 1.35 | Card titles |
| `body` | 16px | 400 | 1.5 | Default body text |
| `body-sm` | 14px | 400 | 1.5 | Secondary text |
| `caption` | 12px | 500 | 1.4 | Labels, metadata |

### Spacing Scale (4px grid)

`0` · `1` (4px) · `2` (8px) · `3` (12px) · `4` (16px) · `5` (20px) · `6` (24px) · `8` (32px) · `10` (40px) · `12` (48px) · `16` (64px) · `20` (80px)

---

## Component State Requirements

Every component must support these states:

| State | Description |
|-------|------------|
| **Default** | Normal resting state |
| **Hover** | Mouse pointer over (desktop) |
| **Active / Pressed** | Touch/click feedback |
| **Focus** | Keyboard navigation highlight (visible ring) |
| **Disabled** | Non-interactive, reduced opacity |
| **Loading** | Skeleton/spinner placeholder |
| **Error** | Red border, error icon, validation message |
| **Empty** | Illustrated empty state with action CTA |

---

## Responsive Layout System

| Breakpoint | Width | Navigation | Layout |
|-----------|-------|-----------|--------|
| **Mobile** | < 768px | Bottom tab bar (`BottomNav`) | Single-column card stack |
| **Tablet** | 768px – 1023px | Collapsible top/side nav | 2-3 column grid |
| **Desktop** | ≥ 1024px | Fixed left sidebar (`Sidebar`) | 3-4 column dashboard grid |

> **Rule**: NEVER create desktop-only experiences. Every screen must be mobile-responsive.

---

## Theme Switcher

- **Modes**: System → Dark → Light (single button cycle)
- **Strategy**: CSS class on `<html>` element (`class="dark"`)
- **System Sync**: `window.matchMedia('(prefers-color-scheme: dark)')`
- **Persistence**: `localStorage` key `medivo_theme`
- **Transitions**: `transition: background-color 200ms, color 200ms`

---

## Accessibility Requirements

- WCAG 2.1 AA compliance minimum
- Color contrast ratio: ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- All interactive elements must be keyboard navigable
- Focus indicators must be visible and styled
- Screen reader labels on all icon-only buttons
- Touch targets: minimum 44×44px on mobile
- Reduced motion: respect `prefers-reduced-motion` media query

---

## Usage in Business Apps

Business applications do NOT use Atomic Design directly. Instead, they import from the design system:

```tsx
// ✅ Correct: Import from design system
import { Button, MetricCard, AppLayout } from '@medivo/design-system';

// ❌ Wrong: Don't create atoms/molecules in app code
// import { Button } from './atoms/Button';
```

Business apps organize by domain features:
```
features/skin-analysis/
  components/        # Feature-specific compositions using design system
  hooks/
  services/
  types/
```