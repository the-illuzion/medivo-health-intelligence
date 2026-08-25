# ============================================================================
# Medivo Customer BFF REST API (High-Performance Turbo-Pruned Docker Build)
# Target Architecture: OCI Ubuntu / Coolify / Traefik
# ============================================================================

# Stage 1: Prune monorepo to isolate @medivo/customer-bff and dependencies
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune @medivo/customer-bff --docker

# Stage 2: Install dependencies and build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# Copy pruned package.json manifests (Layer cached!)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install dependencies with persistent BuildKit store cache
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --no-frozen-lockfile

# Copy full pruned source code
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Build required TypeScript packages
RUN pnpm --filter @medivo/types run build || true
RUN pnpm --filter @medivo/service-api run build
RUN pnpm --filter @medivo/customer-bff run build

# Stage 3: Minimal Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/packages ./packages
COPY --from=builder --chown=appuser:nodejs /app/services/api ./services/api
COPY --from=builder --chown=appuser:nodejs /app/apps/customer-bff ./apps/customer-bff

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:4000/health || exit 1

CMD ["node", "apps/customer-bff/dist/server.js"]
