---
name: debugging
description: Systematic debugging approach and logging standards
---

# Debugging Methodology

## Overview
Debugging in the Medivo platform requires a systematic approach. Given the architecture (Modular Monolith, async background jobs, Next.js SSR), issues can hide in various layers. Health data requires extreme care—debugging must be done without exposing or risking PHI.

## When to Activate
- When tests are failing unexpectedly.
- When an application behaves incorrectly during local development or in production.
- When tracking down performance bottlenecks.
- During incident response for production errors.

## Logging Standards (The Foundation of Debugging)
Effective debugging relies on excellent telemetry. Medivo uses a structured logging approach.

### 1. Logging Levels
- **FATAL:** Application cannot continue (e.g., database connection lost). Triggers immediate pager alerts.
- **ERROR:** A specific operation failed (e.g., API request crashed, background job failed). Triggers alerts.
- **WARN:** Unexpected behavior that didn't stop the process, but needs attention (e.g., API rate limit approached, deprecated feature used).
- **INFO:** Significant business milestones (e.g., "User logged in", "Appointment booked", "AI analysis completed").
- **DEBUG:** Verbose tracing information (e.g., raw payload sizes, internal state changes). Disabled in production.

### 2. Structured Logging Format
Logs must be emitted as JSON strings to be ingested by our APM tool (e.g., Datadog).
```json
{
  "timestamp": "2026-07-28T10:30:00Z",
  "level": "ERROR",
  "module": "billing",
  "requestId": "req-12345",
  "userId": "usr-8899", // Never log names or emails here
  "message": "Failed to process payment integration",
  "error": "Timeout from Stripe API",
  "stack": "..." 
}
```

## Step-by-Step Debugging Process

### 1. Establish the Facts (Don't Guess)
Before touching code, answer:
- What exactly is the error message?
- Where did it occur? (Client browser, Node server, Database, Background worker?)
- Is it consistent or intermittent?

### 2. Follow the Data Flow (The Medivo Stack)
Trace the request from the outside in:
1. **Network Tab (Frontend):** Is the API request failing? Check the payload and HTTP status.
2. **Next.js API/BFF Logs:** Search by `requestId`. Did Zod validation fail?
3. **Application Use Case:** Did the business logic reject the state?
4. **Infrastructure/Database Logs:** Did a query fail? Constraint violation?
5. **Background Jobs (BullMQ):** Check the Redis queue status and worker logs.

### 3. Utilize Tooling
- **Node Debugger:** Attach a debugger (VS Code or Chrome DevTools) to the backend process. Set breakpoints in the Use Case.
- **React DevTools:** Inspect component state. Identify prop drilling or stale state issues.
- **Postgres EXPLAIN:** Run `EXPLAIN ANALYZE` on slow queries to view the execution plan.

## Health-Domain Debugging Scenarios

### Scenario A: Patient Data Missing from Dashboard
1. **Check the boundary:** Did the BFF fetch it?
2. **Check Auth/Context:** Is the BFF executing the query with the correct `patientId`? (IDOR protection often causes missing data if context is wrong).
3. **Check Soft Deletes:** Was the record accidentally marked `deleted_at`?
4. **Check Schema Constraints:** Did a background job fail to replicate data across domains?

### Scenario B: AI Generation Failed or Hallucinated
1. **Check the Prompt Payload:** Extract the exact JSON prompt sent to the LLM provider from the debug logs (ensure PHI is sanitized in the log).
2. **Identify Parsing Errors:** Did the LLM return markdown instead of JSON? Did it hallucinate a schema field?
3. **Test Isolation:** Take the prompt payload and run it directly against the LLM API using an isolation script in the `scratch/` folder to replicate.

### Scenario C: Debugging Production Data
- **Data Obfuscation:** When pulling database dumps to debug locally, ensure scripts are run to scramble PHI (names, SSNs, contact info). 
- **Never debug production databases directly** if it can be avoided. Replicate the state locally.

## Rules and Constraints
- **Remove `console.log`:** Do not commit temporary debugging statements. Use the official logger.
- **Don't hide errors:** Catch promise rejections, log them, and throw a Domain Exception. Don't swallow errors.
- **Sanitize:** Ensure no unredacted PHI is copy-pasted into Slack, Jira, or GitHub issues during the debugging process.
