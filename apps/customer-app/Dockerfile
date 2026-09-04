# ============================================================================
# Medivo Customer App (React Native Web / Expo 51 Multi-Stage Docker Build)
# Target Architecture: OCI Ubuntu / Coolify / Traefik
# ============================================================================

# Stage 1: Prune monorepo to isolate @medivo/customer-app and workspace dependencies
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune @medivo/customer-app --docker

# Stage 2: Install dependencies and compile static web bundle
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# Copy pruned workspace manifests (Cached layer)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install dependencies with persistent BuildKit store cache
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --no-frozen-lockfile

# Copy pruned source files
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Build internal shared packages
RUN pnpm --filter @medivo/types run build || true
RUN pnpm --filter @medivo/utils run build || true
RUN pnpm --filter @medivo/api-client run build || true
RUN pnpm --filter @medivo/theme run build || true
RUN pnpm --filter @medivo/design-system run build || true

# Export Expo Web Bundle
WORKDIR /app/apps/customer-app
ENV NODE_ENV=production
ENV CI=1
RUN --mount=type=cache,target=/root/.metro \
    pnpm exec expo export -p web

# Stage 3: High-Performance Nginx Alpine Runner
FROM nginx:alpine AS runner
RUN apk add --no-cache wget curl

COPY apps/customer-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/customer-app/dist /usr/share/nginx/html

EXPOSE 8081 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8081/health || curl -sf http://127.0.0.1:8081/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
