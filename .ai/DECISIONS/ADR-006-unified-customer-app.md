# ADR-006: Unified Customer Platform with React Native, Expo Web, and NativeWind

## Status
Accepted

## Date
2026-08-04

## Context
The customer-facing experience was previously fragmented between `apps/customer-platform` (Next.js web application, 9 screens) and `apps/mobile` (React Native mobile application, 21 screens). This created code duplication, inconsistent user experience, double maintenance overhead, and zero UI component sharing between web and mobile.

We required a unified application architecture that allows a single codebase to target iOS, Android, and Web platforms natively without compromising on performance, design quality, or native hardware capabilities (e.g. camera, biometrics, secure storage).

## Decision
We will consolidate `apps/customer-platform` and `apps/mobile` into a single React Native + Expo application located at `apps/customer-app` (`@medivo/customer-app`).

Key technical choices:
1. **Routing**: Expo Router (`app/` file-based routing) for unified navigation on iOS, Android, and Web.
2. **Styling**: NativeWind v4 for TailwindCSS utility classes across React Native and Web components.
3. **Platform Adapters**: Extension-based platform branching (`.ts` vs `.web.ts`) for hardware/platform specifics (camera, storage, notifications).
4. **Data Visualizations**: Victory Native (`victory-native`) replacing `recharts` for cross-platform charts.

Marketing Web (`apps/marketing-web`), Doctor Portal (`apps/doctor-portal`), and Admin Panel (`apps/admin-panel`) remain separate Next.js applications due to distinct target audiences, SEO requirements, or internal desktop usage.

## Rationale
1. **Single Source of Truth**: Eliminates feature drift between web and mobile platforms.
2. **Developer Velocity**: Write UI components and feature logic once; deploy everywhere.
3. **NativeWind v4 Integration**: NativeWind v4 compiles Tailwind CSS utility classes into native styles on mobile and optimized CSS on web.
4. **EAS & Expo Web Compatibility**: Expo Router enables static web generation alongside iOS and Android app bundles.

## Consequences

### Positive
- Unified design system across web and mobile.
- Reduced maintenance effort for 21+ customer-facing screens.
- Consistent routing paradigm (Expo Router file-based routing) familiar to Next.js developers.

### Negative / Trade-offs
- Web bundle size and performance require careful optimization (lazy loading, virtualized lists).
- Platform adapters (`.web.ts`) are necessary for web-specific browser APIs vs native device APIs.

## Implementation Notes
- Rename `apps/mobile/` → `apps/customer-app/` (`@medivo/customer-app`).
- Update root workspace configurations (`pnpm-workspace.yaml`, `package.json`, `turbo.json`).
- Decommission and sunset `apps/customer-platform/` after web verification.
