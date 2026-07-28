---
name: research
description: Research methodology for evaluating technologies, patterns, and approaches
---

# Research Methodology

## Overview
This skill defines how to systematically evaluate new tools, libraries, or architectural patterns before integrating them into the Medivo platform. Given the enterprise nature of the project, choices must be deliberate, secure, and maintainable.

## When to Activate
- When deciding between multiple libraries (e.g., Zustand vs. Redux).
- When a new requirement cannot be met by the current tech stack.
- When investigating the root cause of a complex architectural limitation.
- Before proposing a new Architecture Decision Record (ADR).

## Step-by-Step Procedure

### 1. Define the Evaluation Criteria
Before looking at solutions, define what matters. Standard Medivo criteria include:
- **Security & Compliance:** Does it handle data safely? Is it HIPAA compliant (if a SaaS)?
- **Bundle Size / Performance:** Will it slow down the PWA?
- **TypeScript Support:** Does it have excellent, strict type definitions?
- **Community & Maintenance:** Is it actively maintained? 
- **Alignment with Stack:** Does it play well with Next.js, React, Node, Postgres?

### 2. Gather Candidates
Identify 2-3 viable options. Avoid expanding the scope to too many niche tools. Stick to industry standards where possible.

### 3. Conduct the Analysis
For each candidate, evaluate against the criteria.
- Read official documentation.
- Check bundlephobia.com (for frontend libs).
- Review open GitHub issues for red flags (e.g., memory leaks, dead development).

### 4. Proof of Concept (POC) - If necessary
For critical decisions, write a small, isolated POC in the `scratch/` directory.
- Test the hardest requirement first.
- Evaluate developer ergonomics (how easy is it to write tests for it?).

### 5. Document the Recommendation
Format the findings into a clear recommendation, often serving as the draft for an ADR.
- State the winner.
- List the Trade-offs.
- Provide a minimal implementation example.

## Rules and Constraints
- **Bias towards zero dependencies:** Don't add a library for something easily written in vanilla TS.
- **Avoid "Magic":** Prefer explicit libraries over ones that abstract too much and obscure the underlying logic, especially for data fetching or state.
- **Security First:** Any third-party SaaS or database tool must be vetted for enterprise security standards.

## Inputs/Outputs
- **Input:** A problem statement requiring a technical choice.
- **Output:** A comparative analysis document, potentially leading to an ADR.

## Related Skills
- `planning`: Research often precedes planning.
- `security-review`: Crucial part of the evaluation criteria.

## Examples
*Researching State Management:*
Goal: Need global state for the patient PWA.
Candidates: Context API, Redux Toolkit, Zustand.
Analysis: Context causes too many re-renders. Redux is robust but has high boilerplate. Zustand is lightweight, TS-first, and fits our "bias towards simplicity" while scaling well.
Recommendation: Zustand.
