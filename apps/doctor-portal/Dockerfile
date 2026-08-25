# ============================================================================
# Medivo Doctor Portal (High-Performance Turbo-Pruned Next.js 14 Build)
# Target Architecture: OCI Ubuntu / Coolify / Traefik
# ============================================================================

# Stage 1: Prune monorepo to isolate @medivo/doctor-portal
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune @medivo/doctor-portal --docker

# Stage 2: Install dependencies and build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@9.0.0
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --no-frozen-lockfile

COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN --mount=type=cache,target=/app/apps/doctor-portal/.next/cache \
    pnpm --filter @medivo/doctor-portal run build

# Stage 3: Minimal Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/doctor-portal/public ./apps/doctor-portal/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/doctor-portal/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/doctor-portal/.next/static ./apps/doctor-portal/.next/static

USER nextjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3001/ || exit 1

CMD ["node", "apps/doctor-portal/server.js"]
