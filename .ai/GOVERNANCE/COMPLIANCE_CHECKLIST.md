# AI Engineering OS: Compliance Checklist

## Purpose
This document provides extensive, actionable checklists for AI agents to ensure every change introduced into the Medivo Health Intelligence Platform meets the rigorous standards of architecture, security, and quality expected of a premium enterprise digital health platform.

## Pre-Commit Checklist
AI agents MUST verify all items on this checklist before finalizing any commit or suggesting a Pull Request.

### Architecture Compliance
- [ ] 1. No cross-domain database queries are present (e.g., `skin` service does not query `commerce_schema`).
- [ ] 2. No cross-domain file imports exist that bypass defined API contracts or event schemas.
- [ ] 3. Dependency direction flows strictly inward: UI -> Application -> Domain.
- [ ] 4. Event-driven patterns (BullMQ/Redis) are utilized for inter-domain communication rather than synchronous RPC, where appropriate.
- [ ] 5. New features are correctly placed within their respective bounded contexts in the monorepo (`apps/`, `packages/`, `services/`).
- [ ] 6. Shared libraries in `packages/` contain NO domain-specific business logic (e.g., `packages/ui` contains generic buttons, not a `SkinReportButton`).

### Quality & Standards
- [ ] 7. TypeScript code compiles with `strict: true` and zero errors.
- [ ] 8. Absolutely no `any` types are used; `unknown` is utilized with proper type guards where necessary.
- [ ] 9. All ESLint and Prettier rules pass without warnings.
- [ ] 10. Code cyclomatic complexity is maintained at a manageable level; overly large functions are decomposed.
- [ ] 11. Variable and function names are descriptive, meaningful, and avoid cryptic abbreviations.
- [ ] 12. Error handling is exhaustive; custom application errors are thrown with appropriate HTTP status codes.

### Security & Privacy
- [ ] 13. All incoming API payloads, query parameters, and route parameters are strictly validated using Zod schemas.
- [ ] 14. Authentication and Authorization middleware is applied to all protected endpoints.
- [ ] 15. No secrets, API keys, JWT secrets, or database credentials are hardcoded in the source code.
- [ ] 16. Database queries utilize parameterized statements or the approved ORM to prevent SQL injection.
- [ ] 17. User inputs are properly sanitized before rendering in the UI to prevent Cross-Site Scripting (XSS).
- [ ] 18. PII and PHI data handling complies with established HIPAA-aware guidelines (e.g., masking in logs).

### Documentation & Testing
- [ ] 19. Public APIs, classes, and complex algorithms have comprehensive JSDoc comments explaining intent, parameters, and return types.
- [ ] 20. All new API endpoints are fully documented in the OpenAPI/Swagger specification.
- [ ] 21. Unit tests cover all new or modified business logic, including happy paths and edge cases.
- [ ] 22. Integration tests are implemented for new API endpoints and complex database interactions.

---

## Per-Change-Type Checklists
Depending on the nature of the task, the agent must complete the relevant specific checklist.

### New Feature
- [ ] 1. Domain boundaries for the new feature have been clearly identified and respected.
- [ ] 2. Data models and database schemas have been designed, reviewed, and placed in the correct domain.
- [ ] 3. API endpoints (REST/GraphQL) have been designed and documented *before* implementation begins.
- [ ] 4. Feature flags are implemented to allow for safe deployment and controlled rollout.
- [ ] 5. UI components adhere to the atomic design principles defined in `packages/design-system`.
- [ ] 6. The feature is fully responsive, prioritizing the mobile experience (Mobile First).
- [ ] 7. Analytics and tracking events are integrated into the feature workflows.
- [ ] 8. End-to-end (e2e) tests are outlined or implemented for critical user journeys.

### Bug Fix
- [ ] 1. A regression test was written that accurately reproduces the bug BEFORE fixing it.
- [ ] 2. The root cause of the bug was thoroughly investigated and addressed, rather than patching a symptom.
- [ ] 3. The fix is localized and does not introduce unintended side effects in other domains.
- [ ] 4. The commit message explicitly links to the bug report or issue ticket.
- [ ] 5. Affected documentation (if the bug was due to a misunderstanding of an API) has been updated.
- [ ] 6. The fix has been verified locally against the regression test.
- [ ] 7. Related error logs have been reviewed to ensure the error is now handled gracefully.
- [ ] 8. Code comments explain *why* the fix was applied if the solution is non-obvious.

### Refactor
- [ ] 1. All existing unit and integration tests pass successfully *before* refactoring begins.
- [ ] 2. The scope of the refactor is strictly defined; no new features or bug fixes are snuck in.
- [ ] 3. The refactor demonstrably improves code readability, performance, or alignment with Clean Architecture.
- [ ] 4. Large files are broken down into smaller, single-responsibility modules.
- [ ] 5. All existing tests still pass successfully *after* the refactor.
- [ ] 6. Dead code, unused variables, and obsolete comments have been removed.
- [ ] 7. Type definitions have been tightened and improved where applicable.
- [ ] 8. Architecture Decision Records (ADRs) are updated if the refactor changes a core architectural pattern.

### Dependency Update
- [ ] 1. Release notes and changelogs of the target dependency were reviewed for breaking changes.
- [ ] 2. The update resolves a specific security vulnerability, bug, or provides a needed feature.
- [ ] 3. The `package.json` and lockfiles (`package-lock.json` or `pnpm-lock.yaml`) are correctly updated.
- [ ] 4. All automated test suites pass consistently after the update.
- [ ] 5. Peer dependencies and related packages are updated to compatible versions if necessary.
- [ ] 6. For major version updates, the application was subjected to manual smoke testing.
- [ ] 7. Any deprecated APIs used by the codebase have been migrated to the new patterns.
- [ ] 8. The update does not significantly bloat the bundle size of the frontend applications.

### Schema Change
- [ ] 1. The database migration script is strictly idempotent (e.g., `CREATE TABLE IF NOT EXISTS`).
- [ ] 2. The migration is thoroughly tested against a local database instance.
- [ ] 3. Backward compatibility is maintained (e.g., when renaming a column, add the new one first, migrate data, then drop the old one in a subsequent release).
- [ ] 4. Down migrations (rollbacks) are completely implemented and verified to work.
- [ ] 5. The change does not negatively impact existing query performance (consider adding necessary indexes).
- [ ] 6. TypeScript types and ORM models are updated to precisely reflect the schema change.
- [ ] 7. Seed data scripts are updated if they rely on the modified schema.
- [ ] 8. Other domains that might consume events related to this schema are evaluated for impact.

### API Change
- [ ] 1. Breaking changes are strictly avoided. If a breaking change is necessary, a new API version (e.g., `/v2/`) is introduced.
- [ ] 2. The OpenAPI/Swagger documentation is accurately updated to reflect new fields, parameters, or responses.
- [ ] 3. All API clients within the monorepo (`packages/api-client`) are regenerated or updated.
- [ ] 4. Frontend applications consuming the API are updated to handle the new response structures.
- [ ] 5. New input parameters are fully covered by Zod validation schemas.
- [ ] 6. Response serialization ensures no sensitive data is inadvertently leaked.
- [ ] 7. Integration tests are updated to assert against the new API contract.
- [ ] 8. Deprecated endpoints are clearly marked in the documentation with sunset timelines.
