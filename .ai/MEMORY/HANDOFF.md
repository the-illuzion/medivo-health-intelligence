# Agent Handoff

> **Note:** This document is the critical link between AI agent sessions. It must be generated comprehensively at the end of every task or when an agent is paused/swapped. A high-quality handoff prevents duplicated effort, catastrophic regressions, and context amnesia. 

## Checklist for Handoff Quality
Before finalizing this document, the agent must verify:
- [ ] Are all modified files committed, stashed, or clearly documented as uncommitted?
- [ ] Is the "Current State" brutally honest about what is broken, hacky, or incomplete?
- [ ] Are the Next Steps prioritized (P0, P1, P2) and highly actionable?
- [ ] Are all relevant context files linked so the next agent can read them immediately?
- [ ] Have all architectural decisions made in this session been copied to `PROJECT_MEMORY.md` if applicable?

---

## Last Session Details

- **Agent**: [Previous Agent Name/ID - e.g., Feature Agent 04]
- **Completed**: [ISO 8601 Timestamp - e.g., 2026-07-28T16:30:00Z]
- **Duration**: [e.g., 2h 45m]
- **Branch**: [Current Git Branch - e.g., feat/skin-ai-upload]

## Summary of Work Completed

*A high-level, executive summary of what was achieved. Do not list every file; focus on business value and architectural progress.*

- Scaffolded the initial Skin Intelligence AI BFF routes and Zod validation schemas.
- Implemented the database repository for storing AI analysis results and mapping them to users.
- Set up the Redis-backed BullMQ worker configuration for asynchronous image processing.
- Created a robust S3 multipart upload utility to handle large image files securely.

---

## Current State

*Detailed explanation of the codebase state relative to the task. Use Risk Indicators to highlight danger zones.*

- **What's Working (Stable)**:
  - The API endpoint successfully receives, validates, and compresses multipart form data (images) via Zod and Sharp.
  - Images are successfully uploaded to the S3 staging bucket using the new utility.
  - The database records the analysis initiation with a `PENDING` status.
- **What's Not Working (In Progress/Broken)**:
  - ⚠️ The BullMQ worker is failing to dequeue jobs in the local Docker environment due to a Redis connection timeout.
  - 🔴 The mock AI inference service is returning a 500 internal server error because it expects a different JSON payload structure than what the BFF is currently sending.

### Risk Indicators
- 🔴 **High Risk (P0)**: Broken build, corrupted state, security vulnerability introduced, or blocking errors.
- ⚠️ **Medium Risk (P1)**: Failing tests, incomplete error handling, missing documentation, or flaky behavior.
- 🟢 **Low Risk (P2)**: Feature complete but needs refactoring, optimization, or minor UI polish.

---

## In-Progress Items

*Specific, granular tasks that were started but not completed, requiring the next agent's immediate attention.*

- Debugging the Redis connection timeout in `packages/services/ai-worker`. The connection string seems to be missing the port.
- Refactoring the BFF payload to match the mock AI inference service expectations (needs `image_url` instead of `file_path`).
- Writing integration tests for the full upload-to-inference pipeline using supertest.

---

## Known Issues & Technical Debt

*Bugs, edge cases, or technical debt identified during the session that were deliberately left out of scope.*

- **S3 Utility**: The S3 upload utility doesn't currently handle file size limits efficiently; it relies entirely on the BFF to reject large payloads upfront, which could be bypassed if the utility is used elsewhere.
- **Type Duplication**: The `SkinAnalysisResult` type is currently duplicated in the BFF and the AI service; it needs to be extracted to the shared `packages/types` package to maintain the DRY principle.

---

## Recommended Next Steps (Prioritized)

*Clear, prioritized, step-by-step instructions for the next agent picking up this branch. Do not leave ambiguity.*

1. **[P0 - Critical]** Fix the Redis connection string issue in the `.env.local` or the worker configuration (`ai-worker/src/index.ts`) to unblock the background job queue.
2. **[P0 - Critical]** Refactor the BFF payload in `customer-bff/src/routes/skin.routes.ts` to match the mock AI service's expected schema.
3. **[P1 - High]** Implement integration tests for the endpoint to verify the S3 upload and database insertion work together.
4. **[P2 - Medium]** Extract the duplicated `SkinAnalysisResult` types to `packages/types/src/ai.ts`.
5. **[P3 - Low]** Add unit tests covering the edge cases of the S3 upload utility (e.g., network failure simulation).

---

## Context Files to Read

*List of files the next agent MUST read to immediately understand the architectural context and unblock themselves.*

- `packages/skin/src/use-cases/analyze-skin-image.usecase.ts` (Core logic)
- `apps/customer-bff/src/routes/skin.routes.ts` (The broken payload)
- `packages/services/ai-worker/src/index.ts` (The broken Redis connection)
- `docs/architecture/adr-002-async-inference.md` (Why we are using BullMQ in the first place)

---

## Warnings / Gotchas

*Critical information, environment quirks, or anti-patterns to prevent the next agent from making catastrophic mistakes.*

- **DO NOT** attempt to run the AI inference synchronously in the BFF request lifecycle; it will violate ADR-002 and cause the Vercel serverless functions to time out on production.
- The Redis cluster in staging requires a TLS connection (`rediss://`), ensure the local mock matches this configuration behavior or provides a clear fallback.
- The `Sharp` image processing library requires specific binaries depending on the OS; if you rebuild, ensure the Dockerfile pulls the correct Linux binaries.
