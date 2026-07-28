---
name: testing
description: Test strategy and implementation guidelines for Medivo
---

# Testing Strategy Guidelines

## Overview
Medivo follows a pragmatic Testing Pyramid strategy to ensure high confidence in the platform's reliability, especially concerning critical health logic, data integrity, and AI integrations. We prioritize fast, deterministic unit tests over slow, brittle UI tests, while maintaining coverage across all layers.

## When to Activate
- When writing any new feature or module.
- When fixing a bug (write a regression test first).
- When modifying core domain logic or architectural foundations.

## The Testing Pyramid & Coverage Targets

### 1. Unit Tests (Base - High Volume, Fast)
- **Target:** Domain Entities, Value Objects, Application Use Cases, Utility functions, Frontend Hooks.
- **Coverage Target:** **90%+**
- **Tools:** Vitest / Jest.
- **Rules:**
  - Must run completely in memory. No database connections, no network calls.
  - Use Mocks/Stubs for Repositories and external services.
  - Focus on business rules: e.g., "An appointment cannot be scheduled in the past."

### 2. Integration Tests (Middle - Medium Volume, Moderate Speed)
- **Target:** API Endpoints (BFFs), Database Repositories, Third-party service adapters (e.g., Stripe, LLM APIs).
- **Coverage Target:** **70%+**
- **Tools:** Vitest + Supertest, Testcontainers (for ephemeral PostgreSQL/Redis).
- **Rules:**
  - Test the boundaries. Does the API correctly validate input via Zod? Does the Repository correctly save and retrieve from the real database schema?
  - Use a dedicated test database, wiped between test suites.
  - *Do not mock the database* when testing Repositories. Test against a real DB schema.

### 3. End-to-End (E2E) Tests (Top - Low Volume, Slow)
- **Target:** Critical user journeys (e.g., Patient Login -> View Lab Results -> Book Follow-up, Admin Onboarding).
- **Coverage Target:** **Critical Paths Only** (Do not aim for percentage, aim for flow coverage).
- **Tools:** Playwright / Cypress.
- **Rules:**
  - Run against a fully deployed staging environment or a comprehensive local docker-compose stack.
  - Must test the actual UI rendered in a real browser, including frontend routing and state.

## Test File Naming and Location
- Tests must be co-located with the file they are testing.
- Suffix test files with `.test.ts` or `.spec.ts`.
- Example: `ScheduleAppointmentUseCase.ts` -> `ScheduleAppointmentUseCase.test.ts`.
- Exception: Global E2E tests live in a dedicated `/e2e` directory at the project root.

## Mock and Fixture Patterns
- **Object Mothers / Builders:** Create utility functions to generate valid domain objects for testing, reducing boilerplate.
  ```typescript
  // Fixture usage
  const validPatient = PatientBuilder.new().withName("John").build();
  ```
- **Dependency Injection Mocks:** In the Application layer, pass mock implementations of interfaces.
  ```typescript
  class MockAppointmentRepo implements IAppointmentRepository {
    async save(appt: Appointment) { /* record it */ }
  }
  ```
- **External Network Mocks:** For integration tests, use MSW (Mock Service Worker) or `nock` to intercept HTTP calls to external APIs (e.g., LLM providers) to ensure tests don't fail due to external rate limits or downtime.

## Health-Domain Specific Test Scenarios

### 1. AI Accuracy and Safety Testing
When integrating LLMs or machine learning models:
- **Deterministic Prompt Testing:** Ensure the prompt generation logic reliably includes necessary context (e.g., medical disclaimers) without injecting PII unnecessarily.
- **Structured Output Testing:** If the AI is expected to return JSON, write integration tests that assert the parser correctly handles missing fields, hallucinated fields, or malformed JSON gracefully.
- **Refusal Testing:** Inject malicious or inappropriate prompts (e.g., asking for a lethal prescription) and assert the system successfully rejects the request and logs the anomaly.

### 2. Data Integrity and Isolation
- **Cross-Patient Boundary Tests:** Write explicit tests ensuring `User A` querying an endpoint with `User B`'s ID receives a 403 Forbidden or 404 Not Found.
- **Schema Boundary Tests:** Verify that database queries do not accidentally join across forbidden module boundaries.

### 3. Consent Flows
- Test that a background job (e.g., data aggregation) immediately skips processing a patient's record if their `consent_status` is revoked in the mock repository.

## E2E Test Critical Paths
Focus E2E automation on flows that, if broken, cause severe business or clinical impact:
1. **Authentication:** Registration, Login, Password Reset, MFA enforcement.
2. **Core Clinical Read:** Patient successfully viewing their latest lab results or AI summary.
3. **Core Transaction:** Patient successfully booking and confirming an appointment.
4. **Provider Action:** Doctor successfully writing a note or approving a prescription.

## Test Structure (Arrange, Act, Assert)
Write tests that tell a story.
```typescript
describe('ScheduleAppointmentUseCase', () => {
  it('should fail if the patient has revoked scheduling consent', async () => {
    // 1. Arrange
    const mockRepo = new MockAppointmentRepository();
    const mockConsentService = { hasConsent: () => false };
    const useCase = new ScheduleAppointmentUseCase(mockRepo, mockConsentService);
    
    // 2. Act
    const result = await useCase.execute(validData);
    
    // 3. Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(ConsentRevokedException);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
```
