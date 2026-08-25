# ============================================================================
# Medivo Customer App (React Native Web / Expo 51)
# Target Architecture: OCI Ubuntu / Coolify / Traefik
# ============================================================================

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat wget
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS builder
WORKDIR /app

# Copy full workspace context for deterministic pnpm workspace resolution
COPY . .

# Install dependencies deterministically
RUN pnpm install --frozen-lockfile

# Build Expo Web static application bundle
ENV CI=1
ENV NODE_ENV=production
RUN pnpm --filter @medivo/customer-app run build:web

# ============================================================================
# Production Runner Stage (Nginx Alpine Web Server)
# ============================================================================
FROM nginx:alpine AS runner

COPY apps/customer-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/customer-app/dist /usr/share/nginx/html

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8081/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
