# Design System

## Description
Design system built with Atomic Design principles. Atoms, molecules, organisms, templates, layouts. Tokens for colors, typography, spacing, radius, shadows. Responsive, dark mode, accessible.
This module is a critical part of the Medivo Health Intelligence Platform ecosystem, designed to ensure high performance, type safety, and scalability. It integrates seamlessly with the rest of the monorepo.

## Technology Stack
- **Core**: TailwindCSS, TypeScript, shadcn/ui
- **Dependencies**: tailwindcss, react
- **Runtime**: Node.js / Browser (depending on target)
- **Typing**: TypeScript for end-to-end type safety

## Architecture Overview
This module follows the established Clean Architecture principles of the monorepo.
Dependencies are carefully managed to prevent circular references and maintain strict module boundaries.
Internal logic is encapsulated, and only necessary interfaces are exposed via the `index.ts` entry point.

## Getting Started

### Installation
Since this is part of the monorepo, dependencies are managed via `pnpm` at the root level.
```bash
# From the root directory
pnpm install
```

### Development
To start the development process or watcher for this specific module:
```bash
pnpm --filter @medivo/design-system dev
```

### Building
To build this package for production:
```bash
pnpm --filter @medivo/design-system build
```

### Testing
Run the test suite specifically for this module:
```bash
pnpm --filter @medivo/design-system test
```

## Contributing
Please refer to the root `README.md` and the `docs/CONTRIBUTING.md` for guidelines on how to contribute to this module.
Ensure all tests and linters pass before submitting a Pull Request.

## Status
🚧 Under Active Development\n