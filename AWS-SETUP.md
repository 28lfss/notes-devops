
# AWS Infrastructure Setup Documentation

**Project:** Notes DevOps
**Region:** us-east-1
**VPC:** Default VPC

---

## 1. Overview

This document describes the full AWS infrastructure configuration for the Notes DevOps application.
The setup includes RDS PostgreSQL, ECR repositories, an Application Load Balancer, ECS Fargate services, and security groups.

The project supports two deployment environments:

* **Production**
* **Staging**

Each environment runs independent backend and frontend ECS services.

---

## 2. RDS PostgreSQL Configuration

### 2.1 RDS Instance

A single PostgreSQL instance containing the databases for both environments.

### 2.2 Databases

* `notes_prod`
* `notes_staging`

### 2.3 Security Group (`notes-db-sg`)

Inbound rules:

| Protocol | Port | Source         | Purpose                    |
| -------- | ---- | -------------- | -------------------------- |
| TCP      | 5432 | notes-tasks-sg | Allow ECS tasks to connect |

---

## 3. ECR Repositories

The application uses two ECR repositories to store Docker images:

* **notes-backend**
* **notes-frontend**

Images for staging and production are tagged independently.

---

## 4. Application Load Balancer (ALB)

### 4.1 ALB Configuration

* Name: `notes-alb`
* Scheme: Internet-facing
* Subnets: All six public subnets in the default VPC
* Security Group: `notes-alb-sg`

### 4.2 ALB Security Group (`notes-alb-sg`)

Inbound rules:

| Protocol | Port | Source    |
| -------- | ---- | --------- |
| HTTP     | 80   | 0.0.0.0/0 |

### 4.3 Listener Rules (HTTP : 80)

Priority-based routing:

| Priority | Path Pattern    | Target Group              | Description            |
| -------- | --------------- | ------------------------- | ---------------------- |
| 1        | `/staging/api*` | notes-backend-staging-tg  | Backend staging API    |
| 2        | `/staging*`     | notes-frontend-staging-tg | Frontend staging       |
| 3        | `/api*`         | notes-backend-prod-tg     | Backend production API |
| Default  | `*`             | notes-frontend-prod-tg    | Production frontend    |

---

## 5. Target Groups

### 5.1 Backend Target Groups

| Name                     | Port | Type | Health Check Path                      |
| ------------------------ | ---- | ---- | -------------------------------------- |
| notes-backend-staging-tg | 3000 | IP   | `/staging/api/health` or `/api/health` |
| notes-backend-prod-tg    | 3000 | IP   | `/api/health`                          |

### 5.2 Frontend Target Groups

| Name                      | Port | Type | Health Check Path |
| ------------------------- | ---- | ---- | ----------------- |
| notes-frontend-staging-tg | 80   | IP   | `/staging`        |
| notes-frontend-prod-tg    | 80   | IP   | `/`               |

---

## 6. ECS Fargate Configuration

### 6.1 ECS Cluster

Cluster Name: `notes-cluster`

Configuration:

* Networking mode: awsvpc
* Assign public IP: Enabled (for testing environments)
* Tasks communicate through `notes-tasks-sg`

### 6.2 Security Group (`notes-tasks-sg`)

Inbound rules:

| Protocol | Port | Source       | Description      |
| -------- | ---- | ------------ | ---------------- |
| HTTP     | 80   | notes-alb-sg | Frontend traffic |
| TCP      | 3000 | notes-alb-sg | Backend traffic  |

Outbound: Allow all (default)

---

## 7. ECS Task Definitions

### 7.1 Backend Tasks

Used by:

* notes-backend-prod-service
* notes-backend-staging-service

Configuration:

* Platform: AWS Fargate
* CPU: 0.25 vCPU
* Memory: 0.5 GB
* Container Port: 3000 (HTTP)

Environment variables:

| Variable     | Value Example                    |
| ------------ | -------------------------------- |
| DATABASE_URL | PostgreSQL URI (prod or staging) |
| JWT_SECRET   | Secret value                     |
| NODE_ENV     | `production` or `staging`        |

### 7.2 Frontend Tasks

Used by:

* notes-frontend-prod-service
* notes-frontend-staging-service

Configuration:

* Platform: AWS Fargate
* CPU: 0.25 vCPU
* Memory: 0.5 GB
* Container Port: 80 (HTTP)

Environment variables:

| Variable     | Value                    |
| ------------ | ------------------------ |
| VITE_API_URL | `/api` or `/staging/api` |

---

## 8. ECS Services

| Service Name                   | Task Definition        | Target Group              | Container Port |
| ------------------------------ | ---------------------- | ------------------------- | -------------- |
| notes-backend-prod-service     | notes-backend-prod     | notes-backend-prod-tg     | 3000           |
| notes-backend-staging-service  | notes-backend-staging  | notes-backend-staging-tg  | 3000           |
| notes-frontend-prod-service    | notes-frontend-prod    | notes-frontend-prod-tg    | 80             |
| notes-frontend-staging-service | notes-frontend-staging | notes-frontend-staging-tg | 80             |

ALB listener forwards traffic based on configured routing rules.

---

## 9. Deployment Flow (CI/CD)

1. GitHub Actions builds Docker images for backend and frontend.
2. Images are pushed to ECR with environment-specific tags.
3. ECS services are updated using new task definitions.
4. ALB routes traffic to the updated tasks with zero downtime.

---