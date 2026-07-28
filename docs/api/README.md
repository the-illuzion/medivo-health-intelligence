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