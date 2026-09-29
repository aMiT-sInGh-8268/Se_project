# 🎓 TaskFlow – 50+ DevOps & Cloud Viva Questions & Answers

A comprehensive collection of 55 viva questions and articulate, student-friendly answers for college examinations.

---

## Category 1: Git & GitHub

### Q1: What is Git and how is it different from GitHub?
**Answer**: Git is a distributed Version Control System (VCS) installed locally on a computer to track code changes, branches, and commit history. GitHub is a cloud-based hosting platform for Git repositories that provides collaboration tools, pull requests, issue tracking, and CI/CD pipelines.

### Q2: What is a commit in Git?
**Answer**: A commit is a snapshot of the staged changes in your repository at a specific point in time, accompanied by a unique SHA hash, author metadata, and a descriptive message.

### Q3: What is the difference between `git pull` and `git fetch`?
**Answer**: `git fetch` downloads commits, refs, and branches from the remote repository without merging them into your local branch. `git pull` performs a `git fetch` immediately followed by a `git merge`.

### Q4: What is the purpose of the `.gitignore` file?
**Answer**: `.gitignore` tells Git which files or directories to ignore and never track, such as `node_modules/`, `.env` sensitive files, build artifacts, and OS metadata files.

### Q5: Why should `.env` files never be committed to GitHub?
**Answer**: `.env` files contain sensitive secrets, database passwords, API tokens, and private keys. Committing them publicly exposes infrastructure to automated security bots, credential theft, and unauthorized access.

---

## Category 2: Docker & Containerization

### Q6: What is Containerization?
**Answer**: Containerization is an OS-level virtualization technique where an application and all its required dependencies, libraries, and runtime configurations are packaged together into an isolated user space called a container.

### Q7: How does a Docker Container differ from a Virtual Machine (VM)?
**Answer**: A Virtual Machine includes an entire guest operating system and requires a hypervisor, making it heavy (GBs) and slow to boot. A Docker container shares the host OS kernel and isolates processes in user space, making it lightweight (MBs), fast to start, and efficient in memory usage.

### Q8: What is a Dockerfile?
**Answer**: A Dockerfile is a text file with instructions on how to build a Docker image layer by layer (e.g., specifying base OS, copying source files, installing packages, exposing ports, and defining start commands).

### Q9: What is the difference between a Docker Image and a Docker Container?
**Answer**: A Docker Image is an immutable, read-only blueprint containing source code and dependencies. A Docker Container is a live, running instance created from that image with a thin read/write layer on top.

### Q10: What is a multi-stage Docker build, and why did you use it for the React frontend?
**Answer**: A multi-stage build uses multiple `FROM` instructions in a single Dockerfile. In our project, Stage 1 uses Node.js to compile React assets into static HTML/CSS/JS. Stage 2 copies only those compiled files into a tiny Nginx Alpine image, discarding the heavy Node.js runtime and reducing image size from 500MB to ~25MB.

### Q11: What is Docker Compose?
**Answer**: Docker Compose is a tool for defining and running multi-container Docker applications using a single YAML configuration file (`docker-compose.yml`) to orchestrate networks, volumes, and service startup orders.

### Q12: What is the difference between `EXPOSE` and publishing a port (`-p`) in Docker?
**Answer**: `EXPOSE` in a Dockerfile is documentation indicating which port the container listens on internally. Port publishing (`-p hostPort:containerPort`) maps a host network port to the container port so external users can access it.

### Q13: What is the purpose of `.dockerignore`?
**Answer**: `.dockerignore` prevents unnecessary or sensitive files (like local `node_modules` or `.env`) from being copied into the Docker build context, speeding up image creation and preventing security leaks.

### Q14: What is a Docker Volume?
**Answer**: A Docker Volume is a storage mechanism managed by Docker outside the container’s filesystem, used to persist data (such as MongoDB database records) across container restarts or deletions.

### Q15: What command is used to view logs of a running Docker container?
**Answer**: `docker logs -f <container_name>` or `docker compose logs -f <service_name>`.

---

## Category 3: Kubernetes (K8s) Architecture

### Q16: What is Kubernetes?
**Answer**: Kubernetes (K8s) is an open-source container orchestration platform designed to automate container deployment, scaling, health-monitoring, and zero-downtime rolling updates across a cluster of nodes.

### Q17: What is a Pod in Kubernetes?
**Answer**: A Pod is the smallest and simplest deployable unit in Kubernetes. It encapsulates one or more containers that share the same network IP, port space, and storage volumes.

### Q18: What is a Kubernetes Deployment?
**Answer**: A Deployment is a higher-level controller that manages the declarative state of Pods. It ensures the specified number of replicas are running, handles rolling updates, and self-heals by replacing failed pods.

