---
name: design-system
description: Design system development and maintenance guidelines
---

# Design System Guidelines

## Overview
The Medivo Design System (`packages/design-system`) is the single source of truth for UI consistency. It provides a robust, accessible, and purely presentational component library built on TailwindCSS and shadcn/ui. 

*Crucially, this is the ONLY place where Atomic Design principles apply.*

## When to Activate
- When a new, highly reusable UI element is needed (e.g., a new type of toggle switch).
- When updating global design tokens (colors, typography, spacing).
- When modifying base shadcn/ui components.

## Structure & Architecture (Atomic)

The `packages/design-system` is structured atomically:
1. **Tokens:** The fundamental design variables (CSS variables in `globals.css` configured via Tailwind).
2. **Atoms (`src/atoms/`):** Basic, indivisible UI elements (Buttons, Inputs, Icons, Typography).
3. **Molecules (`src/molecules/`):** Simple combinations of atoms (Form Field = Label + Input + Error Message).
4. **Organisms (`src/organisms/`):** Complex, standalone UI sections made of molecules/atoms (e.g., A generic Data Table, a Modal shell).

*(Note: Templates and Pages do not live here; they live in the business applications).*

## Step-by-Step Procedure for a New Component

### 1. Evaluate Reusability
Does this component contain specific business logic (e.g., "Fetch Patient Labs")? 
- **Yes:** It belongs in the application feature folder, NOT here.
- **No, it's generic** (e.g., "Generic Line Chart"): Proceed to build it here.

### 2. Scaffold using shadcn/ui (if applicable)
If the component exists in shadcn/ui, generate it into the design system and customize it to match Medivo's brand tokens.

### 3. Build & Style (Tailwind)
- Use standard Tailwind utility classes.
- Rely on the pre-defined design tokens (e.g., `text-primary`, `bg-background`, `rounded-md`). Do not use arbitrary values (like `w-[321px]`) unless absolutely unavoidable.
- Ensure Dark Mode compatibility (`dark:bg-slate-800`).

### 4. Ensure Accessibility
- The component must meet all requirements outlined in the `accessibility-review` skill.
- Use Radix UI primitives (which power shadcn) for complex accessible logic (Dropdowns, Dialogs).

### 5. Export
Export the component clearly from the package's `index.ts`.

## Rules and Constraints
- **Purely Presentational:** Components in this package must NEVER fetch data, have side effects, or know about Medivo business domains. They receive data via props and emit events via callbacks (`onChange`, `onClick`).
- **No external state:** Do not import Zustand or React Query here.
- **Documentation:** Complex molecules/organisms should include a Storybook file or internal documentation explaining their props.

## Related Skills
- `frontend-design`: How to *consume* these components in the main apps.
- `accessibility-review`: Essential for building base components correctly.
