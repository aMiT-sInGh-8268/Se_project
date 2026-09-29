# 🐳 TaskFlow Docker Documentation

A comprehensive beginner's guide to containerizing TaskFlow with Docker and Docker Compose.

---

## 1. Core Concepts Explained Simply

### What is Docker?
Docker is an open-source platform that packages an application and all its dependencies (runtime, system tools, libraries) into a standardized unit called a **container**. It solves the classic software problem: *"It works on my machine, but not on the server!"*

### What is a Docker Image?
An **image** is a lightweight, standalone, read-only template that contains the application code, runtime libraries, and environment settings. Think of an image as a **blueprint** or a class in OOP.

### What is a Docker Container?
A **container** is a runnable, isolated instance of an image. If an image is a blueprint, a container is the actual **house built from that blueprint**. Containers share the host OS kernel but run in isolated processes.

### What is Docker Compose?
Docker Compose is a tool for defining and running multi-container Docker applications. Using a single YAML file (`docker-compose.yml`), you configure all services (Frontend, Backend, Database) and launch them together with a single command.

### Why Do We Use Docker in TaskFlow?
1. **Consistency**: The application runs identically on Windows laptops, MacBooks, Ubuntu servers, and AWS EC2.
2. **Simplified Setup**: No need to manually install Node.js, npm, Nginx, or MongoDB on the host machine.
3. **Isolation**: MongoDB data and dependencies do not conflict with anything on the host.
4. **Production Readiness**: The exact same Docker images tested locally are deployed to Kubernetes and AWS.

---

## 2. Dockerfile Breakdown

### A. Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1
CMD ["node", "src/server.js"]
```
- **Alpine Linux base**: Keeps image size under 150MB compared to standard 1GB images.
- **Layer caching**: Copies `package.json` first; changes in source code won't trigger re-installation of dependencies.
- **Security**: Runs as unprivileged user `node` instead of `root`.
- **Healthcheck**: Regularly verifies `/api/health`.

### B. Frontend Multi-Stage Dockerfile (`frontend/Dockerfile`)
```dockerfile
# Stage 1: Build React assets using Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve static files with Nginx Alpine
FROM nginx:1.25-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
- **Multi-Stage Benefit**: Node.js and source files are only used to build the bundle and are **discarded** in Stage 2. The final image only contains Nginx and static JS/CSS, resulting in a tiny, secure ~25MB image!

---

## 3. How to Run with Docker Compose

### Step 1: Start All Services
```bash
docker compose up --build
```
*Add `-d` to run in background (detached mode):*
```bash
docker compose up --build -d
```

### Expected Output:
```text
[+] Running 4/4
 ✔ Network se_project_taskflow-network  Created
 ✔ Container taskflow-mongodb           Healthy
 ✔ Container taskflow-backend           Healthy
 ✔ Container taskflow-frontend          Started
```

### Step 2: Access the Application
- **Frontend Dashboard**: Open `http://localhost:3000`
- **Backend API**: Open `http://localhost:5000/api/tasks`
- **Backend Health Check**: Open `http://localhost:5000/api/health`

### Step 3: Useful Docker Commands

| Action | Command | Expected Output / Purpose |
| :--- | :--- | :--- |
| **List Running Containers** | `docker ps` | Shows status, port mappings, and health of containers |
| **View Real-Time Logs** | `docker compose logs -f` | Streams console logs from all 3 services |
| **View Backend Logs** | `docker compose logs -f backend` | Streams only backend Express logs |
| **Stop All Containers** | `docker compose down` | Stops and removes containers and networks |
| **Stop & Clear Volumes** | `docker compose down -v` | Deletes persistent MongoDB volume |
| **Inspect Image Sizes** | `docker images` | Lists local Docker images and their byte sizes |
| **Execute Shell in Container** | `docker exec -it taskflow-backend sh` | Opens interactive terminal inside container |