### Q19: What is a ReplicaSet?
**Answer**: A ReplicaSet ensures that a specified number of identical Pod replicas are running at any given time. Deployments manage ReplicaSets automatically under the hood.

### Q20: What is a Kubernetes Service and why is it needed?
**Answer**: Pods are ephemeral; their IP addresses change whenever they restart. A Service provides a stable, persistent virtual IP address and DNS hostname (e.g., `backend-service`) that load-balances traffic across matching Pods.

### Q21: What are the main types of Kubernetes Services?
**Answer**:
1. **ClusterIP** (Default): Accessible only within the cluster.
2. **NodePort**: Exposes the service on a static high port (30000–32767) on every cluster node's IP.
3. **LoadBalancer**: Provisions a cloud provider's external load balancer (e.g., AWS ELB).
4. **ExternalName**: Maps the service to an external DNS name.

### Q22: What is a ConfigMap in Kubernetes?
**Answer**: A ConfigMap stores non-confidential configuration data as key-value pairs, allowing environment variables (like `PORT`, `NODE_ENV`, `MONGODB_URI`) to be separated from the container image.

### Q23: What is a Kubernetes Secret?
**Answer**: A Secret is an object designed to store sensitive data like passwords, API keys, or certificates in base64-encoded format, mounted into pods as environment variables or files.

### Q24: What is a PersistentVolumeClaim (PVC)?
**Answer**: A PVC is a request for storage by a user/application (specifying size and access modes like `ReadWriteOnce`). In our project, MongoDB uses a 1Gi PVC to store database documents permanently.

### Q25: What is a Kubernetes Namespace?
**Answer**: A Namespace is a virtual cluster inside a physical cluster that provides logical separation of resources, naming scopes, and access policies (e.g., our `taskflow` namespace).

### Q26: What is a Liveness Probe?
**Answer**: A health check mechanism used by the kubelet to detect whether a container is alive. If the probe fails, Kubernetes automatically kills and restarts the container.

### Q27: What is a Readiness Probe?
**Answer**: A check to determine if a container is ready to accept user network traffic. If it fails, the pod is temporarily removed from service endpoints until it becomes healthy.

### Q28: What is a Rolling Update in Kubernetes?
**Answer**: A deployment strategy that replaces old pods with new pods incrementally one by one, ensuring zero downtime for end users during application updates.

### Q29: What is the command to apply all manifests in a directory?
**Answer**: `kubectl apply -f k8s/`

### Q30: What command checks the logs of a Kubernetes deployment?
**Answer**: `kubectl logs -f deployment/<deployment-name> -n <namespace>`

---

## Category 4: CI/CD & GitHub Actions

### Q31: What is CI/CD?
**Answer**: Continuous Integration (CI) automatically builds and tests code changes on every commit. Continuous Deployment (CD) automatically releases and deploys the tested code to production environments without manual intervention.

### Q32: What is GitHub Actions?
**Answer**: GitHub Actions is a native CI/CD and automation platform built directly into GitHub that executes workflows triggered by repository events like pushes, pull requests, or schedules.

### Q33: What is a Workflow, a Job, and a Step in GitHub Actions?
**Answer**:
- **Workflow**: The top-level automated process defined in a YAML file under `.github/workflows/`.
- **Job**: A set of steps executed on a fresh virtual runner (e.g., `ubuntu-latest`).
- **Step**: An individual task inside a job, such as running a shell command or using an action from the marketplace.

### Q34: What is a Runner in GitHub Actions?
**Answer**: A virtual machine or server that runs the jobs specified in a GitHub Actions workflow. GitHub provides hosted runners (`ubuntu-latest`, `windows-latest`, `macos-latest`).

### Q35: What steps are executed in your TaskFlow CI pipeline?
**Answer**:
1. Check out code from GitHub.
2. Install Node.js and cache dependencies.
3. Execute backend automated tests using Jest/Supertest (12 passing tests).
4. Compile the React frontend using Vite.
5. Validate Dockerfile build syntax.

### Q36: What steps are executed in your TaskFlow CD pipeline?
**Answer**:
1. Check out master branch.
2. Authenticate to Docker Hub with secure credentials.
3. Build production multi-stage Docker images.
4. Tag and push images with `:latest` and `:SHA` hashes.
5. SSH into the AWS EC2 server and trigger a `kubectl rollout restart`.

### Q37: How do GitHub Secrets protect sensitive data in CI/CD?
**Answer**: GitHub Secrets encrypt credentials using Libsodium public-key cryptography. They are stored securely, masked in build console logs (`***`), and injected into workflows only as runtime environment variables.

---

## Category 5: Cloud Computing & AWS (EC2)

