FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy root workspace configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/customer-bff/package.json ./apps/customer-bff/package.json
COPY packages/ ./packages/
COPY services/ ./services/
COPY apps/customer-bff/ ./apps/customer-bff/

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @medivo/customer-bff run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/customer-bff/package.json ./apps/customer-bff/package.json
COPY --from=builder /app/apps/customer-bff/dist ./apps/customer-bff/dist
COPY --from=builder /app/services ./services
COPY --from=builder /app/packages ./packages

EXPOSE 4000

CMD ["node", "apps/customer-bff/dist/server.js"]
