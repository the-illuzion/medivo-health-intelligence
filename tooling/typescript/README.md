# TypeScript Configuration

> Shared TypeScript configuration for the Medivo Health Intelligence Platform monorepo.

## Overview

This package defines the base TypeScript configuration (`tsconfig.base.json`) and workspace-specific extends for all apps, packages, and services.

## Configuration Hierarchy

```
tsconfig.base.json (root)
├── apps/customer-platform/tsconfig.json    → extends base + Next.js
├── apps/marketing-web/tsconfig.json        → extends base + Next.js
├── apps/doctor-portal/tsconfig.json        → extends base + Next.js
├── apps/admin-panel/tsconfig.json          → extends base + Next.js
├── apps/mobile/tsconfig.json               → extends base + React Native
├── apps/*-bff/tsconfig.json                → extends base + Node.js
├── packages/*/tsconfig.json                → extends base (library)
└── services/*/tsconfig.json                → extends base + Node.js
```

## Strict Mode Options

All enabled in the base config:

| Option | Value | Purpose |
|--------|-------|---------|
| `strict` | `true` | Enables all strict type checking |
| `noUncheckedIndexedAccess` | `true` | Index signatures return `T \| undefined` |
| `noImplicitOverride` | `true` | Requires `override` keyword |
| `noPropertyAccessFromIndexSignature` | `true` | Forces bracket notation for dynamic keys |
| `forceConsistentCasingInFileNames` | `true` | Prevents casing mismatches |
| `isolatedModules` | `true` | Required for SWC/esbuild transpilation |

## Path Aliases

Defined in root `tsconfig.base.json`:
```json
{
  "paths": {
    "@medivo/types": ["./packages/types/src"],
    "@medivo/utils": ["./packages/utils/src"],
    "@medivo/ui": ["./packages/ui/src"],
    "@medivo/design-system": ["./packages/design-system/src"]
  }
}
```

## Module Resolution

- **Strategy**: `bundler` (TypeScript 5+ compatible)
- **Module**: `ESNext`
- **Target**: `ES2022`
- **Lib**: `ES2022`, `DOM`, `DOM.Iterable`

## Build Outputs

- `declaration: true` — generates `.d.ts` files
- `declarationMap: true` — enables Go to Definition across packages
- `sourceMap: true` — debugging support

## Development

```bash
# Type check entire monorepo
pnpm run type-check

# Type check specific workspace
pnpm --filter @medivo/customer-platform type-check
```

## Status
✅ Configuration defined — see root `tsconfig.base.json`