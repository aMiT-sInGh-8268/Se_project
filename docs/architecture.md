# 🏗️ TaskFlow Architecture Documentation

This document explains the system architecture, application design, and DevOps deployment pipeline of **TaskFlow – Cloud-Based Task Management System**.

---

## 1. High-Level System Architecture

TaskFlow follows a cloud-native 3-tier microservices architecture consisting of a presentation layer (Frontend), application logic layer (Backend API), and persistence layer (Database).

```
+-------------------------------------------------------------------------+
|                               USER BROWSER                              |
+-------------------------------------------------------------------------+
                                     │
                        HTTP Request │ Port 80 / 30080
                                     ▼
+-------------------------------------------------------------------------+
|                      FRONTEND TIER (React + Nginx)                      |
|  - Single Page Application (SPA) compiled with Vite                     |
|  - Served statically via high-performance Nginx Alpine                  |
|  - Reverse-proxies /api/ requests to the backend service                |
+-------------------------------------------------------------------------+
                                     │
                        REST API     │ Port 5000 (Internal ClusterIP)
                                     ▼
+-------------------------------------------------------------------------+
|                    BACKEND TIER (Node.js + Express)                     |
|  - RESTful API handling business logic and CRUD operations              |
|  - Health-check endpoint: GET /api/health                               |
|  - Graceful shutdown listeners for Kubernetes SIGTERM                   |
+-------------------------------------------------------------------------+
                                     │
                        Mongoose ODM │ Port 27017 (Internal ClusterIP)
                                     ▼
+-------------------------------------------------------------------------+
|                         DATABASE TIER (MongoDB)                         |
|  - Document-oriented NoSQL database                                     |
|  - PersistentVolumeClaim (PVC) ensures data survival across pod restarts|
+-------------------------------------------------------------------------+
```

---

## 2. End-to-End DevOps & Cloud Deployment Flow

The lifecycle of code from local development to production on AWS EC2 is completely automated via CI/CD.

```
 Developer Laptop
        │  git push origin main
        ▼
 GitHub Repository (aMiT-sInGh-8268/Se_project)
        │  triggers webhook
        ▼
 GitHub Actions (CI Pipeline)
  ├── 1. Checkout Code
  ├── 2. Run Backend Tests (Jest / Supertest)
  ├── 3. Build React Frontend (Vite)
  └── 4. Docker Build Dry-run
        │  on success
        ▼
 GitHub Actions (CD Pipeline)
  ├── 1. Build Multi-stage Docker Images
  ├── 2. Authenticate to Docker Hub / Container Registry
  ├── 3. Push Images with Tags (:latest & :sha)
  └── 4. SSH into AWS EC2 Instance
        │
        ▼
 AWS EC2 (Ubuntu 22.04 LTS)
  ├── Kubernetes / K3s Cluster
  │    ├── Apply k8s/namespace.yaml
  │    ├── Apply k8s/configmap.yaml
  │    ├── Apply k8s/mongodb-pvc.yaml
  │    ├── Rollout restart backend-deployment
  │    └── Rollout restart frontend-deployment
  │
  └── Public Access: http://<EC2-PUBLIC-IP>:30080
```

---

## 3. Component Details & Port Allocations

| Component | Technology | Internal Port | External NodePort / Compose Port | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | React 18 + Nginx Alpine | `80` | `3000` (Docker) / `30080` (K8s) | Serves interactive UI, dashboard, and task management |
| **Backend** | Node.js 20 + Express | `5000` | `5000` (Docker) / ClusterIP (K8s) | REST API endpoints, input validation, DB controller |
| **Database** | MongoDB 7.0 | `27017` | `27017` (Docker) / ClusterIP (K8s) | Persistent document storage for tasks |

---

## 4. Kubernetes Service Discovery & Networking

1. **Internal DNS**:
   - The backend reaches MongoDB using Kubernetes DNS: `mongodb://mongodb-service:27017/taskflow`.
   - The frontend Nginx reverse proxy forwards `/api/*` requests internally to `http://backend-service:5000/api/`.
2. **Isolation & Security**:
   - MongoDB and Backend services use `ClusterIP`, meaning they are **not directly exposed to the public internet**.
   - Only the frontend is exposed via `NodePort: 30080` (or Ingress/LoadBalancer), enforcing least privilege access.
3. **High Availability**:
   - Both Frontend and Backend Deployments maintain `replicas: 2` with rolling update zero-downtime deployments.
