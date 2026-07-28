# Repository Analysis

> [!NOTE]
> This document provides a comprehensive analysis of the planned state of the Medivo Health Intelligence Platform repository. As a greenfield project, this outlines the foundational architecture and strategic technical direction. It establishes the architectural principles and operational guardrails for the entire engineering organization.

## Executive Summary

The Medivo Health Intelligence Platform represents a premium, AI-powered digital health ecosystem. The architecture is designed to support a multi-faceted platform spanning AI Skin Intelligence, Health Reports, Personalized Routines, an E-commerce Marketplace, and Dermatologist Consultations. To balance initial development velocity with long-term scalability, the system adopts a **Modular Monolith** architecture with strict Domain-Driven Design (DDD) boundaries. This approach allows rapid iteration in early phases while guaranteeing a straightforward extraction path to microservices as organizational complexity and scale demand. This document serves as the "North Star" for all engineering decisions.

## Current State

The repository is currently in its initial setup phase (greenfield). The overarching AI Engineering Operating System is being established to enforce strict architectural rules, automate governance, and provide developer tooling. No legacy code exists, meaning strict patterns can be enforced from day one.

## Planned Architecture: Modular Monolith with DDD

The architecture employs a single deployment unit (the monolith) comprised of strictly isolated domain modules. Cross-module communication occurs strictly through defined interfaces or asynchronous domain events.

### Technology Stack Analysis

| Category | Technology | Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | 14.x+ | Server Components for performance, built-in SEO optimization, and seamless backend API integration. Standardizes routing and data fetching. |
| **Mobile Framework** | React Native + Expo | 51.x+ | Cross-platform development reduces team size requirements. Expo provides OTA updates, streamlined builds, and rich native API integrations. |
| **Language** | TypeScript | 5.x+ | Type safety across the full stack. Enables end-to-end type sharing, reducing runtime errors and massively improving developer experience and refactoring confidence. |
| **Styling** | TailwindCSS | 3.4.x+ | Utility-first styling eliminates dead CSS. Allows rapid iteration of design systems. |
| **Component Library**| shadcn/ui | Latest | Accessible, customizable, unstyled base components. Gives total control over the DOM and styles compared to monolithic UI libraries. |
| **Backend Runtime** | Node.js | 20.x LTS | High concurrency for I/O bound tasks (like calling external APIs/AI). Unifies language stack across frontend and backend. |
| **Database** | PostgreSQL | 16.x | ACID compliance, powerful JSONB support for unstructured AI data, and robustness. Crucial for the schema-per-domain isolation strategy. |
| **Caching/Sessions** | Redis | 7.x | High-performance in-memory data store. Used for session management, API rate limiting, caching heavy DB queries, and Pub/Sub. |
| **Message Queue** | BullMQ | Latest | Reliable background job processing within the Node ecosystem. Essential for asynchronous AI processing and event distribution. |
| **Storage** | AWS S3 | Latest | Scalable, durable object storage for user media (skin images), generated reports (PDFs), and product assets. |
| **Monorepo Tooling** | Turborepo | Latest | Optimized task execution and build dependency caching. Drastically reduces CI pipeline times in large monorepos. |
| **Package Manager** | pnpm | 9.x+ | Fast, disk-space efficient package manager. Native support for strict workspace linking. |
| **Validation** | Zod | 3.x+ | Schema declaration and validation. Used for API payload validation, environment variables validation, and form validation. |
| **ORM/Query Builder**| Prisma | 5.x+ | Type-safe database client. Great developer experience, auto-generated types matching the schema. |

### Strengths of Chosen Architecture

