# Project Memory

## Project Identity
- **Name**: Medivo Health Intelligence Platform
- **Current Version**: 1.0.0 (Greenfield)
- **Vision**: To be the premium AI-powered digital health ecosystem, offering proactive, personalized health intelligence. We aim to bridge the gap between reactive healthcare and proactive wellness using state-of-the-art AI.
- **Mission**: To empower users with actionable health insights through advanced AI analysis, while maintaining the highest standards of data security, privacy, and clinical accuracy. We believe healthcare should be accessible, insightful, and continuous.

### Team Context
- **Structure**: Cross-functional pods aligned to domains (e.g., Core Platform, Health Intelligence, Commerce, User Experience). Each pod contains frontend, backend, and AI specialists.
- **Primary Stakeholders**: Product Management, Clinical Advisory Board (Medical Doctors), Engineering Leadership, Security & Compliance Officers.
- **Operating Mode**: AI-augmented development leveraging AI Engineering OS v5.1. Autonomous agents handle boilerplate, scaffolding, and documentation sync, while humans review critical architecture and security boundaries.

### Version Roadmap
- **v0.1 (MVP - Internal Beta)**: Basic user authentication (OAuth), profile management, secure data storage, and initial Skin Intelligence AI analysis pipelines (classification only).
- **v1.0 (Initial Launch - Public Beta)**: Full Skin Intelligence (classification and severity), AI Health Reports generation, integrated product marketplace (skincare), and dermatologist booking system.
- **v2.0 (Expansion)**: Addition of Heart Rate Variability (HRV) analysis, Sleep pattern tracking, Stress indicators, and Nutrition Intelligence modules. Integration with Apple Health and Google Fit.
- **v3.0 (Holistic Platform)**: Senior Care modules, Longevity Intelligence, predictive health analytics, and advanced family health tracking features.

---

## Architecture Decisions Log

### 1. Architectural Style: Modular Monolith
- **Context**: The project is greenfield with a small initial team, but the domain is extremely complex (healthcare, AI, e-commerce) and expected to grow significantly over the next 24 months.
- **Decision**: Adopt a Modular Monolith architecture instead of Microservices.
- **Rationale**: Reduces operational overhead, deployment complexity, and network latency during early stages. It enforces strict logical boundaries (packages/apps) which will allow seamless extraction into microservices if scaling requires it in the future without premature optimization.
- **Consequences**: Requires strict discipline to avoid tight coupling between domains. Cross-domain communication must happen via well-defined APIs, internal SDKs, or events, not direct database access or shared global state.

### 2. Database Strategy: Single PostgreSQL Instance, Schema-Per-Domain
- **Context**: We need relational data integrity, ACID compliance, but want to maintain bounded contexts to support the modular monolith design.
- **Decision**: Use a single PostgreSQL database instance, utilizing separate schemas for each domain (e.g., `auth_schema`, `skin_schema`, `commerce_schema`).
- **Rationale**: Simplifies backups, transaction management, and connection pooling while preventing domains from executing raw joins across bounded contexts. It gives us the data isolation of microservices with the operational simplicity of a monolith.
- **Consequences**: Cross-domain data aggregation must be handled in the application layer (or via BFFs) rather than at the database query level. Migration scripts must be strictly scoped to their respective schemas.

### 3. Frontend Architecture: BFF Pattern & Next.js
- **Context**: The platform will serve distinct client types (Customers on Web/Mobile, Doctors on Web/Tablet, Admins on Web). Each needs vastly different data payloads and security contexts.
- **Decision**: Use Next.js for web applications and implement the Backend-For-Frontend (BFF) pattern for each client type (e.g., `customer-bff`, `doctor-bff`).
- **Rationale**: Next.js provides excellent performance, SSR/SSG for optimal SEO (critical for marketing), and a robust React ecosystem. The BFF pattern isolates security boundaries, prevents over-fetching, and optimizes payload size for different network conditions.
- **Consequences**: Increases the number of deployment artifacts and initial setup time. BFFs must not contain core business logic; they only orchestrate, map data, and handle client-specific authentication sessions.

### 4. UI/UX: TailwindCSS + shadcn/ui
- **Context**: The vision requires a premium, dynamic, aesthetic UI that builds trust without the rigidity of traditional component libraries.
- **Decision**: Use TailwindCSS combined with shadcn/ui.
- **Rationale**: Provides a utility-first approach with copy-paste components that are fully customizable. Enables rapid development of high-fidelity, accessible interfaces that align perfectly with our custom design tokens.
- **Consequences**: The `design-system` package must strictly govern tokens, colors, and core components to prevent UI inconsistency and class bloat across apps.

---

## Business Rules

### Health Data & Privacy Domain
- **Rule H-1 (Encryption)**: All Protected Health Information (PHI), including images, test results, and AI inferences, must be encrypted at rest using AES-256 and in transit using TLS 1.3 or higher.
- **Rule H-2 (Consent)**: Explicit, logged, and timestamped user consent is strictly required before any AI analysis is performed on submitted health data. Consent forms must be versioned.
- **Rule H-3 (Retention)**: Data retention policies must comply with regional healthcare regulations; soft deletes are mandatory for health records to preserve audit trails. Hard deletes require admin override.
- **Rule H-4 (Anonymization)**: Data sent to external AI inference clusters must be stripped of all personally identifiable information (PII).

### AI & Machine Learning Domain
- **Rule A-1 (Disclaimers)**: All AI-generated health insights, reports, and recommendations must be accompanied by prominent medical disclaimers ("This is not medical advice").
- **Rule A-2 (Traceability)**: Every AI inference must log the model version, input hash, confidence score, and timestamp for clinical review, auditing, and continuous model training.
- **Rule A-3 (Human-in-the-Loop)**: High-risk AI classifications (e.g., detection of potential melanoma) must automatically flag the record and route it to a certified dermatologist for verification before displaying the result to the user.

### Commerce & Subscriptions Domain
- **Rule C-1 (Payments)**: No raw payment data (credit cards, CVV) may touch our backend servers or databases. All transactions must be tokenized via the third-party payment provider (e.g., Stripe).
- **Rule C-2 (Refunds)**: AI analysis credits and digital consultation fees are non-refundable once the service has been rendered (inference executed or consultation completed), except in cases of proven technical failure.

### Appointments & Doctor Domain
- **Rule D-1 (Booking)**: Dermatologist consultations must be scheduled in advance through the booking engine. There is no on-demand "instant chat" feature initially to ensure doctor availability and quality of care.
- **Rule D-2 (Verification)**: Only credential-verified doctors (vetted by the admin team) can access patient AI reports and provide consultations.

---

## Technology Constraints

### Frontend Layer Constraints
- **TypeScript**: Strict mode is mandatory (`"strict": true` in `tsconfig.json`). No `any` or `@ts-ignore` allowed without explicit lead approval.
- **State Management**: Use React Server Components (RSC) and Server Actions for data fetching and mutations where possible. Minimize global client state (use Zustand only if cross-component client state is strictly necessary).
- **Styling**: Inline styles (`style={{...}}`) are prohibited; all styling must use Tailwind utility classes or defined tokens from the `design-system`.
- **Accessibility**: All interactive elements must have appropriate `aria-` labels and be navigable via keyboard.

### Backend Layer Constraints
- **Validation**: All incoming HTTP requests, event payloads, and outgoing responses must be strictly typed and validated using Zod schemas at the boundary.
- **Business Logic**: No business logic is permitted in controllers, route handlers, or BFFs. It must reside strictly in Domain Services or Use Cases within the `packages/` directory.
- **Error Handling**: Use structured, centralized error handling. Never leak stack traces, raw database errors, or internal service names to the client API response.

### Database Layer Constraints
- **Direct Access**: Repositories (`*.repository.ts`) are the only components allowed to communicate directly with the database.
- **Migrations**: Database schema changes must be version-controlled, declarative, and applied via automated migration scripts (e.g., Prisma migrations).
- **Cross-Schema Queries**: Raw SQL joins across different schemas (e.g., joining `auth_schema.users` with `skin_schema.analyses`) are strictly forbidden to maintain bounded contexts.

### Infrastructure Constraints
- **Statelessness**: All application instances (BFFs, APIs) must be entirely stateless to allow horizontal scaling. Session state, rate limiting, and caching must reside in Redis.
- **Event-Driven**: Asynchronous tasks, heavy computation, and cross-domain events must use BullMQ backed by Redis for reliable background processing.

---

## Stable Patterns

### 1. Repository Pattern
Used exclusively for all data access to abstract database specifics and allow mocking in tests.
*Reference*: `packages/core/src/repositories/base.repository.ts`
```typescript
export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
}
```

### 2. Use Case Pattern
Encapsulates core business logic. A Use Case should represent a single, testable, atomic business action.
*Reference*: `packages/skin/src/use-cases/analyze-skin-image.usecase.ts`
```typescript
export class AnalyzeSkinImageUseCase {
  constructor(private readonly aiService: AIService, private readonly repo: SkinAnalysisRepository) {}
  async execute(dto: AnalyzeSkinImageDto): Promise<AnalysisResult> { ... }
}
```

### 3. Event-Driven Communication
Domains communicate asynchronously via events to maintain loose coupling.
*Reference*: `SkinAnalysisCompletedEvent` published to `NotificationQueue`.
```typescript
eventBus.publish('skin.analysis.completed', { analysisId: '123', userId: '456' });
```

### 4. Zod Boundary Validation
End-to-end type safety from request to database.
*Reference*: `packages/types/src/schemas/user.schema.ts`
```typescript
export const CreateUserSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
```

---

## Important Limitations & Compliance Considerations

- **Hospital Independence**: The platform operates independently from hospital software and infrastructure. It is not an EMR (Electronic Medical Record) or EHR replacement. It is a consumer-facing digital health platform.
- **Integration Scope**: Hospital connectivity is limited strictly to external REST/GraphQL APIs, secure WebViews, and custom Enterprise SSO (SAML/OIDC) integrations.
- **Regulatory Awareness**: While the initial launch may not seek formal FDA/CE medical device certification (as we classify as a wellness tool), the architecture, data handling, encryption, and audit trails must be designed to meet strict HIPAA (US) and GDPR (EU) standards from day one.
- **AI Limitations**: The AI is positioned as a "Wellness and Intelligence" tool, not a diagnostic medical device. Language throughout the UI, marketing, and legal terms must reflect this constraint to avoid regulatory penalties.
