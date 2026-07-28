# Medivo Code Review Checklist

This checklist must be rigorously reviewed by the author before opening a PR, and utilized by reviewers to ensure enterprise-grade quality, security, and architectural alignment for the Medivo platform. A checked box indicates the item has been actively considered and verified.

## 🏛️ 1. Architecture & Design (Clean Architecture & DDD)

**Modular Boundaries**
- [ ] Does this code respect the strict schema-per-domain and modular monolith boundaries? (e.g., `billing` module should not import from `patient` internals).
- [ ] Are inter-module communications occurring only through defined public service interfaces or domain events?
- [ ] Has the team confirmed that this feature belongs in its current module and doesn't necessitate a new bounded context?

**Dependency Direction**
- [ ] Do dependencies point strictly inward? (Infrastructure depends on Application; Application depends on Domain; Domain depends on nothing).
- [ ] Are Domain and Application layers completely free of framework-specific imports (e.g., no Next.js, Express, or Postgres imports)?

**Data Access & Orchestration**
- [ ] Are cross-domain data needs handled via the Service API layer or Domain Events, rather than cross-schema database JOINs?
- [ ] Are Repositories returning domain entities rather than raw database rows?

**BFF Pattern & Frontend**
- [ ] If adding a route, is it placed in the correct client-specific BFF (Patient, Admin, Provider)?
- [ ] Is frontend code grouped by feature (`features/appointments`) rather than technical type, reserving atomic design strictly for the `design-system`?

## 💎 2. Code Quality & TypeScript

**Typing**
- [ ] Are there zero `any` types in this PR? (Use `unknown` with type guards, or Zod schemas).
- [ ] Are interfaces and types correctly exported and collocated with the domain they serve?
- [ ] Are Generics used appropriately without overcomplicating the codebase?

**Clean Code Principles**
- [ ] Are there zero "magic strings" or "magic numbers"? Are constants extracted to enums or constant objects with descriptive names?
- [ ] Are functions small (ideally < 30 lines) and focused on a single responsibility?
- [ ] Is cyclomatic complexity minimized? (Are nested if/else blocks refactored into early returns or separate functions?)
- [ ] Are variables, classes, and DB tables named clearly using ubiquitous domain language?

**Error Handling**
- [ ] Are errors caught gracefully at the appropriate boundaries?
- [ ] Are specific, typed Domain Exceptions thrown instead of generic `Error` objects?
- [ ] Does the Application layer utilize a Result pattern (or similar) to model expected failures?

## 🔒 3. Security & Privacy (Health Data Focus)

**Input & Output**
- [ ] Is ALL incoming data (API payload, query params, headers) strictly validated at the boundary using Zod?
- [ ] Is output sanitized to prevent XSS? Is `dangerouslySetInnerHTML` avoided or strictly justified with security review?

**Authentication & Authorization**
- [ ] Are appropriate auth guards in place for all new endpoints?
- [ ] **IDOR Prevention:** Is the user actually authorized to perform this specific action on this specific database record? (Verify ownership against the `userId` in the JWT).
- [ ] Are Role-Based Access Control (RBAC) checks correctly implemented for Admin/Provider routes?

**Data Protection**
- [ ] Are there zero hardcoded API keys, passwords, or secrets in the code?
- [ ] Are highly sensitive new data fields (e.g., SSN, biometric data, specific diagnoses) slated for application-level encryption at rest?
- [ ] Is PII/PHI properly redacted from any new logging statements?

## 🧪 4. Testing

**Unit Testing**
- [ ] Is core business logic (Domain and Application layer) thoroughly unit tested with mocks?
- [ ] Do the tests verify the constraints of the Domain Entities and Value Objects?

**Integration & E2E Testing**
- [ ] Are DB Repositories and external service adapters tested against real/ephemeral instances (Testcontainers)?
- [ ] If this PR introduces a critical user journey, has an E2E test (Cypress/Playwright) been created or updated?

**Test Quality & Coverage**
- [ ] Does the PR maintain or improve the target coverage (90% Domain, 70% Application)?
- [ ] Are both "Happy Paths" and "Sad Paths" (errors, edge cases) explicitly tested?
- [ ] Do tests follow the Arrange-Act-Assert pattern and tell a clear story?

## ⚡ 5. Performance

**Backend & Database**
- [ ] Have database interactions been scrutinized for N+1 query loops? (Use data loaders or batched queries).
- [ ] Do new database queries utilize existing indexes, or does a new index need to be added in a migration?
- [ ] Are slow external calls (e.g., AI/LLM generation, PDF rendering) offloaded to background jobs (BullMQ) rather than blocking HTTP requests?

**Frontend**
- [ ] Does this PR add heavy third-party libraries to the frontend? Can they be lazy-loaded using `next/dynamic`?
- [ ] Are `useMemo` and `useCallback` used correctly to prevent expensive re-renders in complex UI components?
- [ ] Are images optimized using the Next.js `<Image>` component?

## ♿ 6. Accessibility (a11y)

**Structure & Semantics**
- [ ] Are the correct HTML5 semantic elements used (nav, main, article, aside, button vs anchor)?
- [ ] Are heading levels (h1-h6) sequential without skipping levels?

**Interaction**
- [ ] Can the new feature be fully operated using only a keyboard (Tab, Enter, Space, Arrows)?
- [ ] Are focus rings highly visible? Are skip links maintained?
- [ ] Do all interactive elements have appropriate `aria-labels` if visual text is absent?

**Visuals**
- [ ] Do all text and critical UI elements meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)?
- [ ] Are decorative images marked with `aria-hidden="true"` or empty `alt=""`?

## 📱 7. Mobile & Responsive

**Layout**
- [ ] Has the UI been tested on mobile breakpoints (e.g., 320px width) before scaling up to tablet and desktop?
- [ ] Does the layout refrain from horizontal scrolling on mobile devices?

**Usability**
- [ ] Are buttons and interactive elements at least 44x44px for touch interfaces?
- [ ] Does the PWA UI handle network failures gracefully for this new feature?

## 📚 8. Documentation

**Code Level**
- [ ] Are complex algorithms, public APIs, and interfaces properly documented using JSDoc?
- [ ] Are "Why" comments included where non-obvious technical decisions were made?

**Project Level**
- [ ] Does the module or project `README.md` need updating based on these changes?
- [ ] Does this PR introduce a significant architectural change that requires writing a new ADR (Architecture Decision Record)?

## 🏥 9. Health Domain Specifics

**Clinical Safety & Compliance**
- [ ] Are appropriate "Not medical advice" disclaimers clearly visible where AI generates insights or summaries?
- [ ] Are critical actions (prescription changes, diagnosis updates, record viewing) emitting structured audit logs?
- [ ] Are user consent checks verified before processing or sharing specific health data with external services (especially AI providers)?