1. **High Initial Development Velocity**: A single deployment pipeline, simplified local setup, and shared types allow the team to move rapidly to market.
2. **Simplified Infrastructure Topology**: No need for complex service meshes, distributed tracing, or multi-repo CI/CD orchestration in the early days.
3. **Refactoring Superiority**: Changing boundaries or moving logic between domains within a single codebase is significantly easier than orchestrating a refactor across network boundaries.
4. **Guaranteed Extraction Path**: Strict DDD rules and schema-per-domain at the database level ensure that when a domain *needs* to scale independently, it can be extracted to a microservice without a complete rewrite.
5. **Unified Type System**: End-to-end type safety from the database schema to the mobile app UI, preventing entire classes of bugs.
6. **Consistent Security Posture**: Authentication and authorization logic is centralized in a single API gateway layer, eliminating the risk of a misconfigured microservice exposing sensitive data.
7. **Lower Operational Costs**: Running a single fleet of monolith servers is significantly cheaper than running dozens of underutilized microservices.
8. **Easier Debugging**: Tracing a request through a monolith is fundamentally simpler than distributed tracing across multiple network hops. Stack traces are complete and unified.

### Weaknesses and Mitigations

| Weakness | Mitigation Strategy |
| :--- | :--- |
| **Codebase Bloat** | Use Turborepo for fast builds. Implement strict code ownership via `CODEOWNERS` to ensure teams only review relevant PRs. |
| **Boundary Erosion (The Mud)**| Enforce dependency rules strictly via ESLint (`eslint-plugin-boundaries`) and architecture fitness functions in CI. Violations block merges. |
| **Scaling Bottlenecks** | Horizontally scale the entire monolith. Identify resource-heavy, asynchronous domains (e.g., AI processing) and extract them to serverless/workers early. |
| **Deployment Blast Radius** | A bad commit takes down the whole system. Mitigate with comprehensive automated testing (unit, integration, e2e) and automated canary deployments. |
| **Technology Lock-in** | Difficult to use multiple backend languages. Mitigated by the fact that Node.js/TS is highly capable; specific heavy tasks (e.g., Python AI scripts) can be isolated as external services. |
| **Database Connection Exhaustion**| A single app server opening too many connections to PostgreSQL. Mitigate using PgBouncer for connection pooling at the database level. |

### Risks and Mitigation Strategies

| Risk | Probability | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Leaky Domain Boundaries** | High | High | Implement `dependency-cruiser` in CI to fail builds if a package imports from a disallowed domain. Strict peer reviews. |
| **Direct Database Coupling** | Medium | Critical | Enforce Schema-per-Domain. Create specific database users for each service that only have `GRANT` access to their assigned schema. |
| **Eventual Consistency Issues** | Medium | High | Use the Transactional Outbox pattern. Write domain events to an outbox table in the same transaction as the business entity, then dispatch via a background worker. |
| **AI API Latency/Timeouts** | High | Medium | Isolate AI model interactions behind stable interfaces. Employ circuit breakers (e.g., `opossum`) and aggressive retry mechanisms with backoff. Provide optimistic UI updates. |
| **Monorepo Build Times Slowing**| High | Low | Utilize Turborepo remote caching (e.g., Vercel Remote Cache) to share build artifacts across the team and CI runners. |
| **Data Privacy (HIPAA) Breaches**| Low | Critical | Implement column-level encryption for highly sensitive fields (e.g., SSN, strict medical history). Mask all PHI in application logs. |
| **Third-Party AI Deprecation** | Low | High | Build adapter patterns around LLM providers. Do not leak OpenAI/Anthropic specific types into core domain logic. |
| **State Mutation Bugs** | Medium | Medium | Enforce immutability in domain logic. Use libraries or strict TypeScript configurations to prevent accidental mutation of shared state. |

## Technical Debt Prevention Strategy

- **Architectural Decision Records (ADRs)**: Document all significant technical decisions in `.ai/ARCHITECTURE/ADR/`. Must include context, alternatives considered, and consequences.
- **Automated Governance**: Linting rules (ESLint, Prettier), dependency cruiser, strict TypeScript compilation (`strict: true`, `noImplicitAny`), and automated dependency updates (Renovate).
- **Continuous Refactoring Allocation**: Allocate a mandatory 15-20% of sprint capacity to addressing technical debt, upgrading libraries, and refining architectural boundaries.
- **Documentation as Code**: Keep architecture diagrams (Mermaid) and module maps alongside the code. They must be updated in the same PR that changes the architecture.
- **Complexity Budgets**: Monitor cyclomatic complexity and file size. Files exceeding thresholds trigger warnings in CI.

## Anti-Pattern Prevention

