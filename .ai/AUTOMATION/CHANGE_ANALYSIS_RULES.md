# Change Analysis Rules

The Medivo platform's Modular Monolith architecture requires strict discipline to prevent tight coupling, maintain bounded contexts, and prevent regressions. These rules mandate the analytical steps an AI agent must perform *before* executing code changes. Acting without analysis is strictly prohibited.

## 1. Pre-Implementation Analysis Template

For any change classified above "Trivial", the agent must generate and log (either in memory, thought process, or `SESSION_STATE.md`) the following comprehensive analysis:

- **Target Domain(s)**: [Primary domain being modified, e.g., Skin Intelligence, Core Auth]
- **Affected Downstream Domains**: [Domains that consume data/events from the target, e.g., Notifications, Analytics, Doctor Portal]
- **Dependency Map**: [Specific packages/apps impacted, e.g., `apps/customer-bff`, `packages/ai`, `packages/types`]
- **Risk Assessment**: [Low | Medium | High | Critical]
- **Data Privacy Impact**: [Does this touch PHI/PII? Does it require HIPAA compliance checks? Is data being sent to external APIs?]
- **Required Skills/Tools**: [e.g., Advanced React, PostgreSQL tuning, Zod validation, BullMQ configuration]
- **Testing Requirements**: [Unit tests, Integration tests, or E2E required?]
- **Documentation Updates Needed**: [Refer to DOCUMENT_SYNC_RULES.md triggers]
- **Estimated Scope**: [Approximate number of files to touch, complexity level]
- **Rollback Plan**: [How to revert safely, especially critical if DB migrations or state changes are involved]

---

## 2. Risk Matrix & Escalation Guide

Agents must accurately classify their tasks using this matrix to determine the required level of caution, analysis, and human oversight. Under-classifying risk is a critical error.

| Risk Level | Definition & Common Triggers | Required Analysis Depth | Human Approval |
| :--- | :--- | :--- | :--- |
| **Low (Trivial/Simple)** | Typos, isolated UI styling fixes, single-domain utility function, non-breaking comment/doc updates. | Minimal / Standard | Auto-approved |
| **Medium (Moderate)** | New isolated feature, new UI component, adding non-breaking API endpoint, adding non-required DB columns. | Full Template | Auto-approved |
| **High (Complex)** | Cross-domain feature integration, modifying shared core packages (`packages/core`), complex state management refactors, changing event payloads. | Full Template + Implementation Plan Draft | Required before execution |
| **Critical (Severe)** | DB schema structural changes (drops/renames), Auth logic/middleware changes, Payment flows, exposing PHI data, core architecture shifts. | Full Template + Migration Strategy + Rollback Plan | **STRICTLY REQUIRED** |

---

## 3. Domain Impact Analysis Guide

When modifying the Modular Monolith, agents must carefully consider cross-domain side effects. Use these guidelines during the analysis phase:

- **Core Package (`packages/core`, `packages/types`)**: Changing anything here impacts *every* application and domain in the monorepo. Treat all modifications to core utilities, base repositories, or global types as High Risk. Check all workspaces for usage.
- **Database Schemas**: Because we use schema-per-domain, changing a foreign key, constraint, or data type in `auth_schema` might break BFF queries that aggregate data across schemas. Always verify downstream BFF usage and repository queries.
- **Event Bus (BullMQ/Redis)**: Changing the payload shape of an event (e.g., `SkinAnalysisCompleted`) will break any downstream domain listening to it (e.g., Notifications, Analytics). You must version the event or update all listeners synchronously in the same PR.
- **BFF Layer (`apps/*-bff`)**: BFFs aggregate data for specific clients. Changing a BFF only affects one client (e.g., Mobile App), making it generally lower risk than changing a core domain service. However, always verify that client-side type generation is updated.

---

## 4. Change Category Examples & Actions

### Trivial (Low Risk)
*Example*: Updating the HEX code for the primary brand color in `tailwind.config.js` or fixing a typo in a README.
*Action*: Implement immediately, ensure basic linter passes, no complex analysis needed.

### Simple (Low/Medium Risk)
*Example*: Adding a new `updatedAt` filter to an existing API endpoint in the `Commerce` domain, or adding an optional column to a table.
*Action*: Complete Standard Analysis. Ensure Zod schemas are updated for the new query param, and unit tests cover the new filter logic.

### Moderate (Medium Risk)
*Example*: Creating a new UI flow for users to view their historical Skin AI reports, requiring new frontend pages and BFF routes.
*Action*: Complete Full Analysis. Requires new Next.js pages, BFF route additions, and UI component composition. Ensure no cross-domain data leakage (e.g., accidentally exposing another user's reports).

### Complex (High Risk)
*Example*: Linking the Skin AI results to E-commerce product recommendations (Cross-domain communication: Skin -> Commerce).
*Action*: Draft Implementation Plan. Analyze how to pass data safely between domains (via Event Bus or BFF aggregation). Halt and request human review of the integration plan before writing code.

### Critical (Critical Risk)
*Example*: Migrating user authentication from local JWTs to an external Enterprise SSO provider, or dropping a deprecated database table.
*Action*: Generate Comprehensive Analysis, Migration Strategy (how to move existing users without downtime), and a strict Rollback Plan. Halt execution entirely until explicit human sign-off is received.
