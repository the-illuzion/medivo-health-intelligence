---
name: database-design
description: Database schema and query design guidelines
---

# Database Design Guidelines

## Overview
Medivo uses a single PostgreSQL instance globally, but enforces a strict **Schema-Per-Domain** architecture (ADR-002) to support the Modular Monolith and ensure data isolation for future microservice extraction. Adherence to these guidelines ensures data integrity, performance, and security.

## When to Activate
- When designing new database tables.
- When creating database migrations.
- When writing complex queries or optimizing performance.
- When defining data extraction flows for AI models.

## Core Rules: Schema-Per-Domain
1. **Isolation:** Each domain module (e.g., `patient`, `billing`, `appointments`) gets its own schema in Postgres.
   ```sql
   CREATE SCHEMA patient_schema;
   CREATE SCHEMA billing_schema;
   ```
2. **No Cross-Schema JOINs:** An application query originating from the `billing` module cannot `JOIN` tables in the `patient_schema`. 
   - *Why?* If `billing` is extracted to a microservice tomorrow, the cross-schema JOIN breaks. 
3. **Data Aggregation:** If you need data from multiple domains (e.g., an invoice that needs the patient's name), you must handle this in the Application layer.

## Cross-Domain Data Access Patterns
When Module A needs data from Module B, use one of these patterns:

**1. API Composition (Synchronous):**
Used when Module A needs real-time data from Module B to complete a request.
```typescript
// Inside Billing BFF UseCase
const invoice = await this.invoiceRepo.get(invoiceId);
// Call the Patient module's internal service (API boundary), NOT its database
const patientDetails = await this.patientService.getPatientProfile(invoice.patientId);
return combineInvoiceAndPatient(invoice, patientDetails);
```

**2. Data Replication via Events (Asynchronous / CQRS):**
Used when Module A needs to frequently query Module B's data alongside its own, and synchronous fetching is too slow.
- Module B publishes `PatientNameChangedEvent`.
- Module A listens and updates a read-only table in its own schema (e.g., `billing_schema.patient_name_cache`).

## Schema Creation Conventions
- **Table Names:** Plural, snake_case (e.g., `patient_schema.appointments`).
- **Primary Keys:** Use UUIDs (v7 preferred for sortability) for primary keys to ensure global uniqueness and prevent enumeration attacks (e.g., guessing `/api/patient/123`).
  ```sql
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  ```
- **Foreign Keys:** Must strictly point to tables within the *same schema*.
- **Timestamps:** Every table should have `created_at` and `updated_at` (managed via DB triggers).
- **Soft Deletes:** For sensitive health/billing records, use `deleted_at` timestamp. Hard deletes (`DELETE` command) are strictly prohibited for core domain entities to maintain audit trails.

## Migration Naming Conventions
Migrations must be sequential and explicitly namespaced by module to prevent conflicts.
Format: `YYYYMMDDHHMMSS_module_name_description.sql`
Example: `20260728103000_billing_create_invoices_table.sql`

## Indexing Strategy
Indexing is critical for read performance, but degrades write performance. Apply strategically:
- **Primary Keys:** Automatically indexed.
- **Foreign Keys:** ALWAYS index columns used as foreign keys to speed up JOINs within the schema.
- **Lookup Columns:** Index columns used frequently in `WHERE` clauses (e.g., `email`, `status`).
  ```sql
  CREATE INDEX idx_users_email ON patient_schema.users(email);
  ```
- **Composite Indexes:** Use when queries frequently filter by multiple specific columns together (e.g., `user_id` and `status`). Order matters: put the most selective column first.
- **JSONB Indexes:** If querying inside a JSONB column, use GIN indexes.

## Query Optimization Rules
- **Avoid `SELECT *`:** Only select the columns needed to hydrate your Domain Entities or fulfill the API request. This reduces memory usage and network bandwidth.
- **Pagination:** Never query unbounded lists. Always enforce `LIMIT` and `OFFSET` (or keyset pagination) on collection endpoints.
- **N+1 Problem Prevention:** When fetching a list of items and their relations, use a DataLoader pattern or an optimized SQL query with `IN` clauses to fetch relations in a single batch, rather than querying in a loop.

## Security & Data Types
- **JSONB:** Use sparingly. Prefer strongly typed relational columns unless the data structure is truly dynamic or polymorphic (e.g., unstructured integration logs from third-party EHR systems).
- **Encryption:** Highly sensitive data (e.g., SSN, specific biometric markers) should be encrypted at the application level *before* being stored in the database. The database should only see ciphertext.

## Related Skills
- `backend-development`: How the application interacts with the DB via Repositories.
- `performance-analysis`: Identifying slow queries using `EXPLAIN ANALYZE`.
