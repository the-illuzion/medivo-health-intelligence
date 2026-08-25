# Modular Coolify Deployment Guide: Independent Monorepo Resources

> **Platform**: Oracle Cloud Infrastructure (OCI) Ubuntu 22.04 / 24.04 LTS (4 OCPU / 24 GB RAM)  
> **Platform Manager**: Coolify v4 + Traefik (Host Ports 80 and 443 owned by Traefik)  
> **Source**: Single Git Monorepo (`main` branch)

---

## 1. Architecture Evolution

```
PREVIOUS STATE (Single Compose Resource)
┌────────────────────────────────────────────────────────────────────────────────┐
│ Coolify Resource: medivo-stack (All-in-One Compose)                            │
│  └─ marketing-web + customer-app + doctor-portal + admin-panel + customer-bff  │
│     + microservices + postgres + redis + minio + mailpit                       │
└────────────────────────────────────────────────────────────────────────────────┘

                                      │
                                      ▼

TARGET ARCHITECTURE (Independent Coolify Resources from Same Git Monorepo)

                               [ INTERNET ]
                                    │
                              OCI Public IP
                             (Ports 80 / 443)
                                    │
                         [ COOLIFY TRAEFIK PROXY ]
                                    │
   ┌───────────────────┬────────────┴───────┬───────────────────┬───────────────────┐
   │ (example.com)     │ (app.example.com)  │(doctor.example.com│(admin.example.com)│(api.example.com)
   ▼                   ▼                    ▼                   ▼                   ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Coolify App:  │ │Coolify App:  │ │Coolify App:  │ │Coolify App:  │ │Coolify App:  │
│marketing-web │ │customer-app  │ │doctor-portal │ │admin-panel   │ │customer-bff  │
│Port: 3000    │ │Port: 8081    │ │Port: 3001    │ │Port: 3002    │ │Port: 4000    │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │                │
═══════╪════════════════╪════════════════╪════════════════╪════════════════╪════════════════════════════
       │  SHARED DOCKER BRIDGE NETWORK: `medivo-network`                   │
═══════╪═══════════════════════════════════════════════════════════════════╪════════════════════════════
       │                                                                   ▼
       │                                            ┌───────────────────────────────────────────────┐
       │                                            │ Internal Microservices (No Public Ingress)    │
       │                                            ├───────────────────────────────────────────────┤
       │                                            │ • service-ai           (:8080)                │
       │                                            │ • service-auth         (:4001)                │
       │                                            │ • service-appointments (:4002)                │
       │                                            │ • service-commerce     (:4003)                │
       │                                            │ • service-notifications(:4004)                │
       │                                            └───────┬───────────────────────┬───────────────┘
       │                                                    │                       │
       ▼                                                    ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐   ┌─────────────────────────────┐
│ Core Infrastructure Resources (Independent)                     │   │ Management Tools (Protected)│
├─────────────────────────────────────────────────────────────────┤   ├─────────────────────────────┤
│ • postgres:16-alpine (:5432) — Volume: `postgres_data`          │   │ • cloudbeaver  (:8978)      │
│ • redis:7-alpine     (:6379) — Volume: `redis_data`             │   │   db-admin.example.com      │
│ • minio S3 engine    (:9000) — Volume: `minio_data`             │   │ • redis-insight(:5540)      │
│ • mailpit (mock SMTP)(:1025)                                    │   │   redis-admin.example.com   │
└─────────────────────────────────────────────────────────────────┘   └─────────────────────────────┘
```

---

## 2. Server Preparation (One-Time Setup)

On your OCI Ubuntu server, ensure the shared Docker external network `medivo-network` exists so all independent Coolify resources can communicate via container DNS:

```bash
# Create shared bridge network
docker network inspect medivo-network >/dev/null 2>&1 || docker network create --driver bridge medivo-network
```

---

## 3. Coolify Resource Inventory & Configuration Sheet

Each service is created in Coolify under **Project > Production Environment** as its own dedicated resource pointing to the same Git repository (`main` branch).

### Group A: Frontend Web Applications (Public)

#### 1. `marketing-web` (Website)
- **Coolify Resource Type**: Application (Dockerfile)
- **Git Repository**: `nitinduseja/medivo-health-intelligence`
- **Branch**: `main`
- **Build Context**: `.` (Monorepo root)
- **Dockerfile Path**: `apps/marketing-web/Dockerfile`
- **Container Port**: `3000`
- **Public Domain**: `https://example.com`, `https://www.example.com`
- **Docker Network**: `medivo-network`
- **Healthcheck Command**: `wget --quiet --tries=1 --spider http://127.0.0.1:3000/ || exit 1`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  PORT=3000
  INTERNAL_API_URL=http://customer-bff:4000
  INTERNAL_APP_URL=http://customer-app:8081
  INTERNAL_DOCTOR_URL=http://doctor-portal:3001
  INTERNAL_ADMIN_URL=http://admin-panel:3002
  NEXT_PUBLIC_API_URL=https://api.example.com
  ```

#### 2. `customer-app` (React Native Web App)
- **Coolify Resource Type**: Application (Dockerfile)
- **Git Repository**: `nitinduseja/medivo-health-intelligence`
- **Branch**: `main`
- **Build Context**: `.` (Monorepo root)
- **Dockerfile Path**: `apps/customer-app/Dockerfile`
- **Container Port**: `8081`
- **Public Domain**: `https://app.example.com`
- **Docker Network**: `medivo-network`
- **Healthcheck Command**: `wget --quiet --tries=1 --spider http://127.0.0.1:8081/health || exit 1`

