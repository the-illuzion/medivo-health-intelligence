#!/usr/bin/env bash
# ============================================================================
# Medivo Platform: Initialize Shared Docker Network for Independent Coolify Resources
# Run this once on your OCI server before deploying independent resources.
# ============================================================================

set -euo pipefail

NETWORK_NAME="medivo-network"

if docker network inspect "${NETWORK_NAME}" >/dev/null 2>&1; then
    echo "✅ Docker network '${NETWORK_NAME}' already exists."
else
    echo "⚙️ Creating Docker external network '${NETWORK_NAME}'..."
    docker network create --driver bridge "${NETWORK_NAME}"
    echo "✅ Docker network '${NETWORK_NAME}' successfully created."
fi
