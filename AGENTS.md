# Medivo Health Intelligence Platform

> AI Engineering Operating System v5.1 — Universal Agent Configuration

## Project Overview
- Name: Medivo Health Intelligence Platform
- Type: AI-powered digital health ecosystem
- Architecture: Modular Monolith with Domain-Driven Design
- Monorepo: Turborepo + pnpm workspaces

## Boot Sequence
Before making ANY changes, read these files in order:
1. `.ai/BOOT/AI_BOOTSTRAP.md` — Session startup, project context, tech stack
2. `.ai/GOVERNANCE/AI_CONSTITUTION.md` — Supreme governance rules
3. `.ai/MEMORY/PROJECT_MEMORY.md` — Architecture decisions, business rules
4. `.ai/MEMORY/SESSION_STATE.md` — Current work state
5. `.ai/MEMORY/HANDOFF.md` — Previous agent's handoff notes

## Source of Truth
The `.ai/` directory is the SINGLE SOURCE OF TRUTH for all project intelligence.
- `.ai/GOVERNANCE/` — Constitution, enforcement rules, compliance checklists
- `.ai/BOOT/` — Bootstrap, agent protocol, context/token policies
- `.ai/MEMORY/` — Project memory, session state, handoff, change history
- `.ai/ARCHITECTURE/` — System/module/API/database/dependency maps
- `.ai/DECISIONS/` — Architecture Decision Records (ADRs)
- `.ai/REVIEWS/` — Code review checklists
- `.ai/SKILLS/` — Skill registry and 14 skill files
- `.ai/AUTOMATION/` — Memory update, document sync, change analysis rules

## Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js, TypeScript, TailwindCSS, shadcn/ui |
| State | Zustand (client), React Query (server) |
| Forms | React Hook Form + Zod |
| Mobile | React Native + Expo |
| Backend | Node.js, TypeScript, Clean Architecture |
| Database | PostgreSQL (single instance, schema-per-domain) |
| Cache | Redis |
| Queue | BullMQ |
| Storage | S3-compatible |
| Monorepo | Turborepo + pnpm |

## Architecture Rules
- **Modular Monolith**: Each domain is independently extractable to microservices
- **Schema-per-Domain**: 13 PostgreSQL schemas, each owned by one domain. NO cross-schema JOINs
- **BFF Pattern**: customer-bff (web+mobile), doctor-bff, admin-bff
- **Clean Architecture**: Domain → Application → Infrastructure layers
- **Event-Driven**: Domain events for cross-domain communication

## Monorepo Structure
```
apps/           → marketing-web, customer-platform, mobile, doctor-portal, admin-panel, customer-bff, doctor-bff, admin-bff
packages/       → design-system, ui, theme, icons, auth, api-client, ai, skin, health, reports, ecommerce, products, checkout, orders, appointments, doctor, profile, subscriptions, notifications, analytics, charts, forms, types, utils
services/       → api, ai, auth, commerce, appointments, notifications
tooling/        → eslint, prettier, tailwind, typescript
docs/           → architecture, api, product, design-system, adr
```

## Code Generation Rules

### TypeScript
- Strict mode everywhere — no `any` types
- All API responses typed with Zod schemas
- Exhaustive error handling — no silent catches
- Use `unknown` instead of `any`, then narrow

### File Organization
- **Design System** (`packages/design-system`): Atomic Design (atoms → molecules → organisms → templates → layouts)
- **Business Apps** (`apps/*`): Domain-Driven Feature Architecture
  ```
  features/
    skin-analysis/
      components/
      hooks/
      services/
      api/
      types/
      schemas/
      store/
      utils/
  ```
- NEVER use Atomic Design outside `packages/design-system`

### Domain Boundaries
- Each domain owns: schema, tables, migrations, repository, business logic
- No cross-domain imports — use shared packages (types, utils, api-client)
- Cross-domain data access via service layer only
- Domain events for cross-domain side effects

### Dependency Direction
```
apps → packages → types (NEVER reverse)
services → packages → types (NEVER to apps)
```

### Data Access
- Repository pattern for ALL database access
- No direct DB queries from application layer
- No cross-schema JOINs

## Testing Requirements
- Unit tests: Domain/business logic (90% coverage target)
- Integration tests: API endpoints, service interactions (70%)
- E2E tests: Critical user flows
- All health data handling requires consent verification tests

## Security Requirements
- Health data encrypted at rest and in transit
- User consent required before AI analysis
- Medical disclaimers on all AI-generated insights
- HIPAA-aware data handling
- JWT authentication with proper token rotation
- Input validation with Zod on all API boundaries

## Responsive Design
- Mobile: Bottom navigation, touch-optimized, camera workflows
- Tablet: Adaptive layouts, collapsible navigation
- Desktop: Sidebar navigation, multi-column dashboards
- NEVER create desktop-only experiences

## Session Management
After completing work, update:
- `.ai/MEMORY/SESSION_STATE.md` — Record what you did
- `.ai/MEMORY/HANDOFF.md` — Prepare for next agent
- `.ai/MEMORY/CHANGE_HISTORY.md` — Log significant changes
- `.ai/MEMORY/PROJECT_MEMORY.md` — If architecture decisions or business rules changed

## Skill Discovery
Check `.ai/SKILLS/registry.yaml` for available skills:
- **Core**: brainstorm, find-skills, planning, research, problem-solving
- **Design**: frontend-design, ux-review, accessibility-review, design-system
- **Engineering**: backend-development, database-design, security-review, testing, debugging, performance-analysis, deployment
