# ============================================================================
# Medivo Appointments & Telehealth Service Dockerfile (Node.js 20 / Express)
# Target Architecture: OCI Ubuntu / Coolify Internal Microservice
# ============================================================================

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat wget
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY services/appointments/ ./services/appointments/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @medivo/service-appointments run build

# ============================================================================
# Production Runner Stage
# ============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4002

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=appuser:nodejs /app/packages ./packages
COPY --from=builder --chown=appuser:nodejs /app/services/appointments ./services/appointments

USER appuser

EXPOSE 4002

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:4002/health || exit 1

CMD ["node", "services/appointments/dist/server.js"]