### Q38: What is AWS EC2?
**Answer**: Amazon Elastic Compute Cloud (EC2) is an Infrastructure as a Service (IaaS) offering that provides resizable, secure compute capacity (virtual servers) in the cloud.

### Q39: What is an AMI in AWS?
**Answer**: An Amazon Machine Image (AMI) is a pre-configured template that provides the information required to launch an EC2 instance, including the operating system (e.g., Ubuntu 22.04 LTS), storage volumes, and architecture.

### Q40: What is a Security Group in AWS?
**Answer**: A Security Group acts as a virtual firewall for your EC2 instance to control incoming (inbound) and outgoing (outbound) network traffic based on protocols, port ranges, and IP addresses.

### Q41: Which ports did you open in the AWS Security Group for TaskFlow?
**Answer**:
- Port `22` (SSH for terminal connection).
- Port `30080` (Kubernetes NodePort for the React frontend).
- Port `5000` (Backend API).
- Port `80` (HTTP web access).

### Q42: What is an AWS Key Pair (`.pem` file)?
**Answer**: An asymmetric cryptographic key pair used to securely authenticate SSH sessions to an EC2 instance without sending passwords across the internet.

### Q43: What is the difference between Public IP and Private IP in AWS EC2?
**Answer**: A Public IP is reachable from anywhere on the global internet. A Private IP is only routable within the Amazon Virtual Private Cloud (VPC) for internal server-to-server communication.

### Q44: What is K3s and why did you use it on AWS EC2 instead of full K8s?
**Answer**: K3s is a certified lightweight Kubernetes distribution created by Rancher. It packages all Kubernetes components into a single binary (<100MB) and runs with minimal RAM (<512MB), making it ideal for cost-effective single-node AWS EC2 instances.

### Q45: Why is it important to stop or terminate EC2 instances after the demonstration?
**Answer**: AWS bills on a pay-as-you-go model. Stopping or terminating instances prevents exhausting the 750 free-tier hours and incurring unintended financial charges.

---

## Category 6: Application Stack (React, Node, Express, MongoDB)

### Q46: What is a REST API?
**Answer**: Representational State Transfer (REST) is an architectural style for network applications using stateless HTTP methods:
- `GET` to read resources.
- `POST` to create resources.
- `PUT`/`PATCH` to update resources.
- `DELETE` to remove resources.

### Q47: What is CORS and why is it important in full-stack applications?
**Answer**: Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts a web page from making requests to a different domain, port, or protocol than the one that served the page. In Node.js, we use the `cors()` middleware to allow the React frontend to communicate with the Express API.

### Q48: What is the purpose of the health-check endpoint `/api/health`?
**Answer**: It acts as a diagnostic endpoint that returns system status, database connection state, and server uptime. It is used by Docker health checks, Kubernetes liveness/readiness probes, and load balancers to determine container viability.

### Q49: What is MongoDB and why is it classified as NoSQL?
**Answer**: MongoDB is an open-source, document-oriented NoSQL database that stores data in flexible, schema-free JSON-like BSON documents instead of rigid relational tables with rows and columns.

### Q50: What is Mongoose?
**Answer**: Mongoose is an Object Data Modeling (ODM) library for Node.js and MongoDB that provides strict schema definitions, validation, middleware, and query construction.

---

## Category 7: DevOps Best Practices & Agile

### Q51: How does this project reflect Agile development principles?
**Answer**: By automating CI/CD pipelines, changes can be integrated and deployed continuously in small, iterative increments. This allows fast feedback loops, early defect detection, and rapid feature releases without manual deployment bottlenecks.

### Q52: What is the principle of "Infrastructure as Code" (IaC)?
**Answer**: Managing and provisioning computing infrastructure through human-readable, version-controlled definition files (like our Kubernetes YAML manifests and Dockerfiles) rather than manual interactive configuration.

### Q53: What is "Graceful Shutdown" in our Node.js backend?
**Answer**: When Kubernetes stops a pod, it sends a `SIGTERM` signal. Our backend catches this signal, stops accepting new requests, finishes active transactions, and closes database connections cleanly before terminating.

### Q54: What happens if the MongoDB container crashes in Kubernetes?
**Answer**: Kubernetes immediately detects the crash, restarts a new pod automatically, mounts the existing `PersistentVolumeClaim` (PVC), and resumes service without data loss.

### Q55: What are the three most significant DevOps benefits demonstrated in TaskFlow?
**Answer**:
1. **Zero Configuration Drift**: Docker ensures code runs identically everywhere.
2. **Automated Quality Gate**: CI pipeline blocks broken code from reaching production.
3. **High Availability & Self-Healing**: Kubernetes automatically scales replicas and restarts failed containers on AWS.
