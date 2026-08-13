FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/doctor-portal/ ./apps/doctor-portal/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @medivo/doctor-portal run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/apps/doctor-portal/public ./public
COPY --from=builder /app/apps/doctor-portal/.next/standalone ./
COPY --from=builder /app/apps/doctor-portal/.next/static ./.next/static

EXPOSE 3001

CMD ["node", "apps/doctor-portal/server.js"]
