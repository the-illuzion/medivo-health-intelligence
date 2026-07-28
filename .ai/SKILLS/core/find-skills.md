---
name: find-skills
description: How to discover and select relevant skills from the registry
---

# Find Skills

## Overview
This skill guides the process of identifying which specialized skills (instructions) should be applied to a given task within the Medivo project. It ensures that the right architectural principles, security guidelines, and coding standards are applied contextually.

## When to Activate
- At the beginning of any new task or user request.
- When transitioning from one phase of development to another (e.g., moving from UI design to backend implementation).
- When a task touches multiple domains (e.g., building a feature that requires both database changes and frontend updates).

## Step-by-Step Procedure

### 1. Analyze the Request
Break down the user's prompt into core components:
- What is the primary goal? (e.g., build a UI, fix a bug, design a database).
- What layers of the stack are involved? (Frontend, Backend, Database, Infrastructure).
- Does this involve sensitive data or AI integration?

### 2. Consult the Registry
Review `.ai/SKILLS/registry.yaml` to match the analyzed components with available skills.

### 3. Task -> Skill Mapping Rules
Apply these heuristics to select skills:
- **If creating a new feature:** `brainstorm` -> `planning` -> `frontend-design` -> `backend-development`
- **If touching the UI:** Always include `ux-review` and `accessibility-review`.
- **If modifying the database:** Always include `database-design`.
- **If writing backend logic:** Always include `backend-development` and `testing`.
- **If dealing with user data or auth:** Always include `security-review`.
- **If investigating an issue:** `problem-solving` -> `debugging`.
- **If the app is slow:** `performance-analysis`.

### 4. Prioritization
If multiple skills apply, prioritize them in this order:
1. **Security** (`security-review`): Non-negotiable for health data.
2. **Architecture** (`frontend-design`, `backend-development`, `database-design`): Foundation must be solid.
3. **Quality** (`testing`, `accessibility-review`): Ensures it works for everyone.
4. **Execution** (`planning`, `problem-solving`): The process of doing the work.

### 5. Application
Once skills are identified, read their specific markdown files to internalize their constraints before executing the task.

## Rules and Constraints
- Never skip `security-review` if the task involves Personal Health Information (PHI).
- Always default to applying Clean Architecture rules via `backend-development` when writing business logic.
- Do not apply `design-system` rules to feature code; use `frontend-design` instead.

## Related Skills
- This skill relates to all other skills in the registry as it acts as the router.

## Examples
*Scenario:* User asks: "Create an endpoint to fetch a user's recent lab results and display them in a chart on the dashboard."
*Skills identified:*
1. `backend-development`: To build the API endpoint following clean architecture.
2. `database-design`: To ensure the query is optimized and respects schema boundaries.
3. `security-review`: To ensure only the authorized user can see these results.
4. `frontend-design`: To structure the dashboard component.
5. `accessibility-review`: To ensure the chart is readable by screen readers or has a tabular data alternative.
