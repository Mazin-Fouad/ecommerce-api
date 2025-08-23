# Multi-stage build für optimale Docker Image Größe
FROM node:18-alpine AS builder

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package.json und package-lock.json kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm ci --only=production && npm cache clean --force

# Produktions-Stage
FROM node:18-alpine AS production

# Sicherheits-Updates und Tools installieren
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Non-root User erstellen
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Arbeitsverzeichnis setzen
WORKDIR /app

# Node_modules aus Builder-Stage kopieren
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Anwendungscode kopieren
COPY --chown=nodejs:nodejs . .

# Umgebungsvariablen setzen
ENV NODE_ENV=production
ENV PORT=3000

# Port exponieren
EXPOSE 3000

# User wechseln
USER nodejs

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Anwendung mit dumb-init starten (für korrekte Signal-Behandlung)
CMD ["dumb-init", "node", "src/server.js"]