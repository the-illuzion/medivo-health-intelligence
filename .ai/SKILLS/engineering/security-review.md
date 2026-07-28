---
name: security-review
description: Security audit and hardening guidelines for the health platform
---

# Security Review Guidelines

## Overview
Security in Medivo is paramount. As a health intelligence platform, we handle Protected Health Information (PHI) and Personally Identifiable Information (PII). We must adhere to strict principles of least privilege, data minimization, and secure design. A breach here is not just a technical failure; it has severe legal and personal consequences.

## When to Activate
- During any PR that touches authentication, authorization, or user data.
- When designing APIs or data storage schemas.
- Before deploying a new external integration (especially AI providers).
- When configuring infrastructure security groups or IAM roles.

## OWASP Top 10 for Health Platforms & Mitigations

1. **Broken Access Control (IDOR):** The biggest risk. A patient changing an ID in a URL (`/api/labs/123` -> `/api/labs/124`) to see another's data.
   - *Mitigation:* Every single endpoint returning specific records MUST verify the requesting user's UUID against the resource owner's UUID in the database.
2. **Cryptographic Failures:** Exposing PHI due to weak encryption.
   - *Mitigation:* TLS 1.3 everywhere. AES-256-GCM for application-level encryption of highly sensitive fields (SSN, specific diagnoses) at rest.
3. **Injection (SQL/NoSQL/Command):**
   - *Mitigation:* Use parameterized queries universally via our chosen ORM/Query Builder. Never concatenate user input into SQL strings. Validate all input with Zod.
4. **Insecure Design:** Lack of threat modeling for healthcare flows.
   - *Mitigation:* Require security review during the `planning` phase for new domains. Implement strict Role-Based Access Control (RBAC).
5. **Security Misconfiguration:** Default passwords, open cloud buckets.
   - *Mitigation:* Infrastructure as Code (Terraform). AWS S3 buckets must be private by default. Block public access at the account level.
6. **Vulnerable and Outdated Components:**
   - *Mitigation:* Automated weekly dependency scanning (Dependabot/Snyk). Immediate patching of critical CVEs.
7. **Identification and Authentication Failures:** Weak passwords, session hijacking.
   - *Mitigation:* Enforce strong passwords (zxcvbn library). Multi-Factor Authentication (MFA) mandatory for all Providers and Admins. Use secure, HttpOnly cookies for web sessions.
8. **Software and Data Integrity Failures:** Malicious CI/CD pipelines, untrusted AI models.
   - *Mitigation:* Signed commits. CI/CD pipeline requires explicit approvals. Strict validation of AI model outputs before presenting to users.
9. **Security Logging and Monitoring Failures:** Inability to detect a breach.
   - *Mitigation:* Comprehensive audit trails (see below). Alerting on anomalous behavior (e.g., a patient downloading 100 lab reports in a minute).
10. **Server-Side Request Forgery (SSRF):** Forcing the backend to make internal network requests.
    - *Mitigation:* Strictly validate URLs provided by users (e.g., for webhook integrations). Use an egress proxy with a whitelist.

## Health Data Encryption Requirements
- **At Rest:** Database volumes must be encrypted (e.g., AWS KMS). Highly sensitive columns (SSN, payment info) must have application-level encryption applied *before* database insertion using a robust library (e.g., Tink or native Node `crypto` with AES-256-GCM).
- **Key Management:** Encryption keys must NEVER be stored in the codebase. Use a managed service like AWS Secrets Manager or HashiCorp Vault. Rotate keys annually.

## Consent Management Flow
Processing health data, especially sending it to AI models, requires explicit consent.
1. **Granular Consent:** Users must opt-in to specific data usages (e.g., "Allow AI to analyze lab results for insights" vs "Allow sharing anonymized data for research").
2. **Verification:** Before the Application layer sends data to an AI provider, it must query the `ConsentRepository` to verify the user has an active, valid consent flag for that specific action.
3. **Revocation:** Users must have a single-click way to revoke consent, which must immediately halt subsequent processing pipelines.

## JWT Token Structure and Validation
If using JWTs for stateless auth (common in mobile clients or internal microservices):
- **Algorithm:** Use asymmetric encryption (RS256) where the Auth server holds the private key and resource servers use the public key to verify.
- **Payload:** Include `sub` (User UUID), `exp` (Short expiration, e.g., 15 mins), and `roles`. **NEVER include PHI in the token payload.**
- **Validation:** Check signature, expiration, and issuer on *every* request. Use refresh tokens for long-lived sessions, stored securely (HttpOnly cookies or Secure Enclave).

## Rate Limiting Configuration
- **Authentication Endpoints:** Strict limits (e.g., 5 attempts per 15 minutes per IP) to prevent brute force.
- **API Endpoints (BFF):** Standard limits (e.g., 100 requests per minute per user UUID) to prevent abusive scraping.
- **AI Endpoints:** Aggressive limits (e.g., 10 generations per hour per user) to control API costs and prevent abuse of expensive LLM models.

## Logging Sanitization (CRITICAL)
- **Rule:** Passwords, API keys, Authorization headers, and raw PHI (names linked with diagnoses) must NEVER enter the central logging system (Datadog, CloudWatch).
- **Implementation:** Use a logging middleware that redacts sensitive fields from request payloads and response bodies before emitting the log line.
