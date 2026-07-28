# ADR-004: Next.js Progressive Web Application (PWA)

## Status
Accepted

## Date
2026-07-28

## Context
We need to deliver a highly accessible, performant, and feature-rich digital experience for patients. While a native mobile app is planned, we require a robust web presence immediately. The web application needs to feel native, work reliably on mobile devices, handle poor network conditions gracefully, and rank well in search engines for public-facing pages.

## Decision
We will build the primary patient-facing web platform as a **Progressive Web Application (PWA) using Next.js**.

## Rationale
1. **SEO and Performance (Next.js):** Next.js provides out-of-the-box Server-Side Rendering (SSR) and Static Site Generation (SSG). This is critical for public pages (e.g., clinic locations, public doctor profiles) for SEO and initial page load speed.
2. **Native-like Experience (PWA):** PWAs allow users to install the app on their home screen, providing a full-screen, native-like feel without going through app stores.
3. **Offline Capabilities:** Service workers enable caching of static assets and critical data, allowing the app to function (or degrade gracefully) in low-connectivity scenarios—crucial for health applications where users might be in hospitals or areas with poor reception.
4. **Device APIs:** Modern web APIs allow access to cameras (for document scanning or telehealth) and biometrics (WebAuthn), covering many "native" requirements.
5. **Code Sharing:** React components built for the web can largely be adapted or shared with a future React Native application.

## Consequences

### Positive
- Excellent SEO and perceived performance.
- Broad reach (accessible via URL) with installability.
- Single codebase for web and "lite" mobile app.
- Faster iteration cycles compared to app store deployments.

### Negative / Trade-offs
- **Service Worker Complexity:** Managing service worker caching strategies, updates, and stale data requires careful engineering and testing.
- **iOS Limitations:** While improving, Apple's support for PWAs on iOS still lags behind Android (e.g., push notification nuances, background sync).
- **Framework Lock-in:** Strong coupling to the Next.js ecosystem.

## Alternatives Considered
1. **Standard React SPA (Create React App / Vite):** Rejected. Poor initial load performance and terrible SEO for public pages without complex workarounds.
2. **Native Mobile App Only:** Rejected. We need a web presence immediately, and forcing all users to download an app creates a barrier to entry.
3. **Flutter / Dart:** Rejected. While good for cross-platform, it requires a different skill set (Dart) and doesn't provide the same web-native SEO benefits as Next.js.

## Implementation Notes
- Use `next-pwa` or similar tooling to manage the service worker and manifest generation.
- Implement clear UI indicators when the app is offline or syncing.
- Ensure all core workflows (e.g., viewing upcoming appointments) have robust offline caching strategies.
