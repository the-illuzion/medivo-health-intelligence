# Native Medivo design preview

The `/design` Expo Router area ports the approved `static-ui/` appearance to native React Native views and SVG. Successful login, onboarding, and authenticated splash navigation open this area. Existing authentication and onboarding gates still apply.

On Expo Web at 900px and wider, `/design` uses a desktop shell with persistent navigation, a wider constrained content canvas, horizontal dashboard groups, and centered dialogs. Below 900px and on iOS/Android, the original mobile component tree is used unchanged.

## Boundaries

- `PreviewContext` owns session-only sample metrics, care tasks, form values, device switches, and sheets. Leaving `/design` unmounts this state. No fixture data is saved to device storage.
- All scan, upload, and connection actions are simulated and labeled. They request no permissions, upload no files, and call no APIs.
- The only existing-store access is the read-only authentication gate in `app/design/_layout.tsx`.
- New Profile → **Open existing app** opens the existing tabs. Existing Profile → **Open new design** returns here.
- Existing shared header, sidebar, and backend-down overlay remain unchanged and are excluded only for `/design` routes.
- `static-ui/`, integration code, dependency manifests, lockfile, and Expo SDK are unchanged.

## Structure

- `tokens.ts`: isolated light colors, spacing, shapes, and routes.
- `data/`: sample fixtures and supporting copy.
- `components/`: reusable native cards, charts, SVG illustrations, navigation, paged carousels, and modal sheets.
- `components/DesktopShell.tsx`: web-only desktop navigation and header; it has no effect on native or mobile-web rendering.
- `screens/`: Home, Metrics/details, Care, Scan, Profile, Devices/connection, and four-slide Health Status.

Sheets support close, backdrop dismissal, downward drag on the handle, native `onRequestClose` for Android Back, accessibility escape, safe-area spacing, and keyboard avoidance. They remain bottom sheets on mobile and become constrained centered dialogs on desktop. Large font scales use less dense layouts where needed. No fake system status bar or home indicator is rendered.

## Verification

From `apps/customer-app`:

```sh
CI=1 EXPO_NO_TELEMETRY=1 EXPO_OFFLINE=1 pnpm exec expo export --platform all --output-dir /tmp/medivo-native-checks/all --max-workers 2
```

From the repository root, using the existing static prototype's Playwright installation (no new dependencies):

```sh
NODE_PATH="$PWD/static-ui/node_modules" PLAYWRIGHT_BROWSERS_PATH="$PWD/static-ui/.browsers" node static-ui/node_modules/@playwright/test/cli.js test --config apps/customer-app/tests/design-preview/playwright.config.cjs
```

Browser tests seed a synthetic authenticated session or intercept login with a fixture response. They cover all nine routes at 390px and 430px, auth/onboarding redirects, local interactions, modal dismissal, both experience entry points, state reset, and absence of preview API traffic. They never sign into a real account.

Verified: web, iOS, and Android exports; browser journeys; iOS simulator launch to the existing login screen. Full app type-check retains 43 existing diagnostics, with no new diagnostics from this port. The existing frozen lockfile check fails due to workspace manifest drift; no dependency or lockfile changes were made.

Still requires hands-on native QA: authenticated iOS journeys, Android hardware Back and gesture behavior, native keyboard avoidance, and system accessibility text sizes. Android runtime was unavailable in this environment. Bundle success and web tests do not substitute for these device checks.
