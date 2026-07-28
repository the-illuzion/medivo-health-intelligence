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

1. `auth_domain` - JWT, OAuth, session state
2. `customer_domain` - Customer profile, preferences
3. `skin_analysis_domain` - AI scan reports, face match landmarks
4. `health_metrics_domain` - Health score calculations, trend metrics
5. `routines_domain` - Morning/Evening checklist schedules, streaks
6. `products_domain` - Skincare catalog, AI formulas matching
7. `ecommerce_domain` - Orders, cart, payment integration
8. `appointments_domain` - Dermatologist slots, telehealth bookings
9. `doctor_domain` - Provider credentials, availability
10. `reports_domain` - Clinical PDF generators, HIPAA audit logs
11. `notifications_domain` - Push alerts, routine reminders
12. `analytics_domain` - Engagement metrics, trend aggregations
13. `admin_domain` - Platform governance, audit control

> **Rule**: Zero cross-schema SQL `JOIN`s are permitted. Cross-domain data communication occurs exclusively through API service layers or domain events.

---

## BFF (Backend-For-Frontend) Pattern

1. **`customer-bff`**: Serves `apps/customer-platform` and mobile React Native client.
2. **`doctor-bff`**: Serves `apps/doctor-portal` for telehealth clinical workflows.
3. **`admin-bff`**: Serves `apps/admin-panel` for HIPAA governance and platform metrics.