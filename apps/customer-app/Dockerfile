# ============================================================================
# Medivo Customer App (React Native Web / Expo 51)
# Multi-stage production build: Node Builder -> Nginx Runner
# Optimized for Fast Incremental Docker Builds with BuildKit Caching
# Target Architecture: OCI Ubuntu / Coolify / Traefik
# ============================================================================

FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

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

# Step 3: Copy source files
COPY . .

# Step 4: Export Expo Web Bundle
WORKDIR /app/apps/customer-app
ENV NODE_ENV=production
RUN --mount=type=cache,target=/root/.metro \
    npx expo export -p web

# ============================================================================
# Stage 2: Serve with high-performance Nginx Alpine
# ============================================================================
FROM nginx:alpine AS runner

RUN apk add --no-cache wget

COPY apps/customer-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/customer-app/dist /usr/share/nginx/html

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8081/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
