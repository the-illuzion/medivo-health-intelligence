# Architecture Decision Records (ADRs)

## Index of Decisions

### ADR 001: Monorepo Architecture with Turborepo & pnpm Workspaces
- **Status**: Accepted
- **Context**: The Medivo platform comprises customer platforms, doctor portals, admin panels, and backend microservices sharing types, UI components, and domain business logic.
- **Decision**: Adopt Turborepo and `pnpm` workspaces with strict dependency rules (`apps → packages → types`).
- **Consequences**: Fast incremental builds, shared type safety across frontend and backend BFFs.

---

### ADR 002: Modular Monolith with 13 Schema-per-Domain Isolation
- **Status**: Accepted
- **Context**: Need microservice scalability without the early network overhead of distributed microservices.
- **Decision**: Structure PostgreSQL into 13 isolated domain schemas with zero cross-schema SQL JOINs.
- **Consequences**: Easy future extraction of any schema into an independent microservice when scaling demands require it.

---

### ADR 003: Single Button 3-Mode Theme Switcher (System, Dark, Light)
- **Status**: Accepted
- **Context**: Provide effortless dark mode toggling across mobile and desktop without cluttering headers.
- **Decision**: Implement a single button cycling through System, Dark, and Light modes backed by CSS variables.
- **Consequences**: Consistent, high-contrast dark theme rendering across all 9 Customer Portal screens.