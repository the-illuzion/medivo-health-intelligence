# ============================================================================
# Medivo Customer App (React Native Web / Expo 51)
# Target Architecture: OCI Ubuntu / Coolify / Traefik
# ============================================================================

FROM nginx:alpine AS runner

RUN apk add --no-cache wget

COPY apps/customer-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/customer-app/dist /usr/share/nginx/html

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8081/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
