# Architecture Decision Records (ADRs)

> Canonical ADR files are stored in `.ai/DECISIONS/`. This document provides the human-readable index.

---

## ADR Index

| # | Decision | Status | Date | Impact |
|---|----------|--------|------|--------|
| [ADR-001](file:///g:/laragon/www/medivo/medivo-health-intelligence/.ai/DECISIONS/ADR-001-modular-monolith.md) | Modular Monolith Architecture | ✅ Accepted | 2026-07-28 | Critical |
| [ADR-002](file:///g:/laragon/www/medivo/medivo-health-intelligence/.ai/DECISIONS/ADR-002-single-postgresql-schema-per-domain.md) | Single PostgreSQL with Schema-per-Domain | ✅ Accepted | 2026-07-28 | Critical |
| [ADR-003](file:///g:/laragon/www/medivo/medivo-health-intelligence/.ai/DECISIONS/ADR-003-bff-pattern.md) | Backend-For-Frontend (BFF) Pattern | ✅ Accepted | 2026-07-28 | High |
| [ADR-004](file:///g:/laragon/www/medivo/medivo-health-intelligence/.ai/DECISIONS/ADR-004-nextjs-pwa.md) | Next.js Progressive Web Application | ✅ Accepted | 2026-07-28 | High |
| [ADR-005](file:///g:/laragon/www/medivo/medivo-health-intelligence/.ai/DECISIONS/ADR-005-design-system-atomic.md) | Atomic Design Scoped to Design System | ✅ Accepted | 2026-07-28 | Medium |

---

## Decision Summaries

### ADR-001: Modular Monolith Architecture

- **Context**: The platform requires microservice-level domain isolation without the operational overhead of distributed services for a small initial team.
- **Decision**: Adopt a Modular Monolith with strict domain boundaries, each independently extractable to microservices.
- **Consequences**: Faster development velocity, simpler deployment, clear migration path to microservices when scaling demands it.

### ADR-002: Single PostgreSQL with Schema-per-Domain

- **Context**: Need data isolation between domains while avoiding the complexity of managing multiple database instances during early development.
- **Decision**: Use a single PostgreSQL instance with 13 domain-owned schemas (`auth_schema`, `user_schema`, `skin_schema`, etc.). No cross-schema JOINs allowed.
- **Consequences**: Operational simplicity, strong data consistency guarantees, clean extraction path (each schema → independent database).

### ADR-003: Backend-For-Frontend (BFF) Pattern

- **Context**: Different clients (customer web/mobile, doctor portal, admin panel) have distinct data needs, security requirements, and API shapes.
- **Decision**: Create dedicated BFF services: `customer-bff`, `doctor-bff`, `admin-bff`.
- **Consequences**: Frontend-optimized APIs, reduced over-fetching, better security boundaries, independent deployment per client type.

### ADR-004: Next.js Progressive Web Application

- **Context**: The customer platform must work across mobile, tablet, and desktop with native-like capabilities (camera, push notifications, offline).
- **Decision**: Build as a responsive Next.js PWA with SSR/SSG capabilities.
- **Consequences**: Single codebase for all screen sizes, SEO benefits, installable on mobile, reduced need for separate web and mobile codebases (native app via React Native + Expo for deep hardware access).

### ADR-005: Atomic Design Scoped to Design System

- **Context**: Need a systematic component architecture, but Atomic Design applied everywhere leads to rigid, hard-to-navigate business feature code.
- **Decision**: Restrict Atomic Design (atoms → molecules → organisms → templates → layouts) to `packages/design-system` only. Business apps use Domain-Driven Feature Architecture.
- **Consequences**: Design system maintains rigorous component hierarchy; business apps remain organized by domain feature with clear ownership boundaries.

---

## Creating New ADRs

Use the template at [ADR_TEMPLATE.md](file:///g:/laragon/www/medivo/medivo-health-intelligence/.ai/DECISIONS/ADR_TEMPLATE.md).

Required sections:
- **Title & Status** (Proposed → Accepted → Deprecated → Superseded)
- **Context**: The situation and forces at play
- **Decision**: What was decided
- **Rationale**: Why this option was chosen over alternatives
- **Consequences**: Positive and negative outcomes
- **Alternatives Considered**: What was rejected and why

File naming convention: `ADR-{NNN}-{kebab-case-title}.md`