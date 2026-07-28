# Document Synchronization Rules

The Medivo Health Intelligence Platform relies on accurate, up-to-date documentation to maintain development velocity, onboarding speed, and architectural safety. These rules dictate how codebase changes must automatically trigger documentation updates. Outdated documentation is treated as a critical system defect.

## 1. Comprehensive Sync Trigger Matrix

Agents must consult this table whenever modifying the codebase. If a trigger condition is met, the corresponding documentation update is **mandatory** before the task or session can be marked complete.

| Code Modification / Event | Required Document Update | Sync Urgency / Priority | Automation Level |
| :--- | :--- | :--- | :--- |
| **API Route Added, Modified, or Deleted** | Update `docs/api/API_MAP.md`, regenerate OpenAPI spec | Critical | Fully Automated |
| **API Payload/Response Schema Changed** | Update `docs/api/API_MAP.md`, regenerate OpenAPI spec | Critical | Fully Automated |
| **Database Schema Migration Created** | Update `docs/architecture/DATABASE_MAP.md` & diagrams | Critical | Fully Automated |
| **New Package or Application Created** | Update `docs/architecture/MODULE_MAP.md` | High | Automated |
| **New Business Domain Established** | Update `docs/architecture/SYSTEM_MAP.md`, `PROJECT_MEMORY.md`| High | Human Review Req. |
| **Dependency Added/Removed (package.json)**| Update `docs/architecture/DEPENDENCY_MAP.md` with rationale| Medium | Automated |
| **New UI Component added to `design-system`**| Update `docs/design-system/COMPONENTS.md` | Medium | Automated |
| **Major Architectural Shift or Decision** | Create new `docs/adr/ADR-XXX.md` (Decision Record) | Critical | Human Review Req. |
| **Environment Variable Added/Removed** | Update `.env.example` and infrastructure deployment docs | High | Automated |

---

## 2. Staleness Detection Indicators

Agents should actively scan for documentation staleness during routine codebase analysis, bug fixing, or when starting a new session. If any of these indicators are found, the agent must initiate a documentation fix task immediately.

- **Dangling API References**: `API_MAP.md` lists an endpoint that returns a 404 in recent integration tests, or references a controller that was deleted.
- **Schema Drift**: The Prisma `schema.prisma` contains models (e.g., `UserSubscriptions`, `PaymentIntents`) that do not exist in the `DATABASE_MAP.md` documentation.
- **Ghost Modules**: Architectural diagrams or the `MODULE_MAP.md` reference packages/apps that have been deleted or renamed in the monorepo.
- **Outdated Zod Schemas**: Inline TSDoc/JSDoc comments describe payload constraints that differ from the actual Zod validation logic in the code. (Code is the source of truth).
- **Environment Drift**: `.env.example` is missing variables required by the application's `env.mjs` (T3 Env) validation logic, causing startup crashes for new developers.

---

## 3. Execution Protocol & Priority Levels

When a Sync Trigger is activated, the agent must execute the synchronization based on its Priority Level:

### Critical Priority Syncs
*(Examples: API changes, Database Schema changes, Security shifts)*
- **Requirement**: Must be updated in the exact same commit as the code change.
- **Consequence**: Failure to update documentation constitutes a failed task. Do not hand off without syncing.
- **Verification**: Automated tests should ideally verify these docs against the code (e.g., checking OpenAPI spec against actual running routes during CI).

### High / Medium Priority Syncs
*(Examples: New modules, dependencies, UI components, Environment vars)*
- **Requirement**: Can be updated in a subsequent commit, but must be within the same Pull Request or Session.
- **Execution**: Agent must add a checklist item to `SESSION_STATE.md` to ensure it is not forgotten before handoff.

### Standard Protocol Steps:
1. Complete the core code implementation and ensure all unit tests pass.
2. Identify all triggered documentation files via the Matrix above.
3. Open target markdown/doc files for editing.
4. Apply updates preserving existing formatting, table structures, and naming conventions.
5. Cross-reference related files (e.g., if updating the Database map, check if the System map also needs a terminology tweak).
6. Commit the documentation alongside the code.

---

## 4. Validation Checklists

Before finalizing a documentation sync and moving on, the agent must verify the following checklist:

- [ ] **API Completeness**: Are all new API endpoints documented with request payloads, response examples, required auth headers, and error codes?
- [ ] **Database Rationale**: Does the database map include the rationale for any new complex foreign key relationships or indexes?
- [ ] **Dependency Justification**: Are new dependencies justified in the `DEPENDENCY_MAP.md` (e.g., why was `date-fns` added, what does it replace, why not use native Intl)?
- [ ] **ADR Readiness**: For human-review required docs (ADRs), is the draft fully formatted (Context, Decision, Consequences) and ready for a lead developer's final sign-off?
- [ ] **Formatting**: Did the update break any markdown tables or mermaid.js diagrams? Check syntax carefully.
