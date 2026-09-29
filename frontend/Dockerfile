# ==========================================
# TaskFlow Frontend Multi-Stage Dockerfile
# Stage 1: Build React static assets with Node.js
# Stage 2: Serve production bundle with Nginx Alpine
# ==========================================

# ----------------- Stage 1: Build -----------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source files
COPY . .

# Build production bundle to dist/
RUN npm run build

# ----------------- Stage 2: Runtime -----------------
FROM nginx:1.25-alpine AS production

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled frontend from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
