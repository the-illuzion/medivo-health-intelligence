# AI Engineering OS: Enforcement Rules

## Purpose
This document defines the rigorous rules for enforcing the AI Constitution within the Medivo Health Intelligence Platform. It establishes a clear framework for automated checks, manual reviews, and the explicit consequences of violations to maintain the absolute integrity of the system architecture and security.

## Detailed Severity Levels

### 1. Critical (Block)
- **Description**: Violations that pose a severe, immediate risk to system security, data integrity, architectural stability, or regulatory compliance (e.g., HIPAA).
- **Examples**:
  - Hardcoding an API key or database password.
  - Executing a cross-domain SQL query directly against another domain's schema.
  - Committing code that fails TypeScript compilation.
  - Disabling authentication middleware on a protected endpoint.
- **Action**: Immediate blockage of the commit, build, or PR. The agent is forced to halt execution and must correct the error before proceeding. Multiple critical violations may result in the agent's session being terminated.

### 2. Warning (Flag)
- **Description**: Violations that degrade code quality, violate established patterns, or increase technical debt, but do not pose an immediate systemic risk.
- **Examples**:
  - Adding complex business logic without corresponding unit tests.
  - Missing JSDoc documentation on a newly exported public interface.
  - Using an inefficient loop structure where a vector operation or database aggregation would be better.
  - Minor naming convention violations.
- **Action**: The PR or commit is flagged with a warning comment. The agent is required to acknowledge the warning and provide a remediation plan or fix it immediately. Ignoring warnings requires a documented override.

### 3. Advisory (Suggest)
- **Description**: Deviations from optimal best practices or stylistic guidelines that are subjective or context-dependent.
- **Examples**:
  - Suggesting a more modern JavaScript syntax (e.g., optional chaining instead of deeply nested ANDs).
  - Recommending the extraction of a moderately sized function into smaller, more focused utilities.
  - Suggesting alternative UI color tokens for better contrast (handled by design-system rules).
- **Action**: Inline suggestions are provided in the IDE or PR review interface. The agent should review the suggestion and apply it if it improves the code, but it does not block workflows.

## Complete Automated Checks Table

| Check Name | Severity | Trigger Condition | Automated Action |
| :--- | :--- | :--- | :--- |
| **Domain Boundary Scanner** | Critical | Import paths matching `../services/[other_domain]` outside of defined API contract boundaries. | Block commit. Fail CI build. Generate error report. |
| **Schema Isolation Verifier** | Critical | SQL statements or ORM queries referencing tables outside the bounded context of the active service. | Block PR merge. Reject database migration script. |
| **Dependency Direction Audit** | Critical | Dependency cruiser detects a domain layer importing from the infrastructure or UI layers. | Block commit. Fail CI build. Output graph of violation. |
| **Secret Detection Scan** | Critical | Regex or entropy scan detects potential API keys, tokens, or passwords in modified files. | Block commit immediately. Alert security team if pushed. |
| **Strict Type Checking** | Critical | `tsc --noEmit` returns > 0 errors or detects the use of `any` types. | Block commit. Fail CI build. |
| **API Contract Validation** | Critical | OpenAPI schema diff detects breaking changes (e.g., removed required field) without a major version bump. | Block PR merge. Demand new API version path. |
| **Test Coverage Gate** | Warning | Overall test coverage drops below 85%, or new files have < 80% coverage. | Flag PR. Add required reviewer for manual override. |
| **Documentation Enforcer** | Warning | ESLint detects exported functions/classes lacking JSDoc, or missing OpenAPI decorators on controllers. | Flag commit. Add automated comment demanding docs. |

## Violation Response Matrix

| Violation Type | Severity | Immediate Automated Action | Required Agent Remediation | Human Escalation Path |
| :--- | :--- | :--- | :--- | :--- |
| **Security Risk (e.g., Hardcoded Secret)** | Critical | Hard Block. Local file reverted. | Agent must remove secret, utilize environment variables, and document secure pattern. | If pushed to remote, SecOps notified. Agent session locked. |
| **Architecture Breach (Cross-Domain)** | Critical | CI Build Failed. PR Blocked. | Agent must refactor to use event bus or internal API client. | Requires Lead Architect approval if the agent insists an override is necessary. |
| **Quality Drop (Failing Tests)** | Critical | Commit Blocked. | Agent must run tests locally, diagnose failures, and fix the code or the tests. | If the agent loops without fixing, halt and request human intervention. |
| **Technical Debt (Missing Docs)** | Warning | PR Comment Added. | Agent should generate the missing documentation. | If ignored, a technical debt Jira ticket is auto-generated and assigned. |

## Agent-Specific Enforcement Hooks

The AI Engineering OS utilizes specialized agents, each with specific enforcement hooks tailored to their role:
1. **Architect Agent (Planning & Design)**:
   - **Hook**: *Architecture Linter*. Validates proposed `SYSTEM_MAP.md` changes against DDD principles before allowing the generation of implementation tasks.
2. **Coder Agent (Implementation)**:
   - **Hook**: *Real-time AST Scanner*. Analyzes the AST (Abstract Syntax Tree) of generated code in-memory to detect domain boundary violations before writing to disk.
3. **Reviewer Agent (Quality Assurance)**:
   - **Hook**: *Automated PR Audit*. Runs a specialized prompt designed exclusively to find security vulnerabilities and architectural flaws in the Coder Agent's PRs.
4. **DBA Agent (Database & Schema)**:
   - **Hook**: *Migration Sandbox*. Executes proposed schema migrations in an isolated, temporary PostgreSQL container to verify idempotency and detect performance bottlenecks before committing.
5. **Security Agent (Auditing)**:
   - **Hook**: *Continuous SAST*. Runs comprehensive static analysis (Semgrep, SonarQube) on every commit, with a focus on OWASP Top 10 and HIPAA compliance checks.
6. **DevOps Agent (Infrastructure)**:
   - **Hook**: *IaC Validator*. Ensures all Terraform or Pulumi configurations adhere to least-privilege principles and network isolation rules.

## Appeal and Exception Process
In rare cases, a rigid rule may prevent a necessary technical solution. AI agents cannot autonomously bypass Critical rules, but they can initiate an appeal:
1. **Drafting the Exception Request**: The agent writes a detailed explanation of why the rule must be bypassed in `.ai/MEMORY/EXCEPTION_REQUESTS.md`. This must include the technical limitation, the proposed alternative, and a risk mitigation plan.
2. **Human Review**: A human Lead Architect reviews the request.
3. **Approval/Denial**: If approved, the Architect provides a specific, time-bound override token or merges the code manually. If denied, the Architect provides guidance on a compliant solution, and the agent must try again.
