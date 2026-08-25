# ============================================================================
# Medivo Customer App (React Native Web / Expo 51)
# Multi-stage production build: Node Builder -> Nginx Runner
# Target Architecture: OCI Ubuntu / Coolify / Traefik
# ============================================================================

# Stage 1: Build static web bundle
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.1.0 --activate
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

# Export Expo Web Bundle
WORKDIR /app/apps/customer-app
ENV NODE_ENV=production
RUN npx expo export -p web

# Stage 2: Serve with high-performance Nginx Alpine
FROM nginx:alpine AS runner

RUN apk add --no-cache wget

COPY apps/customer-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/customer-app/dist /usr/share/nginx/html

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8081/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
