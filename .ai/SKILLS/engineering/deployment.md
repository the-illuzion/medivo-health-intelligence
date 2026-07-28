---
name: deployment
description: Deployment, CI/CD pipeline, and infrastructure guidelines
---

# Deployment & Infrastructure Guidelines

## Overview
Medivo's deployment strategy emphasizes zero-downtime, automated rollouts, and infrastructure-as-code to ensure high availability for the health platform. Currently architected as a Modular Monolith, the deployment focuses on shipping a single resilient, highly-tested container securely.

## When to Activate
- When configuring GitHub Actions or CI/CD pipelines.
- When defining environment variables or secret management.
- When planning a complex database migration.
- When rolling out a new feature behind a feature flag.

## Environment Matrix
Medivo operates across three primary environments:
1. **Development (Local):** Powered by Docker Compose (Postgres, Redis, BullMQ) and local Node instances.
2. **Staging:** An exact replica of Production architecture, scaled down. Connected to scrubbed/anonymized data for E2E testing and QA sign-off.
3. **Production:** High-availability cluster handling live patient data. Strict access controls.

## CI/CD Pipeline Stages

### 1. Continuous Integration (CI) - On Pull Request
Every PR must pass automated checks before it can be merged into `main`:
- **Linting & Formatting:** ESLint, Prettier execution.
- **Type Checking:** `tsc --noEmit` across all apps and packages.
- **Unit & Integration Tests:** Run the full Vitest suite. Must meet coverage thresholds.
- **Security Scans:** 
  - Secret scanning (ensure no hardcoded API keys).
  - Dependency vulnerability scanning (e.g., npm audit, Snyk).
- **Build Verification:** Ensure the Next.js app builds successfully (`npm run build`).

### 2. Continuous Deployment (CD) - On Merge to Main
Merging to `main` triggers an automated deployment to **Staging**:
- **Image Build:** Build a Docker image containing the compiled application.
- **Image Push:** Push the image to the container registry (e.g., AWS ECR) tagged with the commit SHA.
- **Staging DB Migrations:** Automatically apply non-destructive database migrations against the Staging DB.
- **Deploy to Staging:** Update the staging container orchestrator to run the new image.
- **E2E Validation:** Trigger Cypress/Playwright tests against the newly deployed Staging environment.

### 3. Production Release - Controlled Trigger
Releasing to Production is a conscious decision, often triggered by a GitHub Release or a manual workflow dispatch:
- **Approval:** Requires manual sign-off by a tech lead after Staging QA.
- **Immutable Artifact Promotion:** The *exact same* Docker image tested in Staging is promoted to Production. Only the environment variables change.
- **DB Migrations (Prod):** Applied *before* the application traffic is routed to the new version.
- **Zero-Downtime Rollout:** Deploy the new containers alongside the old. Wait for health checks (Liveness/Readiness probes) to pass, then shift load-balancer traffic gracefully (Rolling update).

## Database Migration Deployment Steps
Database schema changes are the highest risk part of deployment.
1. **Backward Compatibility:** Migrations must be backward compatible with the *current* running code. 
2. **The 3-Step Column Rename/Delete Rule:**
   - *Phase 1:* Add new column/table. Deploy.
   - *Phase 2:* Deploy code that writes to both old and new, and runs a background script to backfill data.
   - *Phase 3:* Deploy code that reads only from new. Drop the old column in a subsequent migration.
3. **Lock Avoidance:** Avoid operations that lock massive tables (e.g., adding a column with a default value to a 10M row table without fast-defaults support).

## Feature Flag Strategy
To decouple deployment from release, Medivo uses Feature Flags (e.g., LaunchDarkly, ConfigCat, or a custom DB table).
- **Deployment is not Release:** Code for new features is deployed to production continually, hidden behind flags.
- **Phased Rollout:** Turn the feature on for 1% of users, monitor error rates and APM metrics, then scale to 100%.
- **Kill Switches:** If a new AI feature causes issues, turn off the feature flag to instantly revert to the old behavior without waiting for a full CI/CD rollback deployment.
- **Cleanup:** Feature flags create technical debt. Once a feature is 100% rolled out and stable, create a ticket to remove the flag and the dead code path.

## Rules and Constraints
- **Secrets Management:** Never commit secrets to the repository. Use environment variables injected by the CI/CD pipeline pulling from a Secret Manager (AWS Secrets Manager, HashiCorp Vault).
- **No SSH to Prod:** Developers do not SSH into production servers. Debugging must be done via comprehensive APM logs, metrics, and traces.
