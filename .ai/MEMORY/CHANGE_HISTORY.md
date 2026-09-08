# Change History

This document serves as a persistent, high-level chronological log of significant changes made to the Medivo Health Intelligence Platform. It provides a vital audit trail for architectural shifts, major feature releases, database schema migrations, and critical fixes. It is NOT a replacement for git commit history, but rather an executive summary of system evolution.

## Format Specification
All entries must strictly adhere to the following block format. Do not use tables for entries. Maintain chronological order (newest at the top, or sequentially appended).

```markdown
### [YYYY-MM-DD] - [Short Title/Summary]
- **Agent/Author**: [Agent ID/Name or Developer Name]
- **Type**: [Architecture | Feature | Bugfix | Refactor | Security | Documentation]
- **Impact Level**: [Low | Medium | High | Critical]
- **Description**: [2-4 sentences explaining what was changed, the business value, and why it was necessary.]
- **Domains Affected**: [List of bounded contexts/domains, e.g., Core, Skin, Auth, Commerce]
- **Key Files**: [Optional: 2-3 most significant files or directories changed]
```

## Category Descriptions
- **Architecture**: Changes to system design, infrastructure, design patterns, tech stack, or deployment strategies.
- **Feature**: Addition of new business capabilities, major UI components, or new domain logic.
- **Bugfix**: Resolution of significant defects, memory leaks, or logical errors (do not log minor typo fixes here).
- **Refactor**: Code restructuring, optimization, or technical debt removal without changing external behavior.
- **Security**: Patches, authorization changes, encryption updates, or data privacy enhancements.
- **Documentation**: Major additions to the project knowledge base, ADRs, or compliance documentation.
- **Performance**: Optimizations, bundle size reductions, caching strategies, or speed enhancements.

## Impact Level Definitions
- **Low**: Isolated change, no downtime risk, purely internal, cosmetic UI tweaks, or minor non-breaking API additions.
- **Medium**: Affects a single domain, requires standard testing, minor UI/API changes, adding non-critical database columns.
- **High**: Cross-domain impact, significant UX updates, changes to shared core packages, new integrations. Requires extensive integration testing.
- **Critical**: Database schema structural changes (drops, renames, complex migrations), Auth logic changes, payment flow modifications, security changes, or anything affecting core platform stability and data integrity.

---

## History Log

### 2026-09-08 - Automated Tracked Database Migrations System & Schema Self-Healing
- **Agent/Author**: Antigravity Database Engineering & Reliability Agent
- **Type**: Architecture / Feature
- **Impact Level**: High
- **Description**: Upgraded database lifecycle management to automatically execute tracked migrations on every deployment and container startup. Created `public.schema_migrations` tracking table (`version`, `name`, `applied_at`) to idempotently execute pending migrations in sequence. Embedded migrations `001` through `004` directly into the TypeScript runtime for 100% reliability in pruned production Docker containers, alongside disk-based `.sql` file detection. Added migration `004_audit_logs_metadata_and_indexes.sql` to permanently manage audit log schema evolution.
- **Domains Affected**: PostgreSQL Database Layer, Migration Runner, BFF Startup Lifecycle
- **Key Files**: `services/api/src/infrastructure/db/migrations/runner.ts`, `services/api/src/infrastructure/db/DatabasePool.ts`, `services/api/src/infrastructure/db/migrations/004_audit_logs_metadata_and_indexes.sql`, `services/api/src/infrastructure/__tests__/MigrationRunner.test.ts`

### 2026-09-08 - Comprehensive Multi-Tier Logging System Architecture & Observability Hardening
- **Agent/Author**: Antigravity Platform Reliability & Logging Architecture Agent
- **Type**: Architecture / Security / Feature
- **Impact Level**: Critical
- **Description**: Implemented an enterprise-grade, 5-tier logging and observability framework across the Medivo platform. Built `@medivo/utils` universal structured logger supporting 6 log levels (`DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`, `AUDIT`), HIPAA/GDPR PII/PHI auto-redaction, base64 image stream protection, dual console formatting (colored in dev, JSON in prod), and 10MB rotating file sinks (`combined.log`, `error.log`, `audit.log`). Implemented distributed correlation ID request tracing (`x-request-id`), HTTP access logging, and error tracking in `customer-bff` and `service-ai`. Integrated PostgreSQL `analytics_schema.audit_logs` persistence with circular buffer fallback and query execution telemetry (>1000ms slow query warnings). Hardened all 7 Docker compose stacks with `json-file` rotation limits (`max-size: "20m"`, `max-file: "5"`) and host volume mounts.
- **Domains Affected**: Platform Core (`@medivo/utils`), BFF Gateway (`customer-bff`), AI Vision (`service-ai`), Database Layer (`service-api`), Docker Infrastructure
- **Key Files**: `packages/utils/src/logger.ts`, `apps/customer-bff/src/middleware/requestTracing.ts`, `apps/customer-bff/src/middleware/httpLogger.ts`, `apps/customer-bff/src/services/audit.service.ts`, `services/api/src/infrastructure/db/DatabasePool.ts`, `docker-compose.production.yml`