#### 3. `doctor-portal` (Doctor Clinical Portal)
- **Coolify Resource Type**: Application (Dockerfile)
- **Git Repository**: `nitinduseja/medivo-health-intelligence`
- **Branch**: `main`
- **Build Context**: `.` (Monorepo root)
- **Dockerfile Path**: `apps/doctor-portal/Dockerfile`
- **Container Port**: `3001`
- **Public Domain**: `https://doctor.example.com`
- **Docker Network**: `medivo-network`
- **Healthcheck Command**: `wget --quiet --tries=1 --spider http://127.0.0.1:3001/ || exit 1`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  PORT=3001
  INTERNAL_API_URL=http://customer-bff:4000
  NEXT_PUBLIC_API_URL=https://api.example.com
  ```

#### 4. `admin-panel` (Platform Admin Console)
- **Coolify Resource Type**: Application (Dockerfile)
- **Git Repository**: `nitinduseja/medivo-health-intelligence`
- **Branch**: `main`
- **Build Context**: `.` (Monorepo root)
- **Dockerfile Path**: `apps/admin-panel/Dockerfile`
- **Container Port**: `3002`
- **Public Domain**: `https://admin.example.com`
- **Docker Network**: `medivo-network`
- **Healthcheck Command**: `wget --quiet --tries=1 --spider http://127.0.0.1:3002/ || exit 1`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  PORT=3002
  INTERNAL_API_URL=http://customer-bff:4000
  NEXT_PUBLIC_API_URL=https://api.example.com
  ```

---

### Group B: Backend API Gateway (Public Ingress)

#### 5. `customer-bff` (API Gateway)
- **Coolify Resource Type**: Application (Dockerfile)
- **Git Repository**: `nitinduseja/medivo-health-intelligence`
- **Branch**: `main`
- **Build Context**: `.` (Monorepo root)
- **Dockerfile Path**: `apps/customer-bff/Dockerfile`
- **Container Port**: `4000`
- **Public Domain**: `https://api.example.com`
- **Docker Network**: `medivo-network`
- **Healthcheck Command**: `wget --quiet --tries=1 --spider http://127.0.0.1:4000/health || exit 1`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  PORT=4000
  DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@postgres:5432/medivo
  REDIS_URL=redis://redis:6379
  JWT_SECRET=YOUR_SECURE_JWT_SECRET_64CHARS
  AI_SERVICE_URL=http://service-ai:8080
  AUTH_SERVICE_URL=http://service-auth:4001
  APPOINTMENTS_SERVICE_URL=http://service-appointments:4002
  COMMERCE_SERVICE_URL=http://service-commerce:4003
  NOTIFICATIONS_SERVICE_URL=http://service-notifications:4004
  S3_ENDPOINT=http://minio:9000
  S3_BUCKET=medivo
  S3_ACCESS_KEY=medivo_admin
  S3_SECRET_KEY=YOUR_MINIO_SECRET_KEY
  ```

---

### Group C: Core Infrastructure & Databases

You can deploy the infrastructure tier in Coolify using `docker-compose.infrastructure.yml` or as individual Coolify database/service resources:

#### 6. `postgres` (PostgreSQL 16 Multi-Schema Cluster)
- **Docker Image**: `postgres:16-alpine`
- **Container Name**: `medivo-postgres` (DNS alias: `postgres`)
- **Internal Port**: `5432` (No Host Port Binding)
- **Public Ingress**: **None** (Accessible only inside `medivo-network`)
- **Persistent Volume**: `postgres_data` -> `/var/lib/postgresql/data`
- **Schema Initialization**: Mount `./services/api/src/infrastructure/db/schema.sql` to `/docker-entrypoint-initdb.d/01-schema.sql:ro`
- **Healthcheck**: `pg_isready -U postgres -d medivo`

#### 7. `redis` (Redis 7 In-Memory Cache & BullMQ Queue)
- **Docker Image**: `redis:7-alpine`
- **Container Name**: `medivo-redis` (DNS alias: `redis`)
- **Command**: `redis-server --appendonly yes --maxmemory 1024mb --maxmemory-policy allkeys-lru`
- **Internal Port**: `6379` (No Host Port Binding)
- **Public Ingress**: **None** (Internal only)
- **Persistent Volume**: `redis_data` -> `/data`
- **Healthcheck**: `redis-cli ping`

#### 8. `minio` (MinIO S3-Compatible Storage Engine)
- **Docker Image**: `minio/minio:RELEASE.2024-03-30T09-41-56Z`
- **Container Name**: `medivo-minio` (DNS alias: `minio`)
- **Command**: `server /data --console-address ":9001"`
- **Internal Ports**: `9000` (S3 API), `9001` (Web Console)
- **Public Ingress**: **None for S3 API**
- **Persistent Volume**: `minio_data` -> `/data`
- **Healthcheck**: `curl -f http://127.0.0.1:9000/minio/health/live`

