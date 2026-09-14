# API Specification & BFF Contracts

## Overview
All API endpoints across Medivo Health Intelligence Platform enforce strict Zod schema validation and type safety.

---

## Customer BFF Endpoint Architecture (`customer-bff`)

### 1. Health Score & AI Summary
- **Endpoint**: `GET /api/v1/customer/dashboard`
- **Response**:
  ```json
  {
    "healthScore": 87,
    "skinScore": 84,
    "delta": 4,
    "aiSummary": "Your skin hydration is up 6% this week...",
    "metrics": [
      { "label": "Hydration", "score": 76, "unit": "%", "delta": 8 }
    ]
  }
  ```

### 2. AI Face Match Analysis
- **Endpoint**: `POST /api/v1/customer/scan`
- **Body**: WebRTC frame canvas stream or base64 image payload.
- **Response**:
  ```json
  {
    "scanId": "scan_98241",
    "overallScore": 87,
    "confidence": 0.984,
    "landmarks": { "dots": 9, "meshStatus": "aligned" },
    "metrics": { "hydration": 76, "pigmentation": 84, "darkCircles": 73 }
  }
  ```

### 3. AI Coach Chat Stream
- **Endpoint**: `POST /api/v1/customer/coach/chat`
- **Body**: `{ "message": "How can I improve my dark circles?" }`
- **Response**: Server-Sent Events (SSE) streaming smart clinical advice.

### 4. Routines & Step Toggles
- **Endpoint**: `PATCH /api/v1/customer/routines/:stepId/toggle`
- **Body**: `{ "completed": true }`

### 5. Dermatologist Telehealth Appointments
- **Endpoint**: `POST /api/v1/customer/consultations/book`
- **Body**: `{ "doctorId": 1, "slot": "3:30 PM", "date": "2026-07-30" }`

### 6. Apple Health Synchronization
- **Endpoint**: `POST /api/mobile-bff/health/sync`
- **Authentication**: Bearer token required. The patient ID is derived from the authenticated token and is never accepted from the request body.
- **Body**:
  ```json
  {
    "provider": "apple_health",
    "samples": [
      {
        "externalId": "healthkit-sample-uuid",
        "metricType": "heart_rate",
        "value": 68,
        "unit": "count/min",
        "startAt": "2026-09-14T03:30:00.000Z",
        "endAt": "2026-09-14T03:30:00.000Z",
        "sourceName": "Apple Watch"
      }
    ],
    "deletedExternalIds": [],
    "requestedMetrics": ["heart_rate", "step_count"]
  }
  ```
- **Behavior**: Upserts by HealthKit UUID and soft-deletes samples reported as deleted by HealthKit. Requests are limited to 1,000 samples and 1,000 deletions per batch.

### 7. Apple Health Connection Status
- **Endpoint**: `GET /api/mobile-bff/health/connection`
- **Authentication**: Bearer token required.
- **Response**: The current Apple Health connection metadata and last successful sync timestamp, or `null` when no connection has been created.
