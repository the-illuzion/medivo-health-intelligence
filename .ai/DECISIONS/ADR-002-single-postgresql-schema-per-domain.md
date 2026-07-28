# ADR-002: Single PostgreSQL Instance with Schema-per-Domain

## Status
Accepted

## Date
2026-07-28

## Context
Following the decision to adopt a Modular Monolith architecture (ADR-001), we need to determine the database strategy. Our domains (e.g., patient, scheduling, billing) need data isolation to maintain bounded contexts and enable future microservice extraction. However, managing multiple separate database servers at this stage introduces unwanted operational overhead.

## Decision
We will use a **single PostgreSQL instance**, but we will implement a **schema-per-domain** strategy.

Each modular domain will own its own PostgreSQL schema (e.g., `patient_schema`, `billing_schema`). A module may only directly read/write to its designated schema.

## Rationale
1. **Data Isolation (Logical):** Schema separation provides a strong logical boundary. It enforces data ownership and prevents accidental tight coupling at the database level.
2. **Operational Simplicity:** Managing, backing up, and monitoring a single PostgreSQL instance is significantly easier and cheaper than managing multiple instances.
3. **Migration Path:** If a module is later extracted into a microservice, migrating its data is straightforward: simply export its specific schema and import it into the new microservice's dedicated database.
4. **Referential Integrity:** While we forbid cross-schema foreign keys for domain isolation, having them in the same instance makes it technically possible for analytics or reporting views if strictly controlled, though the primary interaction must remain decoupled.

## Consequences

### Positive
- Low operational overhead while maintaining strict data boundaries.
- Clear ownership of data models.
- Facilitates the "extract to microservice" path.
- Simplified backup and disaster recovery process (one database to backup).

### Negative / Trade-offs
- **No Cross-Schema JOINs:** We must strictly prohibit JOINs across schemas in the application code. This enforces the boundary but means that aggregating data across domains requires application-level joins or event-driven data duplication (CQRS).
- **Single Point of Failure:** If the database instance goes down, all domains are affected.
- **Resource Contention:** A heavy query in one domain's schema could impact the performance of other domains sharing the same physical instance.

## Alternatives Considered
1. **Database-per-Service (Module):** Rejected. Running 5-10 separate PostgreSQL instances (or logical databases within an instance) is overkill for the current stage, increasing infrastructure costs and management complexity.
2. **Single Shared Schema:** Rejected. This encourages cross-domain JOINs and foreign keys, leading to tight coupling at the data layer, making future extraction nearly impossible without a massive rewrite.

## Implementation Notes
- Database migrations must be scoped to specific schemas.
- The application's database user should ideally have its permissions restricted such that a module's connection can only access its assigned schema (though practically, in a monolith, enforcing this via code conventions/linting is often sufficient initially).
- Data required by multiple domains should be fetched via the owning module's Service layer or synchronized asynchronously via Domain Events.
