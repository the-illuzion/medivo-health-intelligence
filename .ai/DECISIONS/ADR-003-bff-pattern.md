# ADR-003: Backend-For-Frontend (BFF) Pattern

## Status
Accepted

## Date
2026-07-28

## Context
The Medivo platform serves multiple distinct user types and client applications:
- **Patient Web App (PWA)**
- **Patient Mobile App (React Native/Native)**
- **Doctor/Provider Portal (Web)**
- **Admin Dashboard (Web)**

Each client has vastly different needs regarding data aggregation, payload size, authentication mechanisms, and update frequency. A single general-purpose API would become bloated, hard to maintain, and inefficient for specific clients.

## Decision
We will implement the **Backend-For-Frontend (BFF)** pattern. We will create dedicated BFF services (or API boundaries within the monolith) for each major client category:
1. Patient BFF
2. Provider BFF
3. Admin BFF

## Rationale
1. **Tailored APIs:** Each BFF can optimize its API responses for its specific client, aggregating data from multiple underlying core modules and formatting it exactly as the UI needs it. This reduces client-side logic and over-fetching/under-fetching.
2. **Security Boundary:** BFFs act as a security layer. The Patient BFF only exposes endpoints relevant to patients and handles patient-specific auth/authorization. It cannot accidentally expose admin functions.
3. **Independent Evolution:** The API for the mobile app can evolve independently from the API for the admin dashboard without breaking each other.
4. **Performance:** BFFs can perform server-side data composition and caching specific to the client's access patterns.

## Consequences

### Positive
- Highly optimized client experiences (faster load times, less data transfer).
- Cleaner client-side code (less data manipulation required).
- Better security compartmentalization.

### Negative / Trade-offs
- **Code Duplication:** Some orchestration logic might be duplicated across different BFFs.
- **Increased Surface Area:** More API entry points to document, test, and maintain.
- **Deployment Coupling (Initially):** While in a monolith, updating a BFF requires deploying the whole application.

## Alternatives Considered
1. **Single API Gateway (One-Size-Fits-All):** Rejected. Becomes a bottleneck and a "god API" that is difficult to maintain and optimize for everyone.
2. **GraphQL:** Considered, but rejected for the initial phase. While it solves over-fetching, it shifts complexity to the frontend for query formulation and can be complex to secure and cache effectively compared to tailored REST/RPC endpoints in a BFF. We may reconsider GraphQL *within* a BFF later if needed.

## Implementation Notes
- The BFFs reside in the Application layer, sitting in front of the Core Domain modules.
- BFFs should not contain core business logic; they are orchestration, translation, and presentation layers for the API.
- We will use Next.js API routes (or tRPC/Hono within Next.js) as the implementation mechanism for web BFFs to keep them close to the frontend code.
