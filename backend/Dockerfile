# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY shared ./shared
COPY backend ./backend

RUN cd shared && npm ci && npm run build
RUN cd backend && npm ci --only=production=false && npx prisma generate && npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g nodejs && adduser -S nodejs -G nodejs

COPY backend/package*.json ./
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/shared ./shared

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/main"]
