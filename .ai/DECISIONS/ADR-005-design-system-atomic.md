# ADR-005: Atomic Design Restricted to Design System

## Status
Accepted

## Date
2026-07-28

## Context
We need a strategy for organizing our frontend React components. 
"Atomic Design" (Atoms, Molecules, Organisms, Templates, Pages) is popular but can lead to deeply nested, hard-to-navigate structures if applied universally to complex business applications. However, we also want to utilize Domain-Driven Design (DDD) to organize our business logic and features logically.

## Decision
We will use the **Atomic Design methodology ONLY within the isolated `packages/design-system`**. 

For the actual **business applications** (e.g., `apps/patient-web`, `apps/doctor-portal`), we will use **Domain-Driven Feature Architecture** (grouping by feature/domain, e.g., `features/appointments`, `features/billing`).

## Rationale
1. **Design System Suitability:** Atomic design is perfect for building a UI kit. Buttons (Atoms), Form Fields (Molecules), and complex UI widgets (Organisms) map perfectly to this structure. It provides a pure, presentational layer devoid of business logic.
2. **Business App Cohesion:** In a business application, grouping by technical type (e.g., putting all "Organisms" in one folder) scatters related code. If I am working on the "Booking" feature, I want the BookingForm, BookingAPI, and BookingState to be co-located. Feature-based routing/organization aligns perfectly with our modular backend approach.
3. **Clear Boundaries:** This establishes a hard line. If a component contains business logic or talks to an API, it belongs in a Feature. If it is purely presentational and highly reusable, it belongs in the Design System.

## Consequences

### Positive
- The Design System remains pure, documented, and highly reusable.
- Business apps are easy to navigate by feature, improving developer velocity.
- Prevents the "prop drilling" nightmare often associated with strictly pure Organisms in complex apps.

### Negative / Trade-offs
- Developers must actively decide if a new component is a generic UI piece (goes to design-system) or a specific feature piece.
- Potential for slight duplication if a feature component *could* be generalized but isn't immediately.

## Alternatives Considered
1. **Atomic Design Everywhere:** Rejected. Leads to poor cohesion in business logic. An "Organism" folder becomes a dumping ground for highly specific, complex, stateful components that have nothing to do with each other.
2. **No Atomic Design (Ad-hoc):** Rejected. Without structure in the design system, it becomes inconsistent and hard to maintain.

## Implementation Notes
- `packages/design-system` will export purely presentational components built on top of Tailwind and shadcn/ui.
- Application code will import these UI components and compose them into Feature components that handle state, data fetching, and business logic.
