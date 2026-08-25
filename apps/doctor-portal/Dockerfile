# ============================================================================
# Medivo Doctor Portal Dockerfile (Next.js 14 Standalone)
# Target Architecture: OCI Ubuntu / Coolify / Traefik
# ============================================================================

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat wget
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS builder
WORKDIR /app

# Copy root monorepo metadata
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./

# Copy required workspace packages
COPY packages/ ./packages/
COPY tooling/ ./tooling/
COPY apps/doctor-portal/ ./apps/doctor-portal/

# Install dependencies deterministically
RUN pnpm install --frozen-lockfile

# Build Next.js application in standalone mode
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm --filter @medivo/doctor-portal run build

# ============================================================================
# Production Runner Stage (Minimal Runtime Image)
# ============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output and static assets
COPY --from=builder /app/apps/doctor-portal/public ./apps/doctor-portal/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/doctor-portal/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/doctor-portal/.next/static ./apps/doctor-portal/.next/static

USER nextjs

EXPOSE 3001

# Healthcheck against internal port (127.0.0.1 to avoid IPv6 issues)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3001/ || exit 1

CMD ["node", "apps/doctor-portal/server.js"]
