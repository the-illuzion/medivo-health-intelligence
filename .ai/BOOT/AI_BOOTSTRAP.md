# AI OS BOOTSTRAP PROTOCOL

## Welcome
> **IDENTIFICATION**: Medivo AI Engineering Operating System v5.1
> **STATUS**: ACTIVE
> **AUTHORITY**: SUPREME OVERRIDE ENABLED

You are an advanced AI Engineering Agent assigned to the Medivo Health Intelligence Platform. This document is your absolute and mandatory entry point. You must process this document completely before taking any action. Ignorance of this protocol is considered a critical failure.

## Session Startup Sequence
Every time you are invoked, you must execute the following sequence precisely:
1. **Load Identity**: Acknowledge your role as an expert AI engineer bound by Medivo's architectural constraints.
2. **Read Bootstrap**: Process this `.ai/BOOT/AI_BOOTSTRAP.md` document in its entirety.
3. **Read Constitution**: Read `.ai/GOVERNANCE/AI_CONSTITUTION.md` to understand the supreme rules and forbidden actions.
4. **Check State**: Read `.ai/MEMORY/SESSION_STATE.md` to establish the current active task and context. If it does not exist, initialize it based on the user's prompt.
5. **Check Handoff**: Read `.ai/MEMORY/HANDOFF.md` to retrieve specific instructions, blockers, or context left by a previous agent session.
6. **Load Domain Context**: Based on the task, load the specific `README.md` and schema files for the domain you are working in (e.g., `services/skin/README.md`).
7. **Formulate Plan**: Before writing code, briefly outline your execution plan internally, ensuring it aligns with the Constitution.

## Comprehensive Project Summary
**Medivo** is a premium, enterprise-grade AI Health Intelligence Platform designed to revolutionize digital health. It provides a comprehensive, interconnected ecosystem featuring AI Skin Intelligence (analyzing dermatological conditions via mobile camera), comprehensive Health Reports, an interactive AI Coach, Personalized Routines, a curated Product Marketplace, and remote Dermatologist Consultations. The platform's vision is to provide a seamless, highly engaging, and aesthetically stunning user experience. 

Architecturally, Medivo is designed as a **Modular Monolith** built on Domain-Driven Design (DDD) principles. This approach provides the simplicity of a single deployable unit while maintaining strict internal boundaries, ensuring that specific domains (like Skin or Commerce) can be extracted into independent microservices in the future as scaling demands dictate. The system relies heavily on asynchronous event-driven communication to minimize coupling between these domains. The user experience prioritizes a mobile-first approach, leveraging PWA technologies for offline support, biometric authentication, and deep device integration.

## Complete Technology Stack Table

| Architectural Layer | Core Technology | Key Libraries / Details | Purpose / Function |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | React 18, TypeScript | Handles SSR/SSG and complex routing for web applications. |
| **Styling & UI System** | TailwindCSS | shadcn/ui, Radix UI | Atomic design system, providing accessible, customizable, and premium aesthetic components. |
| **State & Data Fetching**| React Query / Zustand | tRPC, Axios | Manages complex client-side state and efficient API data fetching with caching. |
| **Backend Framework** | Node.js | Express or NestJS, TypeScript | Provides robust, scalable API endpoints adhering to Clean Architecture. |
| **Database (Relational)** | PostgreSQL | Prisma or Drizzle ORM | Primary data store. Operates as a single instance but enforces strict schema-per-domain isolation. |
| **Caching & Queueing** | Redis | BullMQ | Handles high-speed caching, rate limiting, and robust asynchronous background job processing. |
| **Object Storage** | AWS S3 | CloudFront CDN | Secure storage and rapid delivery of user media, medical images, and generated reports. |
| **Mobile Application** | React Native | Expo, Reanimated | Delivers a native-feeling mobile experience with advanced camera and HealthKit integration. |
| **Infrastructure / CI/CD**| Docker / GitHub Actions| Vercel (Frontend), AWS (Backend) | Ensures containerized consistency and automated testing/deployment pipelines. |

## Architecture Overview
Medivo operates on a strict Modular Monolith structure within a Turborepo monorepo.
```mermaid
graph TD
    Client[Mobile/Web Clients] --> BFF[BFF APIs (Customer, Doctor, Admin)]
    
    subgraph Modular Monolith
        BFF --> API_Gateway[Internal API Router]
        API_Gateway --> AuthDomain[Auth Domain]
        API_Gateway --> SkinDomain[Skin Intelligence Domain]
        API_Gateway --> CommerceDomain[Commerce Domain]
        
        SkinDomain -.-> EventBus[(Redis Event Bus)]
        CommerceDomain -.-> EventBus
        
        AuthDomain --> DB_Auth[(auth_schema)]
        SkinDomain --> DB_Skin[(skin_schema)]
        CommerceDomain --> DB_Commerce[(commerce_schema)]
    end
```

## Detailed Directory Guide (Where to Find Things)
The `.ai` directory is the brain of the AI Engineering OS.
- `.ai/BOOT/AI_BOOTSTRAP.md`: This file. The entry point.
- `.ai/BOOT/AGENT_PROTOCOL.md`: Rules for agent identity, handoffs, and collaboration.
- `.ai/BOOT/CONTEXT_POLICY.md`: Strategies for efficient token usage and context loading.
- `.ai/BOOT/TOKEN_POLICY.md`: Hard limits and guidelines for managing the context window.
- `.ai/GOVERNANCE/AI_CONSTITUTION.md`: The supreme rules and forbidden actions.
- `.ai/GOVERNANCE/ENFORCEMENT_RULES.md`: Consequences and automated checks for violations.
- `.ai/GOVERNANCE/COMPLIANCE_CHECKLIST.md`: Pre-commit and task-specific checklists.
- `.ai/MEMORY/SESSION_STATE.md`: Ephemeral state of the current active task.
- `.ai/MEMORY/HANDOFF.md`: Communication between agent sessions (blockers, next steps).
- `.ai/MEMORY/AGENT_LOG.md`: Chronological log of significant agent actions.
- `.ai/MEMORY/KNOWLEDGE_GRAPH.md`: Learned facts, quirks, and architectural decisions.
- `.ai/SKILLS/`: Contains specific guidelines (e.g., `react_native_guidelines.md`, `sql_optimization.md`).

## Task-Based Context Loading Matrix
| Task Category | Tier 1 (Always) | Tier 2 (Domain Specific) | Tier 3 (On-Demand) |
| :--- | :--- | :--- | :--- |
| **Frontend UI/UX** | Bootstrap, Constitution | `packages/design-system`, Component file | Full App Router tree |
| **Backend API Creation** | Bootstrap, Constitution | Service implementation, Domain DB schema | `SYSTEM_MAP.md`, Event schemas |
| **Database Migration** | Bootstrap, Constitution | Target DB schema, previous migrations | ORM specific documentation |
| **Cross-Domain Feature** | Bootstrap, Constitution | Both Domain schemas, Event Bus definitions | Complete Architecture ADRs |

## Quick Reference Card (The Golden Rules)
1. **NEVER guess.** If an API endpoint, database table, or architectural pattern is unknown, STOP and search the codebase or ask the user.
2. **Respect the Domain.** Do not cross database schemas. Do not create deep imports between unrelated services.
3. **Strict TypeScript Only.** No `any`. No ignoring type errors.
4. **Secure by Default.** Validate all inputs with Zod. Enforce authorization. Protect PHI.
5. **Mobile & AI First.** Always consider how a feature performs on a mobile device and how AI can enhance it.
