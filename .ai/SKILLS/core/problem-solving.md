---
name: problem-solving
description: Systematic problem analysis and resolution methodology
---

# Problem Solving Methodology

## Overview
This skill provides a structured approach for investigating bugs, resolving incidents, and untangling complex technical issues within the Medivo platform. Due to the high stakes of health software, problem-solving must be thorough, documented, and focused on root causes rather than quick fixes.

## When to Activate
- When a bug report is received, especially if it involves data integrity or user access.
- When an unexpected system behavior or crash occurs.
- When you are stuck trying to implement a complex feature.

## Step-by-Step Procedure

### 1. Replicate and Isolate
- **Replicate:** Attempt to reproduce the issue locally or in a staging environment. If you can't reproduce it, you can't fix it reliably.
- **Isolate:** Narrow down the scope. Does this happen on all browsers? For all users? In all domains, or just the `Billing` module?
- **Binary Search Debugging:** If a feature used to work and now doesn't, use `git bisect` or conceptually halve the codebase/data pipeline to isolate the failing component.

### 2. Gather Context & Data
- Check application logs (Server, BFF, Client).
- Check the Database (Are the records actually missing/corrupt?).
- Check the network tab (Is the API returning an error, or is the frontend failing to render it?).
- **Health Context:** Does this issue involve PHI? If so, follow strict data handling protocols (e.g., do not paste real PHI into slack or issue trackers).

### 3. Root Cause Analysis (RCA)
Ask "Why?" multiple times (The 5 Whys technique) until you reach the fundamental flaw.
- *Issue:* Patient cannot see their lab result.
- *Why?* The API returned 404.
- *Why?* The query in the BFF used the wrong patient ID format.
- *Why?* The frontend passed a string instead of a UUID.
- *Why?* Zod validation was missing on the BFF endpoint for that specific parameter.
- *Root Cause:* Missing input validation at the API boundary.

### 4. Propose Solutions
Identify potential fixes. Often there is a "quick fix" (patch) and a "real fix" (architectural correction).
- In a health application, prefer the "real fix" unless it's a critical production outage that requires an immediate patch (followed by the real fix).

### 5. Verify & Implement
- Write a failing test that reproduces the bug.
- Apply the fix.
- Ensure the test now passes.
- Check for regressions in related areas.

## Rules and Constraints
- **Do not guess.** Prove your hypothesis with logs, tests, or debugger output.
- **Data Integrity First:** If a bug corrupted data, the fix must include a data migration or correction script.
- **Blameless Culture:** Focus on fixing the system (e.g., missing validation, lack of tests) rather than blaming the author.

## Inputs/Outputs
- **Input:** A description of a bug or unexpected behavior.
- **Output:** A confirmed root cause, a proposed fix, and an automated test preventing regression.

## Related Skills
- `debugging`: For the tactical, code-level execution of finding the bug.
- `testing`: To write the regression test.
