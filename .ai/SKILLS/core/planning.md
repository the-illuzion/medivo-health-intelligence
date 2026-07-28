---
name: planning
description: Implementation planning methodology for Medivo
---

# Planning Methodology

## Overview
This skill outlines how to create robust, step-by-step implementation plans. Because Medivo uses a Modular Monolith and Clean Architecture, planning must account for strict boundaries, API contracts, and security before code is written.

## When to Activate
- After brainstorming and before writing code for any feature larger than a trivial bug fix.
- When creating a multi-step refactoring strategy.
- When integrating a new third-party service.

## Step-by-Step Procedure

### 1. Requirements & Context Check
- Verify understanding of the goal.
- Identify the domains/modules involved (e.g., `Patient`, `LabResults`).
- Note any specific Medivo architectural ADRs that apply (e.g., ADR-002: Schema-per-domain).

### 2. Architecture & Boundary Definition
- **Data Layer:** Define the schema changes. If data spans domains, define how it will be joined (via service layer, not DB).
- **Domain Layer:** Identify Entities, Value Objects, and Domain Events needed.
- **Application Layer:** Define the Use Cases and the BFF API contracts (Inputs/Outputs).
- **Presentation Layer:** Identify required UI components (Features vs. Design System).

### 3. Step-by-Step Breakdown
Break the implementation into a logical sequence. A standard Medivo flow is "Inside-Out" or "API-First":
1. **Phase 1: Database & Domain:** Migrations, Entities, Repositories.
2. **Phase 2: Application Logic:** Use Cases, Services, Tests.
3. **Phase 3: BFF / API:** Route definitions, Zod validation, Controllers.
4. **Phase 4: Frontend UI:** API integration, State management, Components.
5. **Phase 5: Polish:** E2E Tests, Accessibility checks, Performance review.

### 4. Risk & Security Assessment
- What happens if the database fails during this operation?
- Is PHI exposed in URLs, logs, or unencrypted storage?
- Are we introducing an N+1 query?

### 5. Dependency Analysis
- Does Phase 3 rely on Phase 1 being deployed first?
- Are there external API dependencies (e.g., a mock needed for testing)?

## Rules and Constraints
- Plans must explicitly mention which Architectural Layers (Domain, App, Infra) are being modified.
- Plans must include a testing strategy for each phase.
- Never plan a cross-schema database JOIN; plan a service-level aggregation instead.

## Inputs/Outputs
- **Input:** A feature request or architectural goal.
- **Output:** A markdown plan with numbered phases, checkboxes, and technical specifics (e.g., naming specific tables or API routes).

## Related Skills
- `backend-development`: For mapping out the backend phases.
- `database-design`: For planning schema changes.
- `security-review`: To integrate security checks into the plan.

## Examples
*A bad plan:*
1. Create frontend chart.
2. Build backend API.
3. Update DB.

*A good plan (Medivo standard):*
**Phase 1: Domain & Infrastructure (Module: Labs)**
- [ ] Create DB migration for `labs.results` table in `labs_schema`.
- [ ] Define `LabResult` Domain Entity.
- [ ] Implement `LabRepository`.
**Phase 2: Application (Module: Labs)**
- [ ] Create `GetPatientLabsUseCase`.
- [ ] Write unit tests for Use Case mocking Repository.
**Phase 3: BFF & API**
- [ ] Create Next.js API route `/api/patient/labs`.
- [ ] Add Zod validation for request params.
- [ ] Add auth middleware to ensure user requests their own ID.
**Phase 4: Frontend**
- [ ] Create `LabChart` component in `features/labs`.
- [ ] Integrate React Query to fetch from BFF.
- [ ] Verify WCAG contrast for chart colors.
