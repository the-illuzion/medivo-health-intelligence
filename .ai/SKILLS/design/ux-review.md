---
name: ux-review
description: UX evaluation and improvement specific to health platforms
---

# UX Review Guidelines (Health Platform)

## Overview
This skill focuses on evaluating User Experience (UX) with a specific lens on healthcare. Health platforms carry unique burdens: users are often anxious, sick, or confused. The UX must prioritize clarity, trust, accessibility, and calmness over flashy interactions.

## When to Activate
- When reviewing a PR that introduces new UI flows.
- When designing wireframes or translating requirements into UI.
- When evaluating user feedback indicating confusion.

## Evaluation Checklist

### 1. Anxiety Reduction & Clarity
- **Plain Language:** Is medical jargon avoided where possible? If used, is there a tooltip or simple explanation? (e.g., use "High Blood Pressure" alongside "Hypertension").
- **Clear Next Steps:** Does the user always know exactly what they need to do next? (e.g., "Your lab results are ready. Schedule a follow-up to discuss them.")
- **Calm Aesthetics:** Does the color palette and spacing induce calm? Avoid aggressive use of red unless it's a critical, immediate health warning.

### 2. Trust and Transparency
- **Source Attribution:** Where did this data come from? (e.g., "Last updated from your Apple Watch at 2 PM", "Result from LabCorp").
- **AI Disclaimers:** If AI generated a summary or recommendation, is it clearly marked with a disclaimer? (e.g., "✨ AI Generated Summary. Not medical advice. Always consult your doctor.")
- **Privacy Assurance:** When asking for sensitive data (e.g., SSN, biometric data), is it immediately clear *why* it's needed and how it's protected?

### 3. Mobile-First & Context
- **One-Handed Use:** Can critical flows (like checking in for an appointment) be done mostly with one hand on a mobile device?
- **Environmental Context:** Is contrast high enough to be read outside in bright sunlight or in a dimly lit hospital room?
- **Speed:** Does the UI feel fast even on slow connections? Use optimistic UI updates for non-critical actions (like "liking" an article), but show explicit loading states for critical actions (like paying a bill).

### 4. Error Handling
- **Non-Punitive Errors:** Never blame the user. Instead of "Invalid input", use "Please enter a valid date format (MM/DD/YYYY)".
- **Dead Ends:** Are there any screens where the user is stuck with no way back or forward? Always provide an "escape hatch" (e.g., Back to Home, Contact Support).

## Rules and Constraints
- **Never obscure critical health data** behind complex interactions (e.g., hidden menus or elaborate swipe gestures). It must be readily visible.
- **Distinguish between informational and actionable UI.** A button to "Call 911" must look vastly different from a button to "Read more articles".

## Related Skills
- `accessibility-review`: UX and a11y are deeply intertwined.
- `frontend-design`: Implementing these UX principles in code.