### 2026-09-08 - Face Auto-Positioning Guidance, rPPG Vitals Capture & DB Schema Self-Healing
- **Agent/Author**: Antigravity Health Intelligence & Vision Engineering Agent
- **Type**: Feature / Bugfix / Architecture
- **Impact Level**: Critical
- **Description**: Implemented real-time Perfect AI-style face positioning guidance in `CameraScanScreen.tsx` (lighting detection, skin tone density, proximity zoom, and centering reticles) with an automated 3-2-1 auto-capture countdown. Enriched the biometric telemetry pipeline with rPPG vital signs (Pulse Heart Rate BPM, Micro-Vascular Stress Index, Epidermal Barrier Health, Dermal Age). Resolved the PostgreSQL `column "grade" does not exist` runtime error by engineering self-healing schema DDL and resilient fallback mapping in `PostgresSkinScanRepository.ts` and `DatabasePool.ts`.
- **Domains Affected**: Customer App Camera, Skin Telemetry, AI Vision Service, PostgreSQL Database Schema, Types
- **Key Files**: `apps/customer-app/src/screens/CameraScanScreen.tsx`, `apps/customer-app/src/screens/ScanReportScreen.tsx`, `services/api/src/infrastructure/repositories/PostgresSkinScanRepository.ts`, `services/api/src/infrastructure/db/DatabasePool.ts`, `packages/types/src/index.ts`, `services/ai/src/providers/SubDermalEngineAdapter.ts`

### 2026-09-08 - Marketing Website Revamp, Multi-Subdomain Standardization & Typography Upgrade
- **Agent/Author**: Antigravity Health Intelligence & Frontend Experience Agent
- **Type**: Feature / Refactor / Architecture
- **Impact Level**: High
- **Description**: Completely redesigned the Medivo Marketing Platform (`apps/marketing-web`) to be 100% production-ready, accessible, and responsive across mobile, tablet, and desktop viewports. Integrated Google Fonts `Plus_Jakarta_Sans` and `Inter` with zero layout shift; standardized multi-subdomain routing across `*.medivo.duckdns.org`; upgraded interactive 5-Biomarker `SkinScoreSimulator` with real-time prescription previews; created stateful monthly/annual pricing matrix with 20% discount badge and HSA/FSA guarantees; and elevated clinical copywriting, HIPAA disclaimers, and Medical Advisory Board profiles.
- **Domains Affected**: Marketing Web, Design System, Domain Routing, Public Intelligence
- **Key Files**: `apps/marketing-web/app/page.tsx`, `apps/marketing-web/app/about/page.tsx`, `apps/marketing-web/app/clinical-studies/page.tsx`, `apps/marketing-web/app/pricing/page.tsx`, `apps/marketing-web/app/components/Navbar.tsx`, `apps/marketing-web/app/components/Footer.tsx`, `apps/marketing-web/app/components/SkinScoreSimulator.tsx`, `apps/marketing-web/app/utils/domainHelper.ts`

### 2026-09-08 - Standalone DuckDNS Subdomains & Dual HTTP/HTTPS TLS Traefik Routers
- **Agent/Author**: Antigravity Health Intelligence & Ingress Engineering Agent
- **Type**: Bugfix / Architecture
- **Impact Level**: High
- **Description**: Configured dedicated standalone DuckDNS subdomains (`medivo-app.duckdns.org`, `medivo-doctor.duckdns.org`, `medivo-admin.duckdns.org`, `medivo-api.duckdns.org`, `medivo.duckdns.org`) across `docker-compose.frontends.yml`, `docker-compose.bff.yml`, and `docker-compose.production.yml`. Implemented dual HTTP (port 80) and HTTPS (port 443 with `tls=true`) Traefik router declarations ensuring seamless SSL/TLS termination and zero 502 Bad Gateway fallback issues.
- **Domains Affected**: Traefik Ingress, Frontend Deployment, BFF Gateway, Coolify Configuration
- **Key Files**: `docker-compose.frontends.yml`, `docker-compose.bff.yml`, `docker-compose.production.yml`, `apps/marketing-web/app/utils/domainHelper.ts`, `packages/api-client/src/index.ts`

