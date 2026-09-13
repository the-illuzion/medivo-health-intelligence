# Medivo static UI

An independent React + TypeScript + Vite mobile prototype based on the 13 Medivo reference screenshots supplied in the task. All application code, styles, mock data, dependencies and review artifacts live in this directory.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The interface is centered at a maximum width of 430px and was checked at both 390px and 430px.

```sh
npm run build
npm run preview
```

## Screens and interactions

- **Home:** health score, insights, six metrics, alert, care preview and devices.
- **Health status:** four illustrated slides, swipe/scroll, clickable dots, Next and Done.
- **Insights:** bottom sheet with horizontal pastel cards and a visible next card.
- **Health alert:** bottom sheet with What changed / Possible reasons / What to do now and metric details.
- **Key Metrics:** Day / Week / Month changes mock values and trends; all metric rows open details.
- **Care:** date control, collapsible timeline, tap-to-complete/undo tasks, adherence derived from task state and Mark all done.
- **Scan:** face scan simulation with explicit consent, completion state, file selection and manual data entry.
- **Profile:** health sections, records, care network, integrations, settings and editable display name.
- **Devices:** sync switches, battery and data-sharing chips, Oura reconnect and background-sync settings.
- **Connect:** Apple Watch and supported service flows with a simulated success confirmation.

Navigation uses URL hashes (for example `#care`, `#devices`, `#status`), supports browser Back, and requires no server route configuration. Mock edits and task/device states survive navigation in the current session. Refresh resets the prototype.

## Source structure

- `src/components/`: shared UI, charts, device artwork, portraits and wellness illustrations.
- `src/features/`: screen compositions and bottom-sheet flows.
- `src/data/mock.ts`: typed mock metrics, devices, care tasks, insights and status content.
- `src/styles/tokens.css`: reference-derived palette, typography, spacing, radii and component sizes.
- `src/styles/app.css`: mobile layouts and component states.
- `tests/journeys.spec.ts`: browser checks for the main journeys and responsive screenshots.
- `review/`: screenshots from the visual review at 390px and 430px.

## Verification

Install the test browser inside this standalone directory:

```sh
PLAYWRIGHT_BROWSERS_PATH=./.browsers npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=./.browsers npm test
```

The test configuration starts a local preview automatically when one is not already running. Tests cover navigation, all four status slides, sheet controls, period switching, task completion, sync toggles, reconnect, connection confirmation, scan consent/completion, form saves, background isolation and mobile page overflow. Review captures include every screen and both reference sheets.

## Reference fidelity and prototype limits

The supplied layouts, section hierarchy, pastel surfaces, bottom navigation, carousels, timeline and bottom sheets were preserved. Minor typography, color and radius differences were consolidated into shared styles. The four-slide health-status flow uses the All good, What’s going well, Score staying strong and Stay on track sequence; the alternate week-trending reference supplies an insight card and the celebration illustration composition.

The later task instructions prohibited reading assets outside `static-ui/`. No reference image files had been copied in before that restriction. Portraits, device artwork and wellness illustrations are therefore local SVG placeholders derived from the references visible in the conversation. They are the main remaining visual difference from the source images.

The reference care summary contains inconsistent totals. This implementation computes adherence and completed counts from the six visible tasks, so interactions remain coherent. Selected date is a local date control; it does not fetch a different care plan.

No production APIs, customer data, actual camera capture, medical analysis, uploads or third-party device connections are used. File selection uses only a filename. Forms are lightweight demo interactions. This is not a medical application or medical advice.
