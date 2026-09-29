# 🚀 TaskFlow – Cloud-Based Task Management System

[![Build Status](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?logo=githubactions)](.github/workflows/ci.yml)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](docs/docker.md)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-326CE5?logo=kubernetes&logoColor=white)](docs/kubernetes.md)
[![AWS](https://img.shields.io/badge/AWS-EC2%20Cloud-FF9900?logo=amazon-aws&logoColor=white)](docs/aws-deployment.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **College Software Engineering & Agile (SEA) Capstone Project**  
> Demonstrating end-to-end practical DevOps implementation: **GitHub &bull; Docker &bull; Kubernetes &bull; CI/CD Pipelines &bull; AWS EC2 Cloud Deployment**.

---

## 📌 Table of Contents
- [1. Project Overview](#1-project-overview)
- [2. Problem Statement & Objectives](#2-problem-statement--objectives)
- [3. Application Features](#3-application-features)
- [4. Technology Stack](#4-technology-stack)
- [5. System Architecture](#5-system-architecture)
- [6. Repository Structure](#6-repository-structure)
- [7. Quickstart: Local Setup](#7-quickstart-local-setup)
- [8. Docker & Docker Compose Setup](#8-docker--docker-compose-setup)
- [9. Kubernetes Deployment Guide](#9-kubernetes-deployment-guide)
- [10. AWS EC2 Cloud Deployment](#10-aws-ec2-cloud-deployment)
- [11. CI/CD Pipeline (GitHub Actions)](#11-cicd-pipeline-github-actions)
- [12. Environment Variables](#12-environment-variables)
- [13. Application Screenshots](#13-application-screenshots)
- [14. Viva Examination Preparation](#14-viva-examination-preparation)
- [15. Future Scope & Team](#15-future-scope--team)

---

## 1. Project Overview

**TaskFlow** is a modern, lightweight, full-stack task management application engineered specifically to demonstrate enterprise-grade **DevOps methodologies** and cloud-native architecture. 

Rather than building an overly convoluted monolithic codebase, TaskFlow emphasizes **clean code**, **microservice decoupling**, **containerization**, **declarative orchestration**, and **automated continuous delivery**.

---

## 2. Problem Statement & Objectives

### Problem Statement
In traditional software development, applications frequently suffer from:
- **"Works on My Machine" Syndrome**: Divergent local development environments leading to runtime failures in production.
- **Manual, Error-Prone Deployments**: Deploying code by manually FTPing files or executing terminal scripts without automated quality gates.
- **Single Point of Failure**: Lack of automatic self-healing, rolling updates, and container health probing.

### Objectives
1. **Containerization**: Package frontend, backend, and database into standalone, lightweight Docker containers.
2. **Orchestration**: Manage multi-container scaling, internal DNS service discovery, and rolling zero-downtime updates using **Kubernetes**.
3. **Automated CI/CD**: Implement automated quality gates (testing, building, container packaging, and cloud rollout) triggered on every Git push via **GitHub Actions**.
4. **Cloud Deployment**: Host the live containerized cluster on an **AWS EC2** Ubuntu instance accessible via public IP.
5. **Agile Observability**: Provide live system health monitoring via a dedicated `/api/health` diagnostic endpoint.

---

## 3. Application Features

### User Capabilities:
- ➕ **Add Tasks**: Create tasks with titles, descriptions, priorities (*Low, Medium, High*), and status (*Pending, In Progress, Completed*).
- 📋 **View & Filter Tasks**: Interactive task dashboard with instant search and status-based tabs (*All, Pending, In Progress, Completed*).
- ✏️ **Edit In-Place**: Update task details, priority, or status directly from the UI.
- ✅ **Toggle Completion**: One-click checkbox to mark tasks completed with strikethrough styling.
- 🗑️ **Delete Tasks**: Remove tasks with safety confirmation modals.
- 📊 **Real-Time Statistics**: Live counter showing Total Tasks, Pending, In Progress, Completed, and percentage progress bar.
- 🩺 **DevOps System Status**: Built-in ping monitor showing live backend service latency, server uptime, and MongoDB connectivity.

### Backend REST API Endpoints:
| Method | Endpoint | Description | Sample Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health-check endpoint for K8s probes | `{"status":"OK","service":"TaskFlow Backend","database":{"status":"Connected"}}` |
| `GET` | `/api/tasks` | List all tasks (supports `?status=completed`) | `{"success":true,"count":2,"data":[...]}` |
| `GET` | `/api/tasks/:id` | Fetch specific task by MongoDB ID | `{"success":true,"data":{...}}` |
| `POST` | `/api/tasks` | Create a new task | `{"success":true,"message":"Task created successfully","data":{...}}` |
| `PUT` | `/api/tasks/:id` | Update task details or status | `{"success":true,"message":"Task updated successfully","data":{...}}` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | `{"success":true,"message":"Task deleted successfully"}` |

---

## 4. Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS Design System, HTML5, JavaScript (ES6+).
- **Web Server / Reverse Proxy**: Nginx 1.25 Alpine (multi-stage Docker build).
- **Backend**: Node.js 20, Express.js REST Framework.
- **Database & ODM**: MongoDB 7.0 Community Edition, Mongoose 8.
- **Unit & Integration Testing**: Jest 29, Supertest 7 (12/12 passing test suite).
- **Containerization**: Docker, Docker Compose v2.
- **Container Orchestration**: Kubernetes (K8s) / K3s.
- **CI/CD Automation**: GitHub Actions.
- **Cloud Infrastructure**: Amazon Web Services (AWS EC2 Ubuntu 22.04 LTS).

---

## 5. System Architecture

```text
                                [ CLIENT BROWSER ]
                                        │
                         HTTP Requests  │ Port 80 / 30080
                                        ▼
    +─────────────────────────────────────────────────────────────────────────+
    |                         KUBERNETES / DOCKER HOST                        |
    |                                                                         |
    |  [ FRONTEND POD / CONTAINER ]                                           |
    |   └── React SPA served by Nginx Alpine                                  |
    |   └── Reverse-proxies /api/ requests internally                         |
    |                                                                         |
    |                                   │                                     |
    |                      Internal DNS │ Port 5000                           |
    |                                   ▼                                     |
    |                                                                         |
    |  [ BACKEND POD / CONTAINER ]                                            |
    |   └── Express REST API Service (backend-service:5000)                   |
    |   └── Health Checks (/api/health) & Business Logic                      |
    |                                                                         |
    |                                   │                                     |
    |                      Mongoose ODM │ Port 27017                          |
    |                                   ▼                                     |
    |                                                                         |
    |  [ DATABASE POD / CONTAINER ]                                           |
    |   └── MongoDB 7.0 Service (mongodb-service:27017)                       |
    |   └── Storage: PersistentVolumeClaim (pvc-storage: 1Gi)                 |
    +─────────────────────────────────────────────────────────────────────────+
```

*For complete architectural deep dive and network data flows, see [docs/architecture.md](docs/architecture.md).*

---

## 6. Repository Structure

```text
Se_project/
├── frontend/                     # React Single Page Application
│   ├── src/                      # Components, state, styles, and API service
│   ├── public/                   # Static favicon and assets
│   ├── nginx.conf                # Nginx SPA routing and reverse proxy
│   ├── vite.config.js            # Vite bundler configuration
│   ├── Dockerfile                # Multi-stage production build (Node -> Nginx)
│   ├── .dockerignore             # Docker build context exclusions
│   └── package.json              # Frontend dependencies and scripts
│
├── backend/                      # Node.js + Express REST API
│   ├── src/                      # Controllers, models, routes, and server
│   ├── tests/                    # Automated Jest & Supertest test suite
│   ├── Dockerfile                # Production Alpine Dockerfile with health checks
│   ├── .dockerignore             # Docker build context exclusions
│   └── package.json              # Backend dependencies and test scripts
│
├── k8s/                          # Kubernetes Manifests
│   ├── namespace.yaml            # taskflow namespace isolation
│   ├── configmap.yaml            # Centralized environment parameters
│   ├── mongodb-pvc.yaml          # 1Gi persistent volume claim
│   ├── mongodb-deployment.yaml   # MongoDB pod deployment
│   ├── mongodb-service.yaml      # Internal ClusterIP service
│   ├── backend-deployment.yaml   # Express API deployment (2 replicas)
│   ├── backend-service.yaml      # Internal ClusterIP service
│   ├── frontend-deployment.yaml  # React Nginx deployment (2 replicas)
│   └── frontend-service.yaml     # NodePort service (Port 30080)
│
├── .github/                      # CI/CD Pipelines
│   └── workflows/
│       ├── ci.yml                # Automated testing, linting, and build verification
│       └── cd.yml                # Docker image publishing and AWS deployment
│
├── docs/                         # Detailed Academic & Technical Documentation
│   ├── architecture.md           # Architecture diagrams and system design
│   ├── docker.md                 # Docker guide, Dockerfile walkthrough, commands
│   ├── kubernetes.md             # K8s components, manifests, and kubectl cheatsheet
│   ├── aws-deployment.md         # AWS EC2 zero-to-hero deployment guide
│   ├── ci-cd.md                  # CI/CD explanation, secrets, demonstration script
│   └── viva-questions.md         # 55+ detailed viva examination questions & answers
│
├── docker-compose.yml            # Multi-container local orchestration
├── .env.example                  # Environment variables template
├── .gitignore                    # Git exclusions
├── LICENSE                       # MIT License
├── auto-push.ps1                 # Continuous file watcher & auto-push script
├── auto-push.bat                 # One-click Windows batch launcher
└── README.md                     # Main documentation showcase
```

---

## 7. Quickstart: Local Setup

### Prerequisites
- [Node.js (v20+)](https://nodejs.org/) installed
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port 27017

### 1. Run Backend
```bash
cd backend
npm install
npm test          # Verify 12/12 automated unit tests pass
npm start         # Server starts on http://localhost:5000
```

### 2. Run Frontend
```bash
# In a new terminal:
cd frontend
npm install
npm run dev       # Starts Vite dev server on http://localhost:3000
```
Open your browser at `http://localhost:3000` to interact with the application.

---

## 8. Docker & Docker Compose Setup

Run the entire microservices stack (Frontend, Backend, MongoDB) with a single command without installing any local databases:

```bash
docker compose up --build
```

Add `-d` to run in background:
```bash
docker compose up --build -d
```

### Access URLs:
- **Frontend Dashboard**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api/tasks`
- **Backend Health Check**: `http://localhost:5000/api/health`

### Stop Services:
```bash
docker compose down
```

*For complete Docker documentation and commands, see [docs/docker.md](docs/docker.md).*

---

## 9. Kubernetes Deployment Guide

Deploy the multi-tier application into any Kubernetes cluster (Minikube, K3s, Kind, or AWS EKS/EC2):

### 1. Apply Manifests
```bash
kubectl apply -f k8s/
```

### 2. Verify Pods and Services
```bash
kubectl get pods -n taskflow
kubectl get services -n taskflow
```

### 3. Access Frontend
- On AWS EC2 or bare-metal: `http://<NODE-IP>:30080`
- On Minikube: `minikube service frontend-service -n taskflow`

*For complete Kubernetes documentation, see [docs/kubernetes.md](docs/kubernetes.md).*

---

## 10. AWS EC2 Cloud Deployment

TaskFlow can be deployed to an **AWS EC2 Ubuntu 22.04 LTS instance**:
1. Launch an EC2 instance (`t2.micro` or `t2.small`).
2. Open ports `22` (SSH), `80` (HTTP), `3000`, `5000`, and `30080` in the Security Group.
3. SSH into the instance and install Docker + K3s:
   ```bash
   curl -sfL https://get.k3s.io | sh -
   ```
4. Clone and deploy:
   ```bash
   git clone https://github.com/aMiT-sInGh-8268/Se_project.git taskflow
   cd taskflow
   kubectl apply -f k8s/
   ```
5. Open `http://<EC2-PUBLIC-IP>:30080` in your web browser.

*Step-by-step screenshots, SSH commands, and cost-prevention cleanup steps are documented in [docs/aws-deployment.md](docs/aws-deployment.md).*

---

## 11. CI/CD Pipeline (GitHub Actions)

### 1. Continuous Integration (`ci.yml`)
Runs automatically on every `push` and `pull_request` to `main`:
- Checks out repository code.
- Installs Node.js dependencies.
- Runs backend test suite (12/12 Jest/Supertest tests).
- Compiles the React production bundle with Vite.
- Validates Dockerfile build syntax.

### 2. Continuous Deployment (`cd.yml`)
Triggered on push to `main`:
- Builds production Docker images for frontend and backend.
- Logs into Docker Hub using encrypted repository secrets.
- Pushes images tagged with `:latest` and Git commit SHA.
- SSHs into AWS EC2 and triggers rolling pod updates (`kubectl rollout restart`).

*For required GitHub Secrets setup, see [docs/ci-cd.md](docs/ci-cd.md).*

---

## 12. Environment Variables

Copy `.env.example` to `.env` to configure your parameters:

```env
# Backend
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskflow
CORS_ORIGIN=*

# Frontend
VITE_API_URL=http://localhost:5000/api
```

---

## 13. Application Screenshots

### Dashboard & Task Overview
```text
+-----------------------------------------------------------------------------------------+
| [T] TaskFlow - Cloud-Based Task Management System   [Docker] [Kubernetes] [AWS] [Online]|
+-----------------------------------------------------------------------------------------+
| [Total: 4]          [Pending: 2]          [In Progress: 1]          [Completed: 1 (25%)]|
+-------------------------------------+---------------------------------------------------+
| ➕ Add New Task                     | 📋 Your Tasks (4)       [Search...] [All|Pending] |
| ----------------------------------- | ------------------------------------------------- |
| Task Title:                         | [x] Deploy to AWS EC2                     [High]  |
| [ Configure Kubernetes Ingress    ] |     Application containerized and running         |
| Description:                        | ------------------------------------------------- |
| [ Set up NodePort and test health ] | [ ] Implement Redis Caching               [Medium]|
| Priority: [Medium ▼] Status: [Pend] |     Optimize database read latency                |
| [ Add Task Button                 ] |                                                   |
+-------------------------------------+---------------------------------------------------+
| 🩺 System Health: API [Online]  MongoDB [Connected]  Uptime [124.5s]  Latency [<10ms]   |
+-----------------------------------------------------------------------------------------+
```

---

## 14. Viva Examination Preparation

Need to prepare for your viva defense or presentation?  
Read **[docs/viva-questions.md](docs/viva-questions.md)** for **55+ detailed questions & simple answers** covering:
- Git & GitHub branching
- Docker, Dockerfiles, and multi-stage builds
- Kubernetes Pods, Deployments, Services, and PVCs
- GitHub Actions CI/CD workflows and secrets
- AWS EC2, Security Groups, and Cloud cost prevention
- Microservices, CORS, and REST architecture

---

## 15. Future Scope & Team

### Future Enhancements:
- 🔐 User authentication using JWT and OAuth2 (Google / GitHub login).
- 📈 Prometheus & Grafana dashboard for live pod CPU/Memory metrics.
- ⚡ Redis caching layer for sub-millisecond task retrieval.
- 🌐 AWS EKS multi-node cluster deployment with Helm charts.

### Contributors:
- **Amit Singh** ([@aMiT-sInGh-8268](https://github.com/aMiT-sInGh-8268)) – *Lead DevOps & Full-Stack Engineer*
- College: Software Engineering and Agile (SEA) Capstone Project 2026.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
