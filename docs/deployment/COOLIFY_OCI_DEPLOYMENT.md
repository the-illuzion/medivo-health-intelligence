# Production Deployment Guide: Oracle Cloud Infrastructure (OCI) + Coolify

## 1. System Overview & Target Specs

- **Host OS**: Ubuntu 22.04 / 24.04 LTS (OCI Compute Instance - Ampere A1 or AMD)
- **Compute Specs**: 4 OCPU, 24 GB RAM
- **Storage**: 100+ GB Boot/Block Volume
- **Container Engine**: Docker Engine 24+ & Docker Compose v2
- **Platform Manager**: Coolify v4
- **Edge Reverse Proxy**: Traefik (Managed by Coolify on Host Ports 80 and 443)
- **SSL / TLS**: Automated Let's Encrypt certificates managed by Traefik
- **Registry**: Direct Git repository build on instance (no private container registry needed)

---

## 2. Architecture & Networking Map

```
                             [ Internet ]
                                  │
                          [ OCI Public IP ]
                                  │
                           Ports 80 / 443
                                  │
                    ┌───────────────────────────┐
                    │  Traefik (Coolify-Managed) │
                    └─────────────┬─────────────┘
                                  │
      ┌───────────────────────────┼───────────────────────────┬───────────────────────────┐
      │ (example.com)             │ (doctor.example.com)      │ (admin.example.com)       │ (api.example.com)
      ▼                           ▼                           ▼                           ▼
┌──────────────┐            ┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│marketing-web │            │doctor-portal │            │ admin-panel  │            │ customer-bff │
│ Port: 3000   │            │ Port: 3001   │            │ Port: 3002   │            │ Port: 4000   │
└──────────────┘            └──────────────┘            └──────────────┘            └──────┬───────┘
                                                                                           │
                       ┌───────────────────────────────────────────────────────────────────┤
                       │              Internal Docker Network (medivo-network)             │
                       ▼                                                                   ▼
       ┌──────────────────────────────┐                            ┌──────────────────────────────┐
       │ Internal Microservices       │                            │ Core Infrastructure          │
       ├──────────────────────────────┤                            ├──────────────────────────────┤
       │ service-ai           (:8080) │                            │ postgres:16-alpine    (:5432)│
       │ service-auth         (:4001) │                            │ (13 isolated schemas)        │
       │ service-appointments (:4002) │                            │                              │
       │ service-commerce     (:4003) │                            │ redis:7-alpine        (:6379)│
       │ service-notifications(:4004) │                            │ (BullMQ queue & sessions)    │
       │ mailpit (mock SMTP)  (:1025) │                            │                              │
       └──────────────────────────────┘                            │ minio S3-compatible   (:9000)│
                                                                   └──────────────────────────────┘
```

> **CRITICAL RULE**: No internal services or backend containers bind directly to host ports. Host ports 80 and 443 are exclusively bound by Coolify's Traefik reverse proxy. All service-to-service communication flows through the internal Docker network `medivo-network`.

---

## 3. Server Provisioning & Initial Setup (OCI Ubuntu)

### Step 1: Configure OCI Security List & Ingress Rules
In the Oracle Cloud Console under **Networking > Virtual Cloud Networks > VCN > Security Lists**, ensure the following Ingress rules are open:
- **Port 22 (TCP)**: SSH Administration (restrict to your IP where possible)
- **Port 80 (TCP)**: HTTP (Traefik ACME Challenge & HTTP traffic)
- **Port 443 (TCP)**: HTTPS (Traefik SSL/TLS traffic)
- **Port 8000 (TCP)**: Coolify Admin Dashboard (initial setup)

### Step 2: Configure Ubuntu Firewall (`iptables` / `ufw`)
OCI Ubuntu images include strict `iptables` rules by default. Run the following on your OCI server:
```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT
sudo netfilter-persistent save
```

### Step 3: Install Docker & Coolify
Install Coolify via the official automated script:
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```
Once installed, navigate to `http://<YOUR_OCI_PUBLIC_IP>:8000` to set up your Coolify administrator account.

---

## 4. Coolify Deployment Workflows

You can deploy the Medivo stack in Coolify using either of two approaches:

### Option A: Unified Docker Compose Stack (Recommended)
This approach deploys all services and databases together using `docker-compose.production.yml`.

1. In Coolify, click **+ Add Resource** > **Docker Compose**.
2. Select your Git repository: `medivo-health-intelligence` (Branch: `main`).
3. Set the Compose file path to: `docker-compose.production.yml`.
4. In the **Environment Variables** tab, copy the contents of `.env.production.example` and populate your secrets.
5. In the Coolify UI, verify the domains mapped to Traefik:
   - `marketing-web` -> `https://example.com`, `https://www.example.com`
   - `doctor-portal` -> `https://doctor.example.com`
   - `admin-panel` -> `https://admin.example.com`
   - `customer-bff` -> `https://api.example.com`
