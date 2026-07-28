---
name: brainstorm
description: Structured brainstorming methodology for health platform features
---

# Brainstorming Methodology

## Overview
This skill defines the structured approach to ideating, expanding, and refining features and technical solutions for the Medivo Health Intelligence Platform. Given the sensitive nature of healthcare, brainstorming must balance innovation with safety, compliance, and user trust.

## When to Activate
- When a new feature is requested but poorly defined.
- When facing a complex architectural decision with multiple viable paths.
- When designing user flows that involve sensitive medical data.
- When looking for innovative ways to integrate AI into existing health workflows.

## Step-by-Step Procedure

### 1. Context Gathering & Problem Definition
- **Define the Persona:** Who is this for? (e.g., elderly patient, busy physician, billing admin).
- **State the Problem:** What exact pain point are we solving? 
- **Identify Constraints:** What are the strict medical, legal (HIPAA/GDPR), or technical constraints?

### 2. Divergent Thinking (Ideation)
Generate ideas without immediate judgment. Use frameworks like:
- **"How Might We" (HMW):** Reframe problems as opportunities. (e.g., "How might we make lab results easier for a non-medical person to understand without causing anxiety?")
- **AI-First Lens:** Ask, "If an AI was managing this entirely, what would the experience look like?" Then scale back to a safe, human-in-the-loop version.
- **Cross-Industry Inspiration:** How do finance apps handle sensitive data? How do fitness apps motivate users?

### 3. Convergent Thinking (Refinement)
Filter and combine ideas based on the project principles.
- **Categorize:** Group similar ideas.
- **Evaluate against Core Principles:**
  - *Is it AI First?*
  - *Is it Mobile First?*
  - *Is it Secure By Design?*

### 4. Health-Domain Validation
Apply the critical healthcare filter:
- **Do No Harm:** Could this feature give dangerous advice or misinterpret data?
- **Trust & Transparency:** Will the user understand *why* the system made a recommendation?
- **Data Minimization:** Does this idea require more data than is absolutely necessary to solve the problem?

### 5. Output Generation
Structure the final ideas into a proposal document outlining:
- The core concept.
- User flow sketch.
- Required data/APIs.
- Risk assessment (clinical and technical).

## Rules and Constraints
- **Never suggest fully autonomous medical diagnosis.** All AI features must act as an *assistant* (human-in-the-loop) or provide *information*, not medical advice.
- **Prioritize clarity over cleverness.** Health UI must be instantly understandable.
- **Assume high anxiety.** Medical information often causes stress. Features should be designed to inform calmly.

## Related Skills
- `planning`: To turn the chosen idea into an executable plan.
- `ux-review`: To ensure the brainstormed idea meets health UI standards.
- `security-review`: To vet the idea for data privacy implications.

## Examples
*Input:* Brainstorm a feature to help patients prepare for an upcoming specialist appointment.
*Output Process:* Focus on reducing no-shows and maximizing the short 15-minute doctor visit. *Idea:* An AI chatbot that interviews the patient 3 days prior, summarizes their symptoms, and generates a structured 1-page report for the doctor, while giving the patient a checklist of what to bring.
