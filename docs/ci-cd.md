# 🔄 TaskFlow CI/CD Pipeline Documentation

A detailed explanation of the Continuous Integration and Continuous Deployment (CI/CD) pipelines implemented with **GitHub Actions**.

---

## 1. What is CI/CD?

### Continuous Integration (CI)
CI is an engineering practice where developers regularly merge their code into a central repository. Automated builds and automated tests are run on every commit to catch bugs early, prevent integration drift, and ensure the master branch is always healthy.

### Continuous Deployment (CD)
CD is the automated process that takes tested code from the repository, builds production container images, pushes them to a container registry, and deploys them directly to live cloud infrastructure (such as AWS EC2 / Kubernetes) with zero manual intervention.

---

## 2. Pipeline Workflows Overview

```
                      +-----------------------------+
                      |   Developer Git Commit/Push |
                      +-----------------------------+
                                     │
                                     ▼
                +─────────────────────────────────────────+
                |        GitHub Actions CI (ci.yml)       |
                |  ├── 1. Checkout repository             |
                |  ├── 2. Install & Cache Dependencies    |
                |  ├── 3. Run Jest Backend Tests (12/12)  |
                |  ├── 4. Build Vite React Frontend       |
                |  └── 5. Validate Dockerfile Syntax      |
                +─────────────────────────────────────────+
                                     │
                              Passed Successfully
                                     ▼
                +─────────────────────────────────────────+
                |        GitHub Actions CD (cd.yml)       |
                |  ├── 1. Login to Docker Hub Registry    |
                |  ├── 2. Build Multi-stage Images        |
                |  ├── 3. Push :latest and :SHA Tags      |
                |  └── 4. SSH into AWS EC2 Instance       |
                |        └──> kubectl rollout restart     |
                +─────────────────────────────────────────+
                                     │
                                     ▼
                      +-----------------------------+
                      | Live Application on AWS EC2 |
                      |    (Zero Downtime Update)   |
                      +-----------------------------+
```

---

## 3. GitHub Secrets Configuration

To enable the CD pipeline to push images to Docker Hub and SSH into your AWS EC2 instance, you must configure the following repository secrets:

### How to Add Secrets to GitHub:
1. Navigate to your GitHub repository: `https://github.com/aMiT-sInGh-8268/Se_project`.
2. Click **Settings** (tab at the top right).
3. In the left sidebar, click **Secrets and variables** → **Actions**.
4. Click the green button **"New repository secret"**.

### Required Secrets Table:

| Secret Name | Value Example | Description |
| :--- | :--- | :--- |
| `DOCKERHUB_USERNAME` | `amit8268` | Your Docker Hub account username |
| `DOCKERHUB_TOKEN` | `dckr_pat_xxx...` | Docker Hub Personal Access Token (Read & Write permissions) |
| `EC2_HOST` | `54.210.12.34` | The Public IPv4 address of your AWS EC2 instance |
| `EC2_USERNAME` | `ubuntu` | Default SSH username for Ubuntu AMI |
| `EC2_SSH_KEY` | `-----BEGIN RSA PRIVATE KEY-----...` | Full content of your `taskflow-key.pem` private key file |

---

## 4. Live College Demonstration Script (Step-by-Step)

During your viva or project presentation, follow these exact steps to demonstrate the CI/CD pipeline:

1. **Show Initial State**:
   - Open the live application in the browser at `http://<EC2-PUBLIC-IP>:30080`.
   - Point out the title *"TaskFlow – Cloud-Based Task Management System"*.
2. **Make a Code Change**:
   - In `frontend/src/components/Navbar.jsx`, change a small UI element (e.g., add *" v2.0 - Live Demo"* to the subtitle).
3. **Commit & Push**:
   ```bash
   git add .
   git commit -m "feat(ui): update subtitle for viva demo"
   git push origin main
   ```
4. **Show GitHub Actions in Real Time**:
   - Open GitHub → **Actions** tab.
   - Show the professor the **CI** workflow executing tests and building assets.
   - Show the **CD** workflow building the Docker image and pushing to Docker Hub.
5. **Show Live Kubernetes Update**:
   - Refresh the browser tab on AWS EC2.
   - Show that the new subtitle *"v2.0 - Live Demo"* is now active with zero downtime!
   - Explain how Kubernetes rolling updates updated the pods in the background.
