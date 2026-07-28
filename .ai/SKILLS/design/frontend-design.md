---
name: frontend-design
description: Frontend architecture and component design for Medivo Apps
---

# Frontend Design Guidelines

## Overview
This skill governs how frontend code is structured and written within the Medivo ecosystem. It focuses on the Next.js applications (PWA, Portals) and enforces a Domain-Driven Feature Architecture, separating business logic from generic UI components.

## When to Activate
- When creating a new page or feature in the web app.
- When restructuring or refactoring React components.
- When implementing complex client-side state.

## Core Architecture: Feature-Based Organization
Unlike the `design-system`, business applications use **Feature-Based Organization**. Code is grouped by domain, not by technical type.

```text
apps/patient-web/
  src/
    features/
      appointments/
        components/ (Feature-specific UI, e.g., AppointmentCard)
        api/ (React Query hooks, BFF calls)
        hooks/ (Feature-specific logic)
        types/
        index.ts (Public API for this feature)
      billing/
        ...
```
*Rule:* Features should not import internals from other features. They must use the exported API (`index.ts`) of other features.

## Step-by-Step Procedure for a New Feature

### 1. Scaffold the Feature Directory
Create the folder structure under `features/<domain_name>`.

### 2. Define Types & API Interfaces
Start by defining the TypeScript interfaces for the data you expect from the BFF.
Create the data fetching hooks using **React Query** (`@tanstack/react-query`).

### 3. Build Feature Components
- Build the UI specific to this feature.
- **Import generic UI from the Design System** (e.g., `<Button>`, `<Card>`).
- Combine them with feature-specific data and state.

### 4. State Management
- **Server State:** Use React Query for caching, fetching, and synchronizing with the BFF.
- **Local UI State:** Use `useState` or `useReducer` within components.
- **Global UI State:** Use **Zustand** only when state must be shared across disparate features (e.g., "Is the user currently offline?"). Avoid Redux.

### 5. Page Integration
Import the composed Feature components into the Next.js `app/` router pages. Pages should ideally be very thin wrappers that just render the primary feature component.

## PWA & Responsive Requirements
- **Mobile First:** All layouts must be designed for mobile screens first, then scaled up to tablet and desktop.
- **Touch Friendly:** Use appropriate padding for touch targets.
- **Offline States:** UI must gracefully handle network failures (e.g., showing cached data with a "You are offline" banner).

## Rules and Constraints
- **No pure UI components in features.** If a component is highly reusable (e.g., a styled `<Select>` box), move it to `packages/design-system`.
- **Strict Types:** No `any`. Use `unknown` if absolutely necessary, but prefer strict Zod schemas for API responses.
- **Keep Pages Thin:** Next.js routing files (`page.tsx`) should not contain complex business logic or massive component trees. Delegate to feature components.

## Related Skills
- `design-system`: For understanding where generic components live.
- `ux-review`: To ensure the frontend meets health UI standards.
- `performance-analysis`: To ensure the React tree is optimized.