6. Click **Deploy**.

### Option B: Separate Coolify Applications from Monorepo
For independent scaling and restarts:
1. **Databases & Cache**: Create a PostgreSQL database and Redis instance in Coolify (or deploy them via a database Compose stack).
2. **Frontend Applications**:
   - `marketing-web`: Base directory `/`, Dockerfile path `apps/marketing-web/Dockerfile`, Port `3000`, Domain `https://example.com`.
   - `doctor-portal`: Base directory `/`, Dockerfile path `apps/doctor-portal/Dockerfile`, Port `3001`, Domain `https://doctor.example.com`.
   - `admin-panel`: Base directory `/`, Dockerfile path `apps/admin-panel/Dockerfile`, Port `3002`, Domain `https://admin.example.com`.
3. **BFF Gateway**:
   - `customer-bff`: Base directory `/`, Dockerfile path `apps/customer-bff/Dockerfile`, Port `4000`, Domain `https://api.example.com`.
4. **Microservices (Internal)**:
   - `service-ai`: Dockerfile `services/ai/Dockerfile`, Port `8080`, No domain.
   - `service-auth`: Dockerfile `services/auth/Dockerfile`, Port `4001`, No domain.
   - `service-appointments`: Dockerfile `services/appointments/Dockerfile`, Port `4002`, No domain.
   - `service-commerce`: Dockerfile `services/commerce/Dockerfile`, Port `4003`, No domain.
   - `service-notifications`: Dockerfile `services/notifications/Dockerfile`, Port `4004`, No domain.

---

## 5. Resource Budgeting (4 OCPU / 24 GB RAM)

| Service / Container | Type | Memory Reservation | Memory Limit | CPU Limit |
| :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL 16** | Database | 1024 MB | 4096 MB | 1.0 OCPU |
| **Redis 7** | Cache / Queue | 256 MB | 1024 MB | 0.5 OCPU |
| **MinIO S3** | Storage | 512 MB | 2048 MB | 0.5 OCPU |
| **customer-bff** | API Gateway | 512 MB | 2048 MB | 1.0 OCPU |
| **marketing-web** | Next.js Frontend | 512 MB | 2048 MB | 0.75 OCPU |
| **doctor-portal** | Next.js Frontend | 512 MB | 2048 MB | 0.75 OCPU |
| **admin-panel** | Next.js Frontend | 512 MB | 2048 MB | 0.75 OCPU |
| **service-ai** | Microservice | 512 MB | 2048 MB | 1.0 OCPU |
| **service-auth** | Microservice | 256 MB | 1024 MB | 0.5 OCPU |
| **service-appointments** | Microservice | 256 MB | 1024 MB | 0.5 OCPU |
| **service-commerce** | Microservice | 256 MB | 1024 MB | 0.5 OCPU |
| **service-notifications**| Microservice | 256 MB | 1024 MB | 0.5 OCPU |
| **Mailpit** | Mock SMTP | 128 MB | 512 MB | 0.25 OCPU |
| **Traefik + Coolify Agent**| Core Engine | 512 MB | 1500 MB | 0.5 OCPU |
| **OS & Buffer** | Linux Kernel | 2048 MB | - | - |
| **Total Stack** | - | **~7.5 GB Base** | **~22.5 GB Cap** | **4.0 OCPU Pooled** |

---

## 6. Mobile Application (`apps/customer-app`)

The React Native / Expo application is a client-side binary distributed through App Store, Google Play, or Expo EAS Preview builds (`.apk` / `.ipa`). It does not run inside a server Docker container.

To configure the mobile app to point to your OCI production server:
1. In `apps/customer-app/.env` (or EAS build profile secrets), set:
   ```env
   EXPO_PUBLIC_API_URL=https://api.example.com
   ```
2. Build client binaries using Expo Application Services (EAS):
   ```bash
   eas build --platform android --profile production
   eas build --platform ios --profile production
   ```

---

## 7. Post-Deployment Verification Checklist

1. **Verify PostgreSQL Schema Initialization**:
   Ensure all 13 schemas and core tables are created:
   ```bash
   docker exec -it medivo-postgres psql -U postgres -d medivo -c "\dn"
   ```
2. **Verify Public Endpoints**:
   - Website: `curl -I https://example.com`
   - Doctor Portal: `curl -I https://doctor.example.com`
   - Admin Panel: `curl -I https://admin.example.com`
   - BFF API Health: `curl https://api.example.com/health` (should return `{"status": "HEALTHY", ...}`)
3. **Verify Traefik SSL**:
   Check that Let's Encrypt certificates are issued automatically in Coolify under the Traefik dashboard.
