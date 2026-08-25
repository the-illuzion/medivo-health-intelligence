# ============================================================================
# Medivo Customer BFF REST API Dockerfile (Node.js 20 / Express)
# Target Architecture: OCI Ubuntu / Coolify / Traefik
# ============================================================================

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat wget
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS builder
WORKDIR /app

# Copy full workspace context for deterministic pnpm workspace resolution
COPY . .

RUN pnpm install --frozen-lockfile
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
