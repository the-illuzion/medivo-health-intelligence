---
name: performance-analysis
description: Performance profiling, optimization, and Web Vitals guidelines
---

# Performance Analysis & Optimization

## Overview
A health platform must be exceptionally fast and responsive. Users are often accessing it in clinical settings, emergency rooms, or via mobile networks with low bandwidth. Performance is not just a technical metric; it is a critical component of user experience and accessibility.

## When to Activate
- When Core Web Vitals targets are failing in CI or production monitoring.
- When an API endpoint response time exceeds 500ms.
- When the database exhibits high CPU usage or slow query logs.
- When the frontend feels sluggish or exhibits layout shifts.

## Core Web Vitals Targets
Medivo enforces strict thresholds for the patient-facing PWA based on Google's Core Web Vitals:
- **Largest Contentful Paint (LCP):** `< 2.5 seconds`. (How fast the main content loads).
- **First Input Delay (FID) / Interaction to Next Paint (INP):** `< 100 milliseconds`. (How fast the UI responds to a tap/click).
- **Cumulative Layout Shift (CLS):** `< 0.1`. (Visual stability; UI elements shouldn't jump around).

## Optimization Areas & Strategies

### 1. Frontend & Network (Next.js & PWA)
- **Bundle Size Budgets:** 
  - The initial JS payload for any route should not exceed **150KB (gzipped)**.
  - Analyze using `@next/bundle-analyzer`.
  - Lazy load non-critical components (e.g., complex charts hidden behind a tab, heavy AI-chat widgets) using `next/dynamic`.
- **Image Optimization:** 
  - Never serve raw uploaded images. Use the Next.js `<Image>` component for automatic resizing, WebP/AVIF formatting, and lazy loading.
- **Font Loading:** Use `next/font` to optimize font loading and prevent FOIT (Flash of Invisible Text) and layout shifts.

### 2. Caching Strategies
Caching is the most effective way to improve speed, but the hardest to invalidate correctly.
- **Browser/PWA Cache:** Use service workers to cache static assets (CSS, JS, Logos) and application shells so the app opens instantly offline.
- **React Query Cache (Client):** Utilize `staleTime` (e.g., 5 minutes for a clinic list) and `cacheTime` effectively to prevent redundant network requests when navigating between pages.
- **Redis Cache (Server):** 
  - Cache heavily read, rarely updated data (e.g., medical specialty taxonomies, public doctor profiles) in Redis.
  - **Do NOT cache highly sensitive, frequently changing PHI** in global Redis without strict user-keyed isolation and rapid TTLs.

### 3. Backend API (Node.js)
- **Event Loop Blocking:** Node is single-threaded. Ensure complex calculations (e.g., heavy data parsing, generating large PDF reports) are offloaded to background worker threads (BullMQ) so they don't block concurrent API requests.
- **Payload Size Reduction:** 
  - Implement pagination, filtering, and sparse fieldsets in BFF APIs. 
  - Do not return 10,000 records if the UI only displays 50. Use cursor-based pagination for large datasets.

### 4. Database (PostgreSQL)
- **N+1 Problem:** The most common ORM issue. Ensure data loaders or optimized JOINs (within the same schema) are used to batch queries instead of executing a query in a loop.
- **Indexes:** Analyze slow queries via `EXPLAIN ANALYZE`. Add indexes to columns used in `WHERE` and `JOIN` clauses.
- **Connection Pooling:** Ensure pgBouncer or connection pooling is configured correctly to prevent overwhelming the database with connections during traffic spikes.

### 5. AI & Background Processing
- **Async AI Generation:** LLM calls are inherently slow (often 2-10 seconds). 
  - **Never block** a user's HTTP request waiting for an AI generation. 
  - Accept the request, return a Job ID (`202 Accepted`), process via BullMQ, and notify the client (via WebSockets, Server-Sent Events, or polling) when done.

## Step-by-Step Profiling
1. **Identify the Bottleneck:** Use browser DevTools (Network, Performance tabs), Lighthouse, APM tools (Datadog), or Postgres slow query logs.
2. **Measure Baseline:** Record the current performance metric (e.g., "Endpoint takes 1.2s", "LCP is 4.0s").
3. **Hypothesize & Fix:** Implement the optimization (e.g., add an index, add a Redis cache layer).
4. **Verify:** Measure again to ensure the metric improved without breaking functionality or exposing stale data.

## Rules and Constraints
- **Premature optimization is the root of all evil.** Write clean, readable code first. Only optimize when measurements show a bottleneck.
- **Never compromise security for performance.** (e.g., Do not disable RBAC authorization checks just because they take 10ms).
