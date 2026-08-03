FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/tools-kit/package.json packages/tools-kit/package.json
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_TOOLS_DOMAIN=tools.168.144.126.233.sslip.io
ARG NEXT_PUBLIC_TOOLS_PATH_ROUTING=true
ARG NEXT_PUBLIC_TRACK_ENDPOINT=/api/event
ENV NEXT_PUBLIC_TOOLS_DOMAIN=${NEXT_PUBLIC_TOOLS_DOMAIN}
ENV NEXT_PUBLIC_TOOLS_PATH_ROUTING=${NEXT_PUBLIC_TOOLS_PATH_ROUTING}
ENV NEXT_PUBLIC_TRACK_ENDPOINT=${NEXT_PUBLIC_TRACK_ENDPOINT}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build:web

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "apps/web/server.js"]
