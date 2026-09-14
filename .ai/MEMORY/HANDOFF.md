# Agent Handoff

## Latest Session: Elevation of New Design System as Primary Application

- **Branch**: `main`
- **Completed**: 2026-09-14
- **Summary**: The modern, clinical health intelligence design previously located under `/design` has been promoted to become the official primary version of `apps/customer-app`. All legacy designs, mock contexts, and zero-API stubs were removed in favor of dynamic Zustand stores, PostgreSQL schema migrations, customer-bff endpoints, and the `@medivo/api-client` SDK.

### Architecture & Routing Map
1. **Primary Tabs (`app/(tabs)/`)**:
   - `index.tsx`: Official Home Dashboard (Live telemetry overview, health status score, key metrics grid, alerts, today's care plan preview, connected devices).
   - `insights.tsx`: Official Key Metrics & Biomarker Intelligence (Day/Week/Month segmented periods, health score delta, clinical trends, changes summary).
   - `scan.tsx`: Face Camera AI Scanner & auxiliary vitals check/photo upload/manual entry modal actions.
   - `care.tsx`: Daily Care Plan & Task Execution (Date picker/switcher, Morning/Afternoon/Evening timeline, adherence calculation, task completion toggles).
   - `profile.tsx`: Comprehensive Health Profile & Settings (Patient demographics, medical records, medications, care network, connected device shortcuts).
   - `_layout.tsx`: Configured for 5 official tabs, hiding bottom tab bar in favor of `DesignFrame` responsive navigation.

2. **Standalone Core App Routes (`app/`)**:
   - `app/metric-details.tsx`: Detailed biomarker drill-downs and clinical reference ranges.
   - `app/devices.tsx`: Wearable and telemetry device management (battery telemetry, data scopes, sync toggles).
   - `app/connect-device.tsx`: Device pairing flow with real-time feedback.
   - `app/health-status.tsx`: 4-slide wellness carousel with habit checklist.
   - `app/design/`: Backward-compatible redirect route forwarding directly to `/(tabs)`.

3. **Responsive Presentation**:
   - Mobile/Tablet: Native Mobile Tab Bar + Top Header with Medivo branding, notifications badge, and avatar.
   - Web Desktop ($\ge 900\text{px}$): Persistent Left Sidebar + Top Bar with notifications, live telemetry status, and centered $1180\text{px}$ dashboard.
   - Global Modal System: `<SheetHost />` mounted globally in root `_layout.tsx` for bottom sheets on mobile and centered modal dialogs on desktop.

4. **Live Stores & Backend Connectivity**:
   - Stores: `useVitalsStore`, `useCareStore`, `useDevicesStore`, `useHealthProfileStore`, `useSheetStore`, `useAuthStore`.
   - BFF Endpoints: `/api/mobile-bff/vitals`, `/api/mobile-bff/care`, `/api/mobile-bff/devices`, `/api/mobile-bff/health-profile`.
   - PostgreSQL: Migration `006_vitals_care_devices_health_profile.sql` in `services/api` embedding schema tables and demo data seeder for `usr-101`.

### Verification Status
- `pnpm -r type-check`: 18/18 workspace packages passed with 0 TypeScript errors.
- `pnpm -r test`: 25/25 unit & integration tests in `services/api` and `packages/utils` passed with 0 errors.
- `pnpm --filter @medivo/customer-app build:web`: Exported all 53 static routes and assets successfully.
- `pnpm --filter @medivo/customer-bff build`: Built with 0 errors.
- `pnpm --filter @medivo/service-api build`: Built with 0 errors.
- `pnpm --filter @medivo/api-client build`: Built with 0 errors.
- Live API mutation and query verification: 100% passing against running Customer BFF on port 4000 (Auth, Vitals, Care, Devices, Health Profile).

### Flow Reviews Completed
- **Flow 1: Authentication & Onboarding**: Complete (Branded clinical screens, zero hardcoded credentials, test user `test@yopmail.com` / `Test@123`).
- **Flow 2: Home Dashboard**: Complete (Dynamic score ring, time-of-day greeting, live telemetry, key metrics, care plan preview, connected devices).
- **Flow 3: Key Metrics & Insights**: Complete (`(tabs)/insights.tsx`, `Metrics.tsx`, `MetricDetails.tsx` with Day/Week/Month period switching, live health score delta, dynamic alert banner, period-aware changes summary, desktop 2-column grid, and metric drill-down with clinical baseline comparison).
- **Flow 4: Optical AI Scan & Data Capture**: Complete (`(tabs)/scan.tsx`, `Sheets.tsx` [ScanContent, DetailContent] with live `apiClient.scans.analyze` execution, HIPAA consent verification, real-time optical biomarker inference, vital telemetry recording, and 2-column desktop grid).
- **Flow 5: Daily Care Plan & Adherence**: Complete (`(tabs)/care.tsx`, `useCareStore.ts` with dynamic date switching [Today/relative navigation], live adherence percentage calculation, task status toggling [Pending/Completed], collapsible period timelines, Care Team notes, and 2-column desktop layout).
- **Flow 6: Health Profile & Settings**: Complete (`(tabs)/profile.tsx`, `useHealthProfileStore.ts` with live demographic sync [Alex Morgan / test@yopmail.com], patient identity verification, active medication CRUD, care network management, HIPAA security banner, device shortcuts, and 2-column desktop grid).
- **Flow 7: Devices & Wearables Management**: Complete (`app/devices.tsx`, `app/connect-device.tsx`, `useDevicesStore.ts` with live battery telemetry, background sync toggling, attention alerts, device pairing simulation [Apple Watch, Fitbit, Garmin], and 2-column desktop grid).
- **Flow 8: Health Status Wellness Carousel**: Complete (`app/health-status.tsx`, `HealthStatus.tsx` with 4-slide carousel, habit checklist, score binding, and desktop frame).
- **Navigation & Active Menu Highlight**: Fixed `isRouteActive` helper in `tokens.ts`, `Shell.tsx`, `DesktopShell.tsx`, and `WebSidebar.tsx` ensuring active highlight is always applied to the matching menu item across both mobile tab bar and desktop sidebar.
- **New User Zero-Data Isolation**: Verified and ensured that brand new users start with clean unrecorded states (`Score: --`, `Vitals: --`, `Tasks: 0`, `Devices: 0`, `Records: 0`, `Medications: 0`) and zero mock data leakage until they perform a scan, connect a device, or record data. Demo telemetry is isolated strictly to `usr-101`.
- **Live Camera Scanner & Dynamic Telemetry**: Integrated real-time WebRTC camera viewfinder in `Scan.tsx` with oval alignment reticle, luminance check, distance heuristic, 3-2-1 auto-capture countdown, and direct frame capture to `apiClient.scans.analyze`. The app maintains the live camera viewfinder and only renders the 15-biomarker score dossier *after* an actual camera frame is captured. Added "Take Another Scan" to reset viewfinder.
- **Vendor Name Sanitization**: Completely removed all third-party vendor name mentions ("Perfect Corp", "Perfect AI", "Shen.ai", "Shen AI") across the frontend screens, product cards, AI coach, chat services, and backend adapters, consolidating all optical AI under Medivo clinical branding.
