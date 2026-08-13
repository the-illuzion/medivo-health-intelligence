FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/admin-panel/ ./apps/admin-panel/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @medivo/admin-panel run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002

COPY --from=builder /app/apps/admin-panel/public ./public
COPY --from=builder /app/apps/admin-panel/.next/standalone ./
COPY --from=builder /app/apps/admin-panel/.next/static ./.next/static

EXPOSE 3002

CMD ["node", "apps/admin-panel/server.js"]