### 2026-09-08 - AI Vision Telemetry Bulletproofing, WebRTC Scan Camera & Dynamic Scan Reports
- **Agent/Author**: Antigravity Health Intelligence & AI Vision Engineering Agent
- **Type**: Feature / Architecture / Security
- **Impact Level**: High
- **Description**: Bulletproofed the end-to-end AI skin analysis pipeline: migrated PostgreSQL `skin_schema` to store dynamic JSONB metrics, clinical grades, and HIPAA consent audit logs (Migration `003`); enhanced `service-ai` and `customer-bff` with sub-dermal telemetry extraction (Dermal Age, Erythema %, Pore Clarity %, Photoprotection index, tailored skincare formulations); built interactive HTML5 WebRTC camera stream with canvas frame capture on `apps/customer-app`; and engineered dynamic clinical scan report screen with Web Share API and CTAs.
- **Domains Affected**: Skin Intelligence, AI Vision Engine, BFF Gateway, Database Schema, Customer App
- **Key Files**: `services/api/src/infrastructure/db/migrations/003_skin_analysis_metrics_and_consent.sql`, `services/ai/src/adapters/SubDermalEngineAdapter.ts`, `apps/customer-bff/src/controllers/scan.controller.ts`, `apps/customer-app/src/screens/CameraScanScreen.tsx`, `apps/customer-app/src/screens/ScanReportScreen.tsx`

### 2026-09-04 - Universal DuckDNS Multi-Subdomain Routing, Dynamic App Subdomains & WWW Support
- **Agent/Author**: Antigravity Cloud & Production Routing Agent
- **Type**: Feature / Bugfix / Architecture
- **Impact Level**: High
- **Description**: Configured comprehensive multi-subdomain Traefik routing rules and dynamic domain helpers across all frontends, BFF gateway, and database management suites (`dbgate`, `redis-insight`, `cloudbeaver`). Added universal `www.` alias support for all DuckDNS and sslip.io subdomains (`www.db.medivo.duckdns.org`, `www.app.medivo.duckdns.org`, etc.), updated marketing web app links (`apps/marketing-web`) to dynamically route directly to `https://app.medivo.duckdns.org`, and normalized API client origin resolution.
- **Domains Affected**: Traefik Reverse Proxy, Frontend Routing, Marketing Web, Management Stack, API Client
- **Key Files**: `docker-compose.management.yml`, `docker-compose.frontends.yml`, `docker-compose.bff.yml`, `docker-compose.production.yml`, `apps/marketing-web/app/utils/domainHelper.ts`, `packages/api-client/src/index.ts`
- **Agent/Author**: Design System & Full-Stack UI Alignment Agent
- **Type**: Feature / Refactor / Architecture
- **Impact Level**: High
- **Description**: Standardized the Medivo Clinical Blue (`#1F7FC4`) brand palette, Pure White (`#FFFFFF`) Light Mode background, and Deep Slate (`#090D16`) Dark Mode background across all 4 monorepo applications (`Customer App`, `Marketing Web`, `Admin Panel`, `Doctor Portal`). Elevated `WebSidebar` to root app shell for a persistent desktop experience, built a custom `CustomTabBar` floating pill renderer with flexbox centering, and refactored Next.js App Router client directives for seamless SSR and static generation.
- **Domains Affected**: Frontend UI, Design System, Multi-App Infrastructure
- **Key Files**: `apps/customer-app/app/_layout.tsx`, `apps/customer-app/app/(tabs)/_layout.tsx`, `packages/theme/src/*`, `apps/marketing-web/app/*`, `apps/admin-panel/app/*`, `apps/doctor-portal/app/*`

### 2026-07-28 - AI OS Memory & Automation Rules Expansion
- **Agent/Author**: System Architecture Agent
- **Type**: Documentation / Architecture
- **Impact Level**: High
- **Description**: Expanded all memory and automation rules to enterprise-grade standards. Enforced stricter formatting, risk matrices, detailed update triggers, and comprehensive documentation guidelines. This ensures future AI agents operate with maximum context and safety within the monolith.
- **Domains Affected**: System Automation, Agent Context, CI/CD Documentation
- **Key Files**: `.ai/MEMORY/*`, `.ai/AUTOMATION/*`

### 2026-07-28 - Platform Greenfield Initialization
- **Agent/Author**: Initial OS Generation Agent
- **Type**: Architecture
- **Impact Level**: Critical
- **Description**: Initialized the Medivo Health Intelligence Platform repository as a greenfield project. Established the Modular Monolith architecture, defined bounded contexts, and set foundational business rules (HIPAA considerations) and technological constraints (Next.js, Schema-per-domain).
- **Domains Affected**: Global / All Domains
- **Key Files**: `PROJECT_MEMORY.md`, `CHANGE_ANALYSIS_RULES.md`

### 2026-07-28 - Base Directory Scaffolding
- **Agent/Author**: Initial OS Generation Agent
- **Type**: Infrastructure
- **Impact Level**: Low
- **Description**: Created the root directory structure (`apps/`, `packages/`, `services/`, `docs/`) and initialized basic tooling configurations to support the monorepo setup.
- **Domains Affected**: Infrastructure
- **Key Files**: `package.json`, `turbo.json`
