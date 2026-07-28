# ESLint Configuration

> Shared ESLint configuration for the Medivo Health Intelligence Platform monorepo.

## Overview

This package provides a centralized ESLint configuration that enforces consistent code quality standards across all apps, packages, and services in the monorepo.

## Included Configurations

### Base Configuration
- **Parser**: `@typescript-eslint/parser` for TypeScript support
- **Extends**: `eslint:recommended`, `@typescript-eslint/recommended`, `prettier`
- **Environment**: Node.js, Browser, ES2022

### Rules

| Rule | Setting | Rationale |
|------|---------|----------|
| `no-console` | warn | Use structured logger instead |
| `@typescript-eslint/no-explicit-any` | error | No `any` types — use `unknown` and narrow |
| `@typescript-eslint/no-unused-vars` | error | Clean code, no dead variables |
| `@typescript-eslint/explicit-function-return-type` | warn | Enforce return types on exported functions |
| `no-restricted-imports` | error | Prevent cross-domain imports |
| `import/no-cycle` | error | Prevent circular dependencies |

### Framework-Specific Presets
- **`next`**: Adds `eslint-plugin-next` rules for Next.js apps
- **`react`**: Adds `eslint-plugin-react`, `eslint-plugin-react-hooks`, accessibility rules
- **`node`**: Adds Node.js-specific rules for backend services and BFFs

## Usage

In any workspace `package.json` or `.eslintrc.js`:
```js
module.exports = {
  extends: [require.resolve('@medivo/eslint-config')],
};
```

For Next.js apps:
```js
module.exports = {
  extends: [require.resolve('@medivo/eslint-config/next')],
};
```

## Domain Boundary Enforcement

The `no-restricted-imports` rule prevents cross-domain imports:
- `packages/skin` cannot import from `packages/doctor`
- `apps/*` cannot import from `services/*`
- Only `packages/types` and `packages/utils` are universally importable

## Development

```bash
# Lint entire monorepo
pnpm run lint

# Lint specific workspace
pnpm --filter @medivo/customer-platform lint
```

## Status
✅ Configuration defined — awaiting workspace package setup