# ==========================================
# TaskFlow Backend Production Dockerfile
# Base Image: Lightweight Node.js 20 on Alpine Linux
# ==========================================
FROM node:20-alpine AS production

# Set working directory inside container
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install curl for Docker health check
RUN apk --no-cache add curl

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Run as non-root node user for container security
USER node

# Expose default backend port
EXPOSE 5000

# Docker healthcheck using backend /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the Node.js Express server
CMD ["node", "src/server.js"]
