# Module Map

> [!NOTE]
> This document maintains the inventory of all packages and applications within the Medivo monorepo. It strictly defines the module boundaries, dependencies, and domain ownership required for the Modular Monolith architecture.

## Module Index

| Name | Type | Domain | Owner Team | Status | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `types` | Library | Core | Architecture | Planned | - |
| `utils` | Library | Core | Platform | Planned | `types` |
| `theme` | Library | UI | Frontend | Planned | - |
| `design-system`| Library | UI | Frontend | Planned | `theme`, `types` |
| `ui` | Library | UI | Frontend | Planned | `design-system`, `utils` |
| `auth` | Domain | Identity | Platform | Planned | `types`, `utils`, `api-client` |
| `skin` | Domain | Core Health | AI/Health | Planned | `types`, `utils`, `api-client` |
| `health` | Domain | Core Health | Health | Planned | `types`, `utils`, `api-client` |
| `reports` | Domain | AI/Health | AI/Health | Planned | `types`, `utils`, `api-client`, `health` |
| `ecommerce` | Domain | Commerce | Commerce | Planned | `types`, `utils`, `api-client` |
| `api-client` | Infrastructure| Platform | Platform | Planned | `types`, `utils` |

*(This is a representative subset of the packages in `packages/`)*

## Package Details (`packages/`)

### 1. `packages/types`
- **Purpose**: Global type definitions, interfaces, and Zod schemas shared across the entire monorepo.
- **Internal Structure**: Grouped by domain (`/auth`, `/health`, `/commerce`).
- **Exports**: TypeScript interfaces, enums, Zod schemas.
- **Dependencies**: *None*. (Strict leaf node).
- **Domain Ownership**: Shared/Architecture.

### 2. `packages/utils`
- **Purpose**: Pure utility functions (formatting, validation helpers, math).
- **Internal Structure**: Grouped by utility type (`/date`, `/string`, `/currency`).
- **Exports**: Helper functions.
- **Dependencies**: `types`.
- **Domain Ownership**: Shared/Platform.

### 3. `packages/ui`
- **Purpose**: Reusable React components (buttons, inputs, complex widgets) based on shadcn/ui.
- **Internal Structure**: `/components`, `/hooks`, `/lib`.
- **Exports**: React components, custom hooks.
- **Dependencies**: `design-system`, `theme`, `types`, `utils`.
- **Domain Ownership**: Frontend/Design.

### 4. Domain Packages (e.g., `packages/skin`, `packages/health`)
- **Purpose**: Encapsulate domain-specific business logic, rules, and UI components specific to that domain.
- **Internal Structure**: 
  - `/api`: Domain specific API fetchers.
  - `/components`: Domain specific UI components.
  - `/logic`: Pure business rules.
- **Exports**: Domain components, hooks, business logic functions.
- **Dependencies**: `types`, `utils`, `api-client`, `ui`.
- **Domain Ownership**: Specific Domain Teams.

## Application Details (`apps/`)

Apps compose packages to build deployable units.

- **`marketing-web`**: Depends on `ui`, `theme`. No domain packages.
- **`customer-platform`**: Depends on `ui`, `auth`, `skin`, `health`, `ecommerce`, `api-client`.
- **`doctor-portal`**: Depends on `ui`, `auth`, `appointments`, `health`, `api-client`.
- **`admin-panel`**: Depends on `ui`, `auth`, `analytics`, `ecommerce`, `api-client`.

## Service Details (`services/`)

Services encapsulate backend domain logic, database access, and event publishing.

- **`api`**: The gateway. Depends on all other services logically via internal routing.
- **`ai`**: Depends on `types`, `utils`.
- **`auth`**: Depends on `types`, `utils`.
- **`commerce`**: Depends on `types`, `utils`.

## Module Dependency Rules

> [!IMPORTANT]
> These rules are enforced strictly by `eslint-plugin-boundaries` and dependency-cruiser. Violations will fail the CI pipeline.

1. **Strict DAG**: The dependency graph must form a Directed Acyclic Graph. No circular dependencies allowed.
2. **Directionality**: 
   - `apps` → depend on `packages`
   - `services` → depend on `packages`
   - `packages` → depend on other `packages` (following hierarchy)
   - **NEVER**: `packages` depending on `apps` or `services`.
   - **NEVER**: `apps` depending directly on `services` code (communication is via HTTP/RPC only).
3. **Layer Isolation**:
   - `packages/types` must have zero internal monorepo dependencies.
   - `packages/utils` can only depend on `types`.
4. **Domain Isolation**:
   - Cross-domain logic in the frontend must occur in the application layer, not by domains importing each other directly unless explicitly approved (e.g., `reports` depending on `health`).

## Module Boundary Enforcement Rules

- **Encapsulation**: Packages must define strict exports in `package.json` (`exports` field) and an `index.ts` barrel file. Deep imports (e.g., `import { X } from '@medivo/skin/internal/utils'`) are strictly prohibited.
- **API Contracts**: Services communicate only via defined DTOs present in `packages/types`.

## Module Creation Checklist

When creating a new package or service:
- [ ] Initialize using Turborepo generator (`pnpm run generate`).
- [ ] Define precise `package.json` dependencies (no extraneous deps).
- [ ] Setup `index.ts` barrel file for public exports.
- [ ] Document the package intent in a local `README.md`.
- [ ] Add the package to the `Module Index` in this document.
- [ ] Define ownership in `CODEOWNERS`.
- [ ] Ensure unit tests are configured and running via `pnpm test`.
