# AI Engineering OS: Context Policy

## Purpose
Large context windows in LLMs are powerful but notoriously prone to "lost in the middle" phenomena, distraction, and high token costs. This policy mandates a progressive, highly efficient approach to loading context. It ensures AI agents are armed with exactly the information they need to execute their tasks perfectly, without being overwhelmed by irrelevant data from the massive monorepo.

## Detailed Tier Descriptions

### Tier 1: Base Context (Always Load)
This is the foundational operating system context. It defines *how* the agent should behave and *what* it is currently doing. It MUST be loaded at the start of every single session.
- **Files**:
  - `.ai/BOOT/AI_BOOTSTRAP.md` (System overview)
  - `.ai/GOVERNANCE/AI_CONSTITUTION.md` (Supreme rules)
  - `.ai/MEMORY/SESSION_STATE.md` (Current task context)
  - `.ai/MEMORY/HANDOFF.md` (Continuation instructions, if present)

### Tier 2: Domain Context (Load Per Task)
This context provides the specific business rules, schemas, and guidelines relevant to the immediate task. It prevents the agent from guessing domain logic.
- **Files**:
  - The `README.md` of the relevant package or service (e.g., `services/commerce/README.md`).
  - The database schema definition file for the active domain (e.g., `packages/types/src/schemas/commerce_schema.ts`).
  - Relevant skill files from `.ai/SKILLS/` (e.g., `react_hook_form_patterns.md` if building a complex form).

### Tier 3: Deep Dive Context (Load On Demand)
This context is loaded only when specific architectural questions arise, complex cross-domain integrations are required, or deep debugging is necessary.
- **Files**:
  - Full Architecture Maps (e.g., `docs/architecture/SYSTEM_MAP.md`).
  - Cross-domain API contracts (OpenAPI specs) and event schemas (e.g., `packages/types/src/events/user_created.ts`).
  - Sibling component implementations (to understand how a similar problem was solved nearby).

### Tier 4: Exhaustive Context (Rarely Load)
This tier represents information that is usually counter-productive to hold in active memory due to size and irrelevance to immediate tasks.
- **Files**:
  - Complete source code of unrelated domains (e.g., loading the `appointments` service when working on `skin`).
  - Historical Architecture Decision Records (ADRs) that do not impact the current task.
  - Large mock data files or massive test suites for unrelated features.

## Task-Based Loading Matrix

| Task Type | Tier 1 (Always) | Tier 2 (Domain) | Tier 3 (On-Demand) |
| :--- | :--- | :--- | :--- |
| **Frontend UI Component** | Required | UI Design System rules, Target Page Routing | Parent container state management |
| **Backend API Endpoint** | Required | Service implementation, Domain DB Schema | API standards ADR, Error handling utilities |
| **Database Migration** | Required | Target DB Schema, Current migrations | ORM specific advanced documentation |
| **Cross-Domain Integration** | Required | Schemas for BOTH domains involved | Event Bus definitions, System Map |
| **Bug Fix (UI)** | Required | Specific UI component, Parent container | Related state (Zustand/Redux) slices |
| **Bug Fix (Backend)** | Required | Specific service file, Error stack trace | Associated unit tests, database queries |
| **System Refactoring** | Required | Entire module being refactored | Immediate consumers of the module |

## Examples of Context Loading

### Example 1: Building a new Skin Report UI
1. **Tier 1**: Loads `AI_BOOTSTRAP.md`, `AI_CONSTITUTION.md`.
2. **Tier 2**: Loads `packages/design-system/README.md` to understand atomic components, and `packages/types/src/schemas/skin_schema.ts` to understand the data structure of the report.
3. **Tier 3**: Not needed initially.
4. **Execution**: The agent has exactly what it needs to build a compliant, beautifully typed UI component.

### Example 2: Fixing a bug in the Commerce checkout flow
1. **Tier 1**: Loads core OS files and `HANDOFF.md` containing the error trace.
2. **Tier 2**: Loads `services/commerce/src/checkout.service.ts` and `commerce_schema.ts`.
3. **Tier 3**: The bug involves a payment gateway timeout. The agent loads `docs/adr/ADR-012-payment-gateway-retry-policy.md` to understand the expected behavior.

## Anti-Patterns
Agents MUST strictly avoid the following context-loading anti-patterns:
1. **The "Read Everything" Pattern**: NEVER execute a script or command to read all files in a directory or the entire repository at startup. This immediately floods the context window, wastes tokens, and dilutes the agent's attention, leading to hallucinations.
2. **Blind Grepping**: Do not use overly generic search queries (e.g., `grep -r "user" .`) that return thousands of lines of output. Use precise, targeted searches (e.g., `grep -r "interface UserProfile" packages/types`).
3. **Ignoring Tier 1**: Never skip loading the Bootstrap or Constitution files to save tokens. They define the critical operating parameters and boundaries. Ignoring them leads to architectural violations.
4. **Context Hoarding**: Do not keep massive files in active context if they are no longer relevant to the current sub-task. If you finish modifying a massive 1000-line service and move on to its UI, summarize the service changes and clear the raw code from your immediate focus.
