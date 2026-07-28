# Memory Update Rules

These rules dictate exactly when, how, and why AI agents must update the project's memory files. Strict adherence to these rules is non-negotiable. It ensures the collective intelligence of the platform scales, prevents context amnesia between agent handoffs, and stops the modular monolith from degrading into a distributed big ball of mud.

## 1. Trigger Matrix

This table defines the precise events that mandate a memory update. Agents must evaluate their actions against this matrix constantly.

| Trigger Event | Target Memory File | Action Required | Priority Level |
| :--- | :--- | :--- | :--- |
| **New Architecture Decision Made** | `PROJECT_MEMORY.md` | Add full block to "Architecture Decisions Log" | Critical |
| **New Business Rule/Constraint**| `PROJECT_MEMORY.md` | Add to "Business Rules" or "Constraints" | Critical |
| **Task Initiated (Start of session)** | `SESSION_STATE.md` | Clear old state, update meta, set Status to 🟢 Active | High |
| **Task Progress Made** | `SESSION_STATE.md` | Check off "Active Work", append to "Files Modified" | Medium |
| **Blocker Encountered** | `SESSION_STATE.md` | Log blocker detail, set Status to 🔴 Blocked | High |
| **Ad-Hoc Decision Made** | `SESSION_STATE.md` | Document rationale in "Decisions Made" section | Medium |
| **Session Ending/Pausing** | `HANDOFF.md` | Generate full handoff summary and prioritized Next Steps | Critical |
| **Major Feature Merged/Completed** | `CHANGE_HISTORY.md` | Append new formatted entry to History Log | High |
| **Schema Migration Created** | `CHANGE_HISTORY.md` | Append new entry, mark Impact Level as Critical | Critical |

---

## 2. Step-by-Step Update Procedures

### Updating `PROJECT_MEMORY.md` (The Source of Truth)
1. **Analyze Context**: Ensure the new rule or decision doesn't contradict existing architecture or business rules.
2. **Format Strictly**: Follow the exact subsection formatting (Context, Decision, Rationale, Consequences).
3. **Persist**: Insert into the appropriate domain section.
4. **Deprecate, Don't Delete**: If overriding a previous decision, **do not delete it**. Mark the old entry as `[DEPRECATED]` and link to the new decision. Historical context is invaluable.

### Updating `SESSION_STATE.md` (The Scratchpad)
1. **Continuous Sync**: Treat this as a living scratchpad. Update it every time a significant logical block of code is completed, or a new file is touched.
2. **Granularity**: Keep "Active Work" tasks small enough to be checked off frequently. Broad tasks ("Build backend") are useless.
3. **File Tracking**: Never miss a modified file. This is crucial for generating accurate git commits and providing context for the next agent.

### Updating `HANDOFF.md` (The Baton Pass)
1. **Synthesize**: Do not just copy and paste `SESSION_STATE.md`. Synthesize the state into a narrative that another agent can understand instantly.
2. **Prioritize**: The "Next Steps" must be strictly ordered by priority (P0, P1, P2) and must be actionable.
3. **Risk Assessment**: Apply the correct Risk Indicator (🟢 ⚠️ 🔴) based on the stability of the uncommitted code. Be brutally honest about what is broken.

### Updating `CHANGE_HISTORY.md` (The Audit Trail)
1. **Atomic Entries**: Group related changes into a single logical entry (e.g., "Implemented Auth Flow" rather than logging 5 separate PRs for the same feature).
2. **Impact Clarity**: Be honest about the Impact Level. Over-communicating risk is preferred to under-communicating it.

---

## 3. Validation Rules & Formatting Examples

Before saving any memory file, the agent must validate:
- **Markdown Integrity**: No broken tables, unclosed code blocks, or missing headers.
- **Timestamps**: Must use strict ISO 8601 formatting (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`).
- **No Empty States**: If a section (like Blockers) is empty, write "None currently identified" rather than leaving it blank or deleting the header.

**Format Example (Project Memory Decision):**
```markdown
### 5. Authentication Flow Strategy
- **Context**: Need to secure BFF APIs while supporting both web browsers and mobile apps securely.
- **Decision**: Use HttpOnly, Secure cookies for web clients, and JWT Bearer tokens for mobile clients.
- **Rationale**: Maximizes XSS protection on web (where it is most vulnerable) while accommodating mobile platforms which handle token storage securely via secure enclaves.
- **Consequences**: BFF middleware must dynamically handle authentication resolution based on incoming client headers.
```

---

## 4. Merge Conflict Resolution Procedures

In an environment where multiple agents or human engineers operate concurrently, memory files will inevitably conflict. Follow these procedures to resolve:

1. **Always Pull Latest**: Before writing, always read the current file state from disk. Do not rely on cached memory.
2. **Append and Deduplicate**: For list-based files (`CHANGE_HISTORY.md`), append your entry and ensure the chronological order is maintained.
3. **State Merging (`SESSION_STATE.md`)**: If the session state has been modified by another agent with a different Agent ID, assume they have taken over the session. **Pause execution** and notify the user to resolve the collision.
4. **Architectural Dispute Escalation**: If an agent attempts to write a rule to `PROJECT_MEMORY.md` that directly contradicts a recent entry by another agent, the agent MUST NOT overwrite it. It must halt, log the conflict in `SESSION_STATE.md` as a Blocker, and request explicit human intervention to resolve the architectural dispute.
5. **No Force Pushes to Memory**: Never force overwrite a memory file if the Git diff shows massive, unexplained deletions of existing rules.

---

## 5. Anti-Patterns (What NOT to Store)

Do **NOT** store the following in memory files:
- **Ephemeral Data**: Debug logs, temporary API keys, local port numbers, or JWT tokens.
- **Granular Git History**: Do not duplicate what `git log` already provides perfectly (e.g., "fixed typo on line 42").
- **Assumptions**: "I think the auth service works this way." If it's not verified by code or documentation, do not put it in project memory. Treat memory as facts.
- **Personal Agent Quirks**: Keep the tone professional and objective.
