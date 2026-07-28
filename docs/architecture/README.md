# System Architecture Documentation

## Overview
The **Medivo Health Intelligence Platform** is an AI-powered digital health and clinical skin intelligence monorepo. It operates as a **Modular Monolith** with Domain-Driven Design (DDD) principles managed by Turborepo and `pnpm` workspaces.

---

## Workspace Architecture Rules

```
apps/               → Monorepo applications (customer-platform, marketing-web, doctor-portal, admin-panel)
packages/           → Shared workspace packages (types, utils, design-system, ui, skin, health, ecommerce, appointments)
services/           → Backend microservices & BFFs (customer-bff, doctor-bff, admin-bff)
docs/               → Platform architectural and API specifications
```

### Dependency Direction Constraint
- `apps → packages → types` (NEVER reverse imports)
- `services → packages → types` (NEVER import apps from services or packages)

---

## 13 Schema-per-Domain Model

To ensure each domain can be independently extracted into microservices without schema refactoring, the database enforces **13 PostgreSQL schemas**:

1. `auth_schema` — JWT, OAuth, session state, credentials
2. `user_schema` — User accounts, roles, preferences
3. `profile_schema` — Health profiles, skin types, goals
4. `skin_schema` — AI scan results, face match landmarks, image references
5. `ai_schema` — Model versions, prediction logs, training metadata
6. `report_schema` — Clinical PDF generation, health reports, HIPAA audit logs
7. `health_schema` — Health scores, metrics, trend calculations
8. `doctor_schema` — Provider credentials, specializations, availability
9. `appointment_schema` — Booking slots, telehealth sessions, consultation history
10. `commerce_schema` — Product catalog, cart, orders, fulfillment
11. `payment_schema` — Payment transactions, subscriptions, invoices
12. `notification_schema` — Push alerts, emails, routine reminders, preferences
13. `analytics_schema` — Engagement metrics, feature usage, trend aggregations

> **Rule**: Zero cross-schema SQL `JOIN`s are permitted. Cross-domain data communication occurs exclusively through API service layers or domain events.

---

## BFF (Backend-For-Frontend) Pattern

1. **`customer-bff`**: Serves `apps/customer-platform` and mobile React Native client.
2. **`doctor-bff`**: Serves `apps/doctor-portal` for telehealth clinical workflows.
3. **`admin-bff`**: Serves `apps/admin-panel` for HIPAA governance and platform metrics.