# AI Engineering OS: Token Policy

## Purpose
This document provides absolute guidelines for managing token usage, optimizing the context window, and ensuring cost-effective, high-performance, and focused AI operations within the Medivo ecosystem. Unmanaged token usage leads to context saturation, "hallucinations," and degraded agent performance.

## Agent-Specific Token Budgets Table
Different AI models have varying context window capabilities and behaviors when approaching their limits. Agents must adapt their strategies accordingly.

| Agent Environment / Model | Approx. Safe Context Limit | Strategy & Pruning Behavior |
| :--- | :--- | :--- |
| **Claude 3.5 Sonnet / Opus** | ~150k - 200k Tokens | Can hold significant project state. Still requires aggressive pruning of unrelated domains. Excellent for large, multi-file refactors. Beware of "lost in the middle" effect. |
| **GPT-4o** | ~100k - 128k Tokens | Strong reasoning, but context must be highly curated. Prefers explicit interface definitions over massive implementation files. |
| **GitHub Copilot / Inline** | ~8k - 16k Tokens | Highly localized context. Focus ONLY on the active file, its immediate imports, and the specific function being edited. |
| **Background Audit Agents** | ~200k+ Tokens | Used for deep, autonomous code analysis, generating comprehensive system documentation, or exhaustive security audits. Slower execution is acceptable. |

## Chunking Strategies
When a file exceeds 500 lines, dumping it entirely into context is an anti-pattern. Agents must employ chunking strategies:
- **Structural Analysis First**: Use AST parsing or simple regex (e.g., `grep "export class"`) to get a skeleton view of the file before reading implementations.
- **Targeted Reading**: Use slice notation (e.g., `view_file` specifying lines 200-300) to read only the specific method that needs modification.
- **Example**: If modifying the `calculateTotal` method in a 1000-line `OrderService`, the agent should first find the line numbers for `calculateTotal`, read only that chunk, modify it, and write it back, ignoring the rest of the file.

## Priority Loading Algorithm
When nearing the context window limit (or proactively to avoid it), prioritize information in this exact order:
1. **Critical Directives**: System Prompts, `AI_CONSTITUTION.md`, and immediate task instructions. (Do not drop).
2. **Active Target**: The specific file currently being edited. (Do not drop).
3. **Direct Interfaces**: The interface/schema definition directly related to the active file (e.g., `types.ts`).
4. **Immediate Siblings**: Sibling components or related services within the same domain. (Prune first).
5. **Global Utilities**: Global utility functions or base configurations. (Assume standard behavior unless errors occur; prune aggressively).

## Summarization Rules
To maintain a lean context over a long session, agents must summarize rather than hoard text.
- **Long Logs**: When running test suites or builds that output thousands of lines, do NOT dump the full log into context. Use bash commands (like `tail`, `grep "Error"`) to extract only the stack trace and the specific failing assertion.
- **Completed Sub-tasks**: When a complex sub-task is finished (e.g., "Database migration written and applied"), summarize the result ("Migration 004 applied successfully, added `is_active` to users") and drop the raw SQL script from active memory.
- **Handoffs**: When passing context via `HANDOFF.md`, summarize the journey. Do not include raw conversational transcripts.
- **Exceptions**: NEVER summarize API contracts (OpenAPI), database schemas, or critical cryptographic algorithms. These require exact, character-level precision and must be kept verbatim if relevant to the task.