To maintain the integrity of the Modular Monolith, the following anti-patterns are strictly forbidden:

1. **The "God" Service/Class**: No single module should manage multiple domains. E.g., the `UserService` should not handle patient medical history or order processing. Adhere to the Single Responsibility Principle.
2. **Direct Database Integration**: Services cannot query other domains' schemas directly. If the `Commerce` domain needs user data, it MUST call the `Auth` service API or listen to `User` domain events.
3. **Circular Dependencies**: Module A depends on Module B, which depends on Module A. This makes independent deployment and testing impossible. Enforced automatically.
4. **Shared Mutable State**: Domains do not share in-memory state. Any shared caching must be managed through Redis with clear ownership and eviction policies.
5. **Distributed Monolith**: Creating microservices prematurely that are tightly coupled by synchronous API calls, resulting in a system that has the complexity of microservices but the deployment coupling of a monolith.

## Recommended Evolution Path

The platform will evolve through structured phases to manage risk and complexity.

### Phase 1: Foundation (Months 1-2)
- **Goals**: Establish monorepo, IaC, CI/CD, design system, core authentication, and API gateway (BFF).
- **Deliverables**: Deployable empty shells for web, mobile, and API. Connected DB/Redis/Queue. Auth service fully functional.
- **Success Criteria**: 90%+ test coverage on core utils. CI pipeline under 10 minutes. Developers can spin up the environment locally in one command.

### Phase 2: Core Domains (Months 3-4)
- **Goals**: Implement user profiles, health metrics tracking, and foundational UI.
- **Deliverables**: Customer PWA with dashboard, profile management, and basic health logging.
- **Success Criteria**: Users can register, login, update profiles, and log daily metrics.

### Phase 3: AI Features (Months 5-6)
- **Goals**: Integrate AI Skin Intelligence, Health Reports generation.
- **Deliverables**: AI service integration, asynchronous processing pipeline, report generation engine.
- **Success Criteria**: Users can upload skin images and receive AI analysis within 30 seconds. PDF reports generate successfully via background jobs.

### Phase 4: Marketplace (Months 7-8)
- **Goals**: E-commerce integration, product catalog, cart, and checkout.
- **Deliverables**: Commerce service, Stripe integration, inventory management in Admin panel.
- **Success Criteria**: Users can purchase recommended skin products securely. Subscriptions process correctly.

### Phase 5: Doctor Platform (Months 9-10)
- **Goals**: Doctor onboarding, scheduling, consultations.
- **Deliverables**: Doctor Portal (Next.js), Doctor BFF, Appointments service.
- **Success Criteria**: Doctors can view assigned patients, take notes, and manage their availability calendar.

### Phase 6: Microservice Extraction (Future / 12+ Months)
- **Goals**: Scale specific domains independently based on load.
- **Deliverables**: Extraction of AI Service and Commerce Service into standalone deployment units.
- **Success Criteria**: Extracted services run on separate infrastructure, connecting to their isolated databases, without downtime during cutover.

## Architecture Comparison

| Feature | Modular Monolith (Chosen) | Pure Microservices | Traditional Monolith |
| :--- | :--- | :--- | :--- |
| **Initial Velocity** | Very High | Low (High DevOps overhead) | Very High |
| **Code Organization**| Strict Boundaries (Enforced) | Strict Boundaries (Physical) | Often chaotic (Spaghetti) |
| **Deployment** | Simple (1 Unit) | Complex (Many Units) | Simple (1 Unit) |
| **Local Dev Exp** | Excellent | Poor (Requires Docker Compose/K8s) | Excellent |
| **Database Schema** | Schema-per-Domain | Database-per-Service | Single shared schema |
| **Independent Scaling**| Limited (Scale all or nothing)| Excellent | Poor |
| **Refactoring Ease** | High | Very Low (Cross-network) | Low (Tangled dependencies) |
| **Extraction Path** | Straightforward | N/A | Extremely Difficult |
| **Suitability** | Best for startups/scale-ups | Best for massive enterprise | Best for simple CRUD apps |

The **Modular Monolith** provides the necessary structure to prevent technical debt while maintaining the speed required for a greenfield project.
