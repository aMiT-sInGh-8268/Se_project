# ☁️ TaskFlow AWS EC2 Deployment Guide

A step-by-step, zero-to-hero deployment guide for college students. This guide uses **AWS EC2 (Elastic Compute Cloud)** with lightweight Kubernetes (**K3s**) to give you a robust, 100% free-tier eligible cloud demonstration.

---

## 1. Prerequisites
- An active AWS account ([Sign up free tier here](https://aws.amazon.com/free/)).
- SSH client (Terminal on Mac/Linux or PowerShell/PuTTY on Windows).

---

## 2. Step 1: Launch an AWS EC2 Instance

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/).
2. In the top search bar, type **EC2** and click the EC2 service.
3. Click the orange **"Launch Instance"** button.
4. Configure the instance settings:
   - **Name**: `TaskFlow-DevOps-Server`
   - **Application and OS Image**: Select **Ubuntu Server 22.04 LTS (HVM)**, SSD Volume Type (Free tier eligible).
   - **Architecture**: `64-bit (x86)`.
   - **Instance Type**: Select `t2.micro` (1 vCPU, 1 GB RAM - Free tier) or `t2.small` / `t3.small` (recommended for smooth Kubernetes memory headroom).
   - **Key pair (login)**:
     - Click **Create new key pair**.
     - Name it: `taskflow-key`.
     - Key pair type: `RSA`.
     - Private key format: `.pem` (OpenSSH).
     - Click **Create key pair** (this will download `taskflow-key.pem` to your Downloads folder).

---

## 3. Step 2: Configure Security Group (Firewall)

Under **Network Settings**, configure the following inbound rules:

| Type | Protocol | Port Range | Source | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **SSH** | TCP | `22` | `0.0.0.0/0` (or My IP) | Remote terminal access |
| **Custom TCP** | TCP | `3000` | `0.0.0.0/0` | Docker Compose Frontend |
| **Custom TCP** | TCP | `5000` | `0.0.0.0/0` | Backend REST API |
| **Custom TCP** | TCP | `30080` | `0.0.0.0/0` | Kubernetes NodePort Frontend |
| **HTTP** | TCP | `80` | `0.0.0.0/0` | Standard Web Traffic |

Click **"Launch Instance"**. Wait 1–2 minutes until the Instance State changes to **Running**. Note down your **Public IPv4 address** (e.g., `54.210.12.34`).

---

## 4. Step 3: Connect to EC2 via SSH

Open your terminal (PowerShell or Terminal), navigate to where you saved `taskflow-key.pem`:

```bash
# On Linux/macOS, restrict permissions on private key:
chmod 400 taskflow-key.pem

# Connect to EC2 (replace with your instance's Public IP):
ssh -i "taskflow-key.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```

---

## 5. Step 4: Install Docker & Docker Compose on Ubuntu

Once inside the EC2 Ubuntu prompt (`ubuntu@ip-...:`):

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
sudo apt install -y docker.io docker-compose

# 3. Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# 4. Add current ubuntu user to docker group
sudo usermod -aG docker $USER

# 5. Reload group membership
newgrp docker

# 6. Verify Docker installation
docker --version
docker compose version
```

---

## 6. Step 5: Install Lightweight Kubernetes (K3s) & Kubectl

K3s is a certified, production-grade lightweight Kubernetes distribution that uses less than 512MB RAM, making it perfect for single-node AWS EC2 servers:

```bash
# 1. Install K3s (single command)
curl -sfL https://get.k3s.io | sh -

# 2. Grant ubuntu user permission to use kubectl without sudo
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config

# 3. Verify Kubernetes Node is Ready
kubectl get nodes
```
**Expected Output:**
```text
NAME               STATUS   ROLES                  AGE   VERSION
ip-172-31-40-128   Ready    control-plane,master   15s   v1.28.2+k3s1
```

---

## 7. Step 6: Clone and Deploy TaskFlow on AWS

```bash
# 1. Clone your GitHub repository
git clone https://github.com/aMiT-sInGh-8268/Se_project.git taskflow

# 2. Enter repository
cd taskflow

# 3. Deploy application to Kubernetes
kubectl apply -f k8s/

# 4. Watch pods spin up
kubectl get pods -n taskflow -w
```

---

## 8. Step 7: Verify Application in Web Browser

1. Copy your **EC2 Public IPv4** from AWS Console.
2. In your web browser, navigate to:
   ```text
   http://<YOUR-EC2-PUBLIC-IP>:30080
   ```
3. Test the application:
   - Create a new task (e.g., *"Deployed on AWS EC2"*).
   - Check that the **Backend Online** green badge is active.
   - Verify health check endpoint:
     `http://<YOUR-EC2-PUBLIC-IP>:5000/api/health`

---

## 9. Step 8: Clean Up Resources (Prevent AWS Charges!)

> [!CAUTION]
> Always stop or terminate your EC2 instance after your college presentation to avoid unexpected AWS charges!

1. Open **AWS EC2 Console**.
2. Click **Instances**.
3. Select `TaskFlow-DevOps-Server`.
4. Click **Instance state**:
   - **Stop instance**: Pauses the server (saves RAM/compute charges; storage charges still apply).
   - **Terminate instance**: Permanently deletes the server and stops all billing completely.
