# ============================================================================
# Medivo Customer BFF REST API Dockerfile (Node.js 20 / Express)
# Optimized for Sub-10s Incremental Docker Builds with BuildKit Caching
# Target Architecture: OCI Ubuntu / Coolify / Traefik
# ============================================================================

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat wget
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS builder
WORKDIR /app

# Step 1: Copy workspace manifests first for maximal Docker layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json* ./

COPY packages/api-client/package.json ./packages/api-client/
COPY packages/design-system/package.json ./packages/design-system/
COPY packages/theme/package.json ./packages/theme/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/

COPY apps/marketing-web/package.json ./apps/marketing-web/
COPY apps/customer-app/package.json ./apps/customer-app/
COPY apps/doctor-portal/package.json ./apps/doctor-portal/
COPY apps/admin-panel/package.json ./apps/admin-panel/
COPY apps/customer-bff/package.json ./apps/customer-bff/

COPY services/ai/package.json ./services/ai/
COPY services/api/package.json ./services/api/
COPY services/appointments/package.json ./services/appointments/
COPY services/auth/package.json ./services/auth/
COPY services/commerce/package.json ./services/commerce/
COPY services/notifications/package.json ./services/notifications/

# Step 2: Install dependencies using BuildKit package cache (Cached across builds)
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --no-frozen-lockfile

# Step 3: Copy source code (Only code changes invalidate from here down)
COPY . .

# Step 4: Build TypeScript dependencies and customer-bff
RUN pnpm --filter @medivo/types run build || true
RUN pnpm --filter @medivo/service-api run build
RUN pnpm --filter @medivo/customer-bff run build

# ============================================================================
# Production Runner Stage (Minimal Runtime Image)
# ============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=appuser:nodejs /app/packages ./packages
COPY --from=builder --chown=appuser:nodejs /app/services ./services
COPY --from=builder --chown=appuser:nodejs /app/apps/customer-bff ./apps/customer-bff

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:4000/health || exit 1

CMD ["node", "apps/customer-bff/dist/server.js"]
