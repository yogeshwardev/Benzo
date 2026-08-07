# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production=false

COPY . .
RUN npm run build
RUN npx prisma generate

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g nodejs && adduser -S nodejs -G nodejs

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/main"]
