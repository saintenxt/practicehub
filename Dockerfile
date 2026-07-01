# syntax=docker/dockerfile:1

FROM node:24-alpine AS client-deps
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci

FROM client-deps AS client-build
COPY client/ ./
RUN npm run build

FROM node:24-alpine AS server
ENV NODE_ENV=production
WORKDIR /app/server
RUN apk add --no-cache su-exec
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ ./
COPY docker/server-entrypoint.sh /usr/local/bin/server-entrypoint.sh
RUN mkdir -p uploads && chown -R node:node /app/server
RUN chmod +x /usr/local/bin/server-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["server-entrypoint.sh"]
CMD ["node", "app.js"]

FROM caddy:2.10.2-alpine AS caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=client-build /app/client/build /srv
