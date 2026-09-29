# ☸️ TaskFlow Kubernetes Documentation

A beginner-friendly guide to container orchestration using Kubernetes (K8s).

---

## 1. Core Kubernetes Concepts Explained

### What is Kubernetes?
Kubernetes (often abbreviated as **K8s**) is an open-source container orchestration system that automates the deployment, scaling, healing, and management of containerized applications.

### Key Objects in TaskFlow:
1. **Pod**:
   - The smallest deployable computing unit in Kubernetes.
   - A Pod encapsulates one or more tightly coupled containers sharing network and storage.
2. **Deployment**:
   - Manages the declared state of Pods.
   - Automatically maintains the desired number of replicas, handles rolling updates without downtime, and restarts failed pods.
3. **Service**:
   - An abstraction that provides a stable IP and DNS name to access a dynamic group of Pods.
   - Types:
     - **ClusterIP** (Default): Internal only (e.g., `mongodb-service`, `backend-service`).
     - **NodePort**: Exposes the service on a static port on each node's IP (e.g., `frontend-service` on port `30080`).
     - **LoadBalancer**: Provisions a cloud provider's external load balancer (e.g., AWS ALB/ELB).
4. **ConfigMap**:
   - Stores non-confidential configuration (like ports, URLs, environment names) as key-value pairs, decoupling configuration from container images.
5. **PersistentVolumeClaim (PVC)**:
   - Requests persistent disk storage for stateful applications like MongoDB so data is preserved even when pods are rescheduled or restarted.

---

## 2. Kubernetes Architecture in TaskFlow

```
+--------------------------------------------------------------------------+
|                        KUBERNETES CLUSTER (Node)                         |
|                                                                          |
|  Namespace: taskflow                                                     |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  | Frontend Service (NodePort: 30080)                                 |  |
|  |  └──> Pod: frontend-deployment (Replica 1) [Port 80]               |  |
|  |  └──> Pod: frontend-deployment (Replica 2) [Port 80]               |  |
|  +--------------------------------------------------------------------+  |
|                                │                                         |
|                                ▼ (Internal DNS)                          |
|  +--------------------------------------------------------------------+  |
|  | Backend Service (ClusterIP: backend-service:5000)                  |  |
|  |  └──> Pod: backend-deployment (Replica 1) [Port 5000]              |  |
|  |  └──> Pod: backend-deployment (Replica 2) [Port 5000]              |  |
|  +--------------------------------------------------------------------+  |
|                                │                                         |
|                                ▼ (Internal DNS)                          |
|  +--------------------------------------------------------------------+  |
|  | MongoDB Service (ClusterIP: mongodb-service:27017)                 |  |
|  |  └──> Pod: mongodb-deployment (Replica 1) [Port 27017]             |  |
|  |        └──> Volume Mount: /data/db <─── mongodb-pvc (1Gi)          |  |
|  +--------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+
```

---

## 3. Deployment Commands

### Step 1: Deploy All Manifests
To deploy the complete application into the `taskflow` namespace:
```bash
kubectl apply -f k8s/
```

### Expected Output:
```text
namespace/taskflow created
configmap/taskflow-config created
persistentvolumeclaim/mongodb-pvc created
deployment.apps/mongodb-deployment created
service/mongodb-service created
deployment.apps/backend-deployment created
service/backend-service created
deployment.apps/frontend-deployment created
service/frontend-service created
```

---

## 4. Essential Kubectl Commands for Viva Demonstration

### 1. View Running Pods
```bash
kubectl get pods -n taskflow
```
**Expected Output:**
```text
NAME                                  READY   STATUS    RESTARTS   AGE
backend-deployment-7f89d8b74f-9x2bc   1/1     Running   0          45s
backend-deployment-7f89d8b74f-k1m9p   1/1     Running   0          45s
frontend-deployment-55d644d67-4wz2t   1/1     Running   0          45s
frontend-deployment-55d644d67-8l8qj   1/1     Running   0          45s
mongodb-deployment-64b596d67b-j7p2w   1/1     Running   0          45s
```

### 2. View Services & Exposed Ports
```bash
kubectl get services -n taskflow
```
**Expected Output:**
```text
NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
backend-service    ClusterIP   10.104.210.14    <none>        5000/TCP       1m
frontend-service   NodePort    10.106.180.50    <none>        80:30080/TCP   1m
mongodb-service    ClusterIP   10.108.95.23     <none>        27017/TCP      1m
```

### 3. View Deployments and Replica Status
```bash
kubectl get deployments -n taskflow
```

### 4. Check Real-Time Logs of a Pod
```bash
# View backend logs:
kubectl logs -f deployment/backend-deployment -n taskflow

# View frontend Nginx access logs:
kubectl logs -f deployment/frontend-deployment -n taskflow
```

### 5. Inspect Pod Details and Health Events
```bash
kubectl describe pod <pod-name> -n taskflow
```
*Shows lifecycle events, container startup, and liveness/readiness probe health.*

### 6. Delete or Cleanup the Deployment
```bash
kubectl delete -f k8s/
```
