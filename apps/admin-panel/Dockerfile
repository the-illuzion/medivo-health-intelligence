# ============================================================================
# Medivo Admin Panel Dockerfile (Next.js 14 Standalone)
# Optimized for Sub-15s Incremental Docker Builds with BuildKit Caching
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

# Step 2: Install dependencies using BuildKit package cache
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --no-frozen-lockfile

# Step 3: Copy source code
COPY . .

# Step 4: Build Next.js application in standalone mode with compiler cache mount
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN --mount=type=cache,target=/app/apps/admin-panel/.next/cache \
    pnpm --filter @medivo/admin-panel run build

# ============================================================================
# Production Runner Stage (Minimal Runtime Image)
# ============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output and static assets
COPY --from=builder /app/apps/admin-panel/public ./apps/admin-panel/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-panel/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-panel/.next/static ./apps/admin-panel/.next/static

USER nextjs

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3002/ || exit 1

CMD ["node", "apps/admin-panel/server.js"]
