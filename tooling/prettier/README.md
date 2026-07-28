# Prettier Configuration

> Shared Prettier configuration for the Medivo Health Intelligence Platform monorepo.

## Overview

This package provides a centralized Prettier configuration ensuring consistent code formatting across all workspaces.

## Configuration

| Option | Value | Rationale |
|--------|-------|----------|
| `semi` | `true` | Explicit statement termination |
| `trailingComma` | `"all"` | Cleaner git diffs |
| `singleQuote` | `true` | Consistency with TypeScript community |
| `printWidth` | `100` | Balance readability and screen usage |
| `tabWidth` | `2` | Standard TypeScript indentation |
| `bracketSpacing` | `true` | Readability in object literals |
| `arrowParens` | `"always"` | Consistency in arrow functions |
| `endOfLine` | `"lf"` | Unix-style line endings for cross-platform |

## Overrides

```json
{
  "overrides": [
    {
      "files": "*.md",
      "options": { "proseWrap": "always" }
    },
    {
      "files": "*.json",
      "options": { "tabWidth": 2 }
    }
  ]
}
```

## Usage

```bash
# Format entire monorepo
pnpm run format

# Check formatting (CI)
pnpm run format -- --check
```

## Integration

- **ESLint**: Uses `eslint-config-prettier` to disable conflicting rules
- **Editor**: `.editorconfig` at root aligns with these settings
- **Git Hooks**: Format-on-commit via `lint-staged` (when configured)

## Ignored Paths

See `.prettierignore` at root:
- `node_modules/`, `.next/`, `dist/`, `build/`, `coverage/`, `.turbo/`, `pnpm-lock.yaml`

## Status
✅ Configuration defined — see root `.prettierrc`