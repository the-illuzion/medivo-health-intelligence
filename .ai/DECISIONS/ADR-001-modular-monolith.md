# ADR-001: Adopt a Modular Monolith Architecture

## Status
Accepted

## Date
2026-07-28

## Context
We are building Medivo, an AI-powered digital health ecosystem. The platform needs to support multiple domains (e.g., patient management, medical records, AI diagnostics, scheduling, billing) and serve various clients (patients, doctors, admins). We have a relatively small initial engineering team that needs to move quickly to deliver business value, but we also anticipate significant growth and complexity. 

We must choose an architectural style that balances speed of initial development with long-term scalability and maintainability.

## Decision
We will adopt a **Modular Monolith** architecture, strongly guided by **Domain-Driven Design (DDD)** principles. 

The application will be deployed as a single unit (monolith), but internally, it will be strictly divided into independent, domain-aligned modules (e.g., `modules/patient`, `modules/scheduling`, `modules/billing`).

## Rationale
1. **Development Speed:** A monolith simplifies local development, testing, CI/CD, and deployment compared to a distributed microservices architecture. It removes the immediate need for complex orchestration, network resiliency handling, and distributed tracing.
2. **Operational Simplicity:** Deploying and monitoring a single application is significantly easier, allowing the team to focus on business logic rather than infrastructure overhead in the early stages.
3. **Clear Extraction Path:** By strictly enforcing module boundaries (using DDD bounded contexts), we avoid the "big ball of mud." If and when a specific module requires independent scaling, deployment, or a different technology stack, it can be extracted into a microservice with minimal refactoring.
4. **Refactoring Tolerance:** It is much easier to shift boundaries and refactor domains within a single codebase than across network boundaries.

## Consequences

### Positive
- Fast initial delivery and simpler developer experience.
- Easy to trace flows and debug across domains initially.
- Deferring the complexity tax of distributed systems until absolutely necessary.

### Negative / Trade-offs
- **Strict Discipline Required:** We must rigorously enforce module boundaries. Modules must not bypass the defined API/Service layer of other modules.
- **Shared Infrastructure Risk:** A catastrophic failure in one module (e.g., memory leak, blocking the event loop) can bring down the entire application.
- **Build Times:** As the codebase grows, build and test times will increase. We will need to invest in tooling to optimize this (e.g., incremental builds).

## Alternatives Considered
1. **Microservices Architecture:** Rejected for the initial phase. It introduces significant operational complexity, distributed data management challenges, and cognitive overhead that would slow down the small team too much.
2. **Traditional (Unstructured) Monolith:** Rejected. Without strict boundaries, it inevitably degrades into a "big ball of mud," making future scaling, maintenance, and microservice extraction extremely difficult and risky.

## Implementation Notes
- Use tooling (e.g., ESLint plugins, architecture testing tools) to programmatically enforce module dependency rules.
- Modules communicate through well-defined in-process API layers (Services/Use Cases) or via in-memory events.
- No direct database access across module boundaries.
