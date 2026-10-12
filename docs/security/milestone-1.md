# Security scope: Milestone 1

## Implemented in this milestone

- Request body size limits and a JSON parser error response that does not expose stack traces.
- Helmet security response headers, exercised through HTTP response tests.
- CORS configured from an exact allowed origin; tests inspect actual response headers for allowed and unapproved origins.
- A generic error handler and a health response that disclose no secrets or infrastructure details.
- `.gitignore` rules for local environment files and generated artifacts.

## Still required before real patient data or production

- Staff authentication, secure shared session storage, session expiry/revocation, and Admin MFA.
- Server-verified CSRF and appropriate Origin checks for cookie-authenticated state changes.
- Explicit Admin/Staff authorization on every protected API operation.
- Endpoint-specific rate limits and abuse controls.
- Validated booking rules, idempotency, concurrency-safe slot confirmation, and secure status lookup.
- Verified-email invitations and recovery with single-use, expiring tokens and session revocation after password reset.
- Upload validation, access control, private image storage, retention, and patient-consent process before Gallery uploads.
- Production secret management, deployment HTTPS/proxy configuration, monitoring, backups, and operational access controls.
- Security review and tests for every feature above.

Middleware presence alone does not demonstrate that a system is secure. This document records the current scope and does not assert production readiness.

The follow-up backend security foundation is documented in [backend-foundation.md](backend-foundation.md); it adds validation, safe request logging, and an explicit-store rate-limit factory while leaving feature routes and deployment controls outstanding.
