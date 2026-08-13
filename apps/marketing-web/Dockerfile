FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/marketing-web/ ./apps/marketing-web/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @medivo/marketing-web run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/marketing-web/public ./public
COPY --from=builder /app/apps/marketing-web/.next/standalone ./
COPY --from=builder /app/apps/marketing-web/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "apps/marketing-web/server.js"]