---

### Group D: Internal Microservices (Zero Public Domains)

Deployable together using `docker-compose.microservices.yml` or as individual Dockerfile applications connected to `medivo-network`:

| Service | Dockerfile Path | Internal Port | Healthcheck | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`service-ai`** | `services/ai/Dockerfile` | `8080` | `http://127.0.0.1:8080/health` | ONNX Neural Face & Skin Computer Vision Telemetry |
| **`service-auth`** | `services/auth/Dockerfile` | `4001` | `http://127.0.0.1:4001/health` | JWT Session Issuance, Password Verification & Token Claims |
| **`service-appointments`** | `services/appointments/Dockerfile` | `4002` | `http://127.0.0.1:4002/health` | Clinician Telehealth Queues, Booking & Availability Engine |
| **`service-commerce`** | `services/commerce/Dockerfile` | `4003` | `http://127.0.0.1:4003/health` | Product Catalog, Shopping Cart, Orders & Formulation Compounding |
| **`service-notifications`**| `services/notifications/Dockerfile` | `4004` | `http://127.0.0.1:4004/health` | Push Notification & SMTP Email Dispatcher |

---

### Group E: Management Tools (Protected Public Endpoints)

Deployable together using `docker-compose.management.yml`:

#### 14. `cloudbeaver` (PostgreSQL Database Studio)
- **Docker Image**: `dbeaver/cloudbeaver:latest`
- **Container Port**: `8978`
- **Public Domain**: `https://db-admin.example.com`
- **Persistent Volume**: `cloudbeaver_data` -> `/opt/cloudbeaver/workspace`
- **Internal Access**: Connects directly to `postgres:5432` without exposing PostgreSQL port 5432 to the public internet.

#### 15. `redis-insight` (Redis Data & Queue Inspector)
- **Docker Image**: `redis/redisinsight:latest`
- **Container Port**: `5540`
- **Public Domain**: `https://redis-admin.example.com`
- **Persistent Volume**: `redis_insight_data` -> `/data`
- **Internal Access**: Connects directly to `redis:6379` without exposing Redis port 6379 to the public internet.

---

## 4. OCI Resource Allocation Budget (4 OCPU / 24 GB RAM)

| Service Group | Service Count | Total RAM Reservation | Max RAM Limit |
| :--- | :--- | :--- | :--- |
| **Frontends** (`marketing`, `app`, `doctor`, `admin`) | 4 | 1.28 GB | 7.0 GB |
| **BFF Gateway** (`customer-bff`) | 1 | 0.51 GB | 2.0 GB |
| **Microservices** (`ai`, `auth`, `appointments`, `commerce`, `notifications`) | 5 | 1.53 GB | 6.0 GB |
| **Databases & Storage** (`postgres`, `redis`, `minio`, `mailpit`) | 4 | 1.92 GB | 7.5 GB |
| **Management Tools** (`cloudbeaver`, `redis-insight`) | 2 | 0.51 GB | 2.0 GB |
| **Host OS + Coolify + Traefik Overhead** | — | ~1.5 GB | ~2.5 GB |
| **Total Stack Footprint** | **16 Services** | **~7.25 GB** | **~24.0 GB (Peak Cap)** |

---

## 5. Deployment Step-by-Step in Coolify

### Step 1: Deploy Infrastructure Tier
1. In Coolify, click **+ Add Resource** > **Docker Compose**.
2. Point to repository `nitinduseja/medivo-health-intelligence` (Branch: `main`).
3. Set Compose path: `docker-compose.infrastructure.yml`.
4. Add environment variables (`DATABASE_PASSWORD`, `S3_SECRET_KEY`, etc.).
5. Click **Deploy**.

### Step 2: Deploy Management Tier
1. In Coolify, click **+ Add Resource** > **Docker Compose**.
2. Set Compose path: `docker-compose.management.yml`.
3. Set domain names for `db-admin.example.com` and `redis-admin.example.com`.
4. Click **Deploy**.

### Step 3: Deploy Microservices Tier
1. In Coolify, click **+ Add Resource** > **Docker Compose**.
2. Set Compose path: `docker-compose.microservices.yml`.
3. Add environment variables from `.env.production.example`.
4. Click **Deploy**.

### Step 4: Deploy BFF & Frontends
1. In Coolify, deploy `docker-compose.bff.yml` (Domain: `https://api.example.com`).
2. In Coolify, deploy `docker-compose.frontends.yml` (Domains: `example.com`, `app.example.com`, `doctor.example.com`, `admin.example.com`).
3. Alternatively, deploy each as an individual **Application (Dockerfile)** using the configuration sheet in Section 3 above.
