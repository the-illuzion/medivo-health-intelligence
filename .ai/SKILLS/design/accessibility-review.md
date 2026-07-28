---
name: accessibility-review
description: Accessibility audit and compliance for the health platform
---

# Accessibility (a11y) Review Guidelines

## Overview
Healthcare platforms must be usable by everyone, regardless of physical or cognitive ability. Medivo targets **WCAG 2.1 AA** compliance at a minimum. This skill outlines how to audit and implement accessible features.

## When to Activate
- During every frontend PR review.
- When creating new components in the `design-system`.
- When designing charts, graphs, or data visualizations.

## Audit Checklist & Procedures

### 1. Keyboard Navigation
- **Test:** Can you navigate the entire feature using *only* the `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Arrow` keys?
- **Focus Rings:** Is the current keyboard focus clearly visible? Never use `outline: none` without providing a custom, highly visible focus state.
- **Skip Links:** Does the page have a "Skip to main content" link for screen reader and keyboard users?

### 2. Screen Reader Compatibility
- **Semantic HTML:** Use `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<article>`, `<section>`. Screen readers rely on these.
- **ARIA Attributes:** Use `aria-label`, `aria-hidden`, and `aria-live` correctly, but prefer native semantic HTML first. 
  - *Rule of thumb:* No ARIA is better than Bad ARIA.
- **Images:** Do all informational images have descriptive `alt` text? Are decorative images marked with `alt=""` or `aria-hidden="true"`?

### 3. Visual Accessibility (Crucial for Health)
- **Color Contrast:** Text must have a contrast ratio of at least 4.5:1 against its background (WCAG AA). 
- **Color-Blind Safe Indicators:** Never rely on color alone to convey meaning. 
  - *Bad:* A red dot means "Abnormal Lab Result".
  - *Good:* A red dot *with an exclamation mark icon* and text saying "Abnormal" means "Abnormal Lab Result".
- **Zooming:** Ensure the UI doesn't break when the user zooms the browser to 200%.

### 4. Cognitive & Interaction Accessibility
- **Session Timeouts:** If a form has a timeout (e.g., for security), warn the user and give them a way to extend it.
- **Form Error Linking:** When a form submission fails, focus should move to the first error, and the error message must be programmatically linked to the input via `aria-describedby`.

## Testing Tools
- Use the **axe DevTools** browser extension.
- Use native screen readers (VoiceOver on Mac/iOS, NVDA/JAWS on Windows, TalkBack on Android) for critical flows.
- Use keyboard-only navigation to manually verify.

## Rules and Constraints
- **Accessibility is a blocker.** A PR that introduces an accessibility regression should not be merged.
- **Data Visualizations:** All charts (e.g., blood pressure over time) must have a tabular data alternative accessible to screen readers.

## Related Skills
- `frontend-design`: Ensuring components are built accessibly from the start.
- `design-system`: The foundation where accessible components are defined.
