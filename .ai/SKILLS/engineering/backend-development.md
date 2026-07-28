---
name: backend-development
description: Backend service development using Clean Architecture and DDD
---

# Backend Development Guidelines

## Overview
Medivo's backend is a Modular Monolith built with Node.js and TypeScript. It strictly adheres to **Clean Architecture** and **Domain-Driven Design (DDD)** principles to ensure maintainability, testability, and future-readiness for microservice extraction.

## When to Activate
- When building new API endpoints or GraphQL resolvers.
- When creating or modifying core business logic.
- When designing background jobs (BullMQ).
- When integrating third-party APIs.

## Clean Architecture Layers
Each module (e.g., `modules/billing`) must contain the following layers, with dependencies strictly pointing inward. An outer layer can depend on an inner layer, but an inner layer must never know about an outer layer.

```text
[Infrastructure] -> [Application] -> [Domain]
```

### 1. Domain Layer (The Core)
The Domain layer contains the absolute heart of the business logic. It must be completely framework-agnostic.
- **Entities:** Objects with a distinct identity that persists over time (e.g., `Patient`, `Appointment`).
- **Value Objects:** Immutable objects without distinct identity, defined only by their attributes (e.g., `Money`, `Address`, `BloodPressure`).
- **Domain Events:** Representations of something that happened in the domain (e.g., `AppointmentScheduledEvent`).
- **Domain Exceptions:** Specific errors related to business rules (e.g., `InvalidAppointmentTimeException`).
- **Repository Interfaces:** Contracts for data storage (e.g., `IAppointmentRepository`). The implementation details live in Infrastructure.

*Code Example: Value Object*
```typescript
export class BloodPressure {
  constructor(public readonly systolic: number, public readonly diastolic: number) {
    if (systolic <= diastolic) throw new Error("Systolic must be higher");
    if (systolic < 70 || systolic > 250) throw new Error("Invalid systolic");
  }
}
```

### 2. Application Layer (Use Cases & Services)
The Application layer orchestrates the execution of business workflows. It uses domain objects to achieve a specific goal.
- **Use Cases (Interactors):** A single class or function per action (e.g., `ScheduleAppointmentUseCase`).
- **Application Services:** Services that coordinate across multiple aggregates or handle cross-cutting concerns (e.g., `NotificationService`).
- **BFF Orchestration:** Aggregating data from multiple internal modules to serve a specific frontend (e.g., `PatientDashboardBFF`).

*Code Example: Use Case*
```typescript
export class ScheduleAppointmentUseCase {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private eventBus: IEventBus
  ) {}

  async execute(dto: ScheduleDTO): Promise<Result<Appointment>> {
    // 1. Fetch related data
    // 2. Execute domain logic
    const appointment = Appointment.create(dto);
    // 3. Persist
    await this.appointmentRepo.save(appointment);
    // 4. Dispatch events
    this.eventBus.dispatch(new AppointmentScheduledEvent(appointment.id));
    return Result.ok(appointment);
  }
}
```

### 3. Infrastructure Layer (Outer Boundary)
The Infrastructure layer contains all the technical details, frameworks, and external dependencies.
- **Database Repositories:** Implementations of the repository interfaces using an ORM (e.g., Prisma, Drizzle, native pg).
- **External Services:** Adapters for external APIs (e.g., Stripe API, SendGrid, AI Model APIs).
- **Controllers/Routes:** Express or Next.js API route handlers.
- **Message Queues:** BullMQ workers and Redis publishers.

## BFF (Backend-For-Frontend) Development Guidelines
Because we have multiple clients (PWA, Mobile, Admin), we utilize the BFF pattern.
1. **Client Specificity:** A BFF should only contain routes tailored for a specific client. The Admin BFF should not be accessible from the Patient PWA.
2. **Aggregation:** The BFF aggregates data. If the patient dashboard needs data from `Billing`, `Appointments`, and `Labs`, the BFF makes internal service calls to these modules and combines the data into a single optimized JSON response.
3. **Validation Boundary:** All incoming BFF requests must be validated using Zod before touching the Application layer.

## Error Handling Patterns
We avoid throwing raw `Error` objects across boundaries.
- **Domain Exceptions:** Throw specific exceptions in the domain layer.
- **Result Pattern:** Use a `Result<T, E>` monad (like `neverthrow` or a custom implementation) in the Application layer to explicitly model success and failure without relying on try/catch control flow.
- **Global Error Handler:** The infrastructure API layer should catch unhandled exceptions, log them (omitting PHI), and return standardized HTTP status codes (e.g., 400 for Domain exceptions, 500 for unhandled infrastructure errors).

## Domain Event Patterns
To maintain loose coupling between modules in our monolith, we rely heavily on Domain Events.
- **Publishing:** The Application layer dispatches events after a transaction is committed.
- **Subscribing:** Other modules listen to these events in the background (using an in-memory bus or Redis queue).
- **Example:** The `Patient` module creates a new user. It fires `PatientRegistered`. The `Billing` module listens to this and automatically creates an empty billing profile.

## Rules and Constraints
- **Strict Typing:** No `any`. Utilize TypeScript's powerful type system to enforce business rules at compile time.
- **Fat Domain, Skinny Application:** Put business rules in Domain Entities/Value Objects, not scattered in Use Cases.
- **Dependency Injection:** Use DI (or manual constructor injection) for all external dependencies to ensure testability.
- **No Cross-Module DB Access:** A Use Case in the Billing module cannot inject the `PatientRepository`. It must inject the `PatientService` (API boundary).

## Related Skills
- `database-design`: For designing the infra layer storage.
- `testing`: For unit testing the domain and application layers.
