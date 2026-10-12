# Dentora — Project Instructions

## 1. Project Overview
Dentora is a modern dental clinic website intended to be both a portfolio project and a foundation for a real product for international clinics.

Stack:
- Frontend: Angular + TypeScript
- Backend: Node.js + Express
- Database: MongoDB
- API: REST
- Language of the product UI: English

## 2. Product Decisions
- One clinic and one dentist for the initial release.
- The public website includes Home, About, Services, Service Details, Smile Gallery, Book Appointment, Booking Status, and Contact.
- The booking process has four steps: Service, Date & Time, Patient Details, and Review & Submit.
- New appointment requests start as Pending and require manual confirmation by clinic staff.
- The Gallery is part of the MVP.
- The Admin Dashboard uses top navigation.
- Staff accounts are created through secure invitations. No public staff signup.
- Roles initially include Admin and Staff.
- Use clearly labeled demo content. Never fabricate real credentials, testimonials, patient consent, or treatment results.

## 3. Design System
- Deep Navy: #142B46
- Electric Lime: #C7F36B
- Warm Off-white: #F7F8F5
- Use responsive layouts, accessible typography, consistent spacing, clear focus states, and restrained animations.
- Support mobile, tablet, and desktop.
- Respect reduced-motion preferences.
- Follow WCAG 2.2 AA as a target.

## 4. Development Workflow
- Read the project documentation before making changes.
- Start each task by stating the intended changes and affected files.
- Work in small, reviewable increments.
- Do not implement the entire application in one task.
- Do not introduce a new library or major architecture change without explaining the reason first.
- Run relevant tests, linting, type checks, and builds after changes.
- Report exactly which checks passed and which failed. Never claim a test passed unless it was run.
- Explain important implementation decisions in beginner-friendly language.
- Keep documentation updated when architecture, APIs, or security behavior changes.
- Do not overwrite unrelated work or perform destructive operations without approval.

## 5. Security Is a Release Requirement
Treat security as a requirement from the beginning, not as a final cleanup task.

Backend requirements:
- Validate and normalize all untrusted inputs on the server.
- Enforce authentication and authorization on every protected API endpoint.
- Apply least privilege and deny access by default.
- Implement endpoint-specific rate limiting and abuse protection.
- Use secure password hashing and secure session management.
- Protect cookie-authenticated state-changing requests against CSRF.
- Configure exact allowed CORS origins; never use permissive credentialed CORS.
- Use secure HTTP headers, HTTPS in deployment, and an appropriate Content Security Policy.
- Prevent NoSQL injection, unsafe query construction, mass assignment, and insecure object-level access.
- Limit request sizes and file upload types/sizes.
- Protect invitation and account recovery tokens using secure random generation, expiry, single-use validation, and safe storage.
- Never expose secrets, stack traces, passwords, session tokens, or sensitive patient data in responses or logs.
- Use environment variables or an appropriate secrets manager for secrets.
- Audit sensitive admin actions.
- Check dependencies for known vulnerabilities.
- Add security tests for authentication, authorization, booking, invitation, validation, and abuse cases.

Frontend requirements:
- Use Angular's built-in template escaping and safe rendering practices.
- Avoid unsafe HTML insertion and bypassing Angular sanitization unless specifically justified and reviewed.
- Do not store passwords, session identifiers, or sensitive authentication tokens in localStorage.
- Do not treat hidden UI elements or client-side route guards as authorization.
- Handle loading, error, empty, unauthorized, and expired-session states.
- Do not expose server secrets or internal stack traces in frontend bundles.
- Validate user experience on the client, but always repeat security-relevant validation on the server.
- Prevent accidental double submissions and show trustworthy booking status.

## 6. Security Design Must Be Explicit
Before implementing authentication, sessions, CSRF, CORS, uploads, or invitation flows:
1. Explain the proposed design.
2. State the threat it addresses.
3. Explain relevant trade-offs.
4. Identify required frontend and backend coordination.
5. Propose tests that demonstrate the protection works.

Do not claim the application is secure merely because middleware is installed. Verify its configuration and behavior.

## 7. Booking Rules
- A booking request is Pending until staff confirms it.
- Re-check slot availability on the server when a request is submitted and when staff confirms it.
- Prevent conflicting confirmed appointments with appropriate concurrency-safe logic.
- Do not expose private appointment details through predictable IDs or public APIs.
- Avoid duplicate bookings when a request times out or a user retries.
- Do not collect unnecessary medical information.

## 8. Definition of Done
A task is not complete until:
- The implementation matches the approved requirements.
- Relevant tests and checks have been run.
- Security implications have been reviewed.
- Error and loading states have been considered.
- No secrets or real patient data are committed.
- The implementation and any limitations are explained clearly.

## 9. Working Agreement
Act as a senior engineer who helps a junior developer learn. Make changes, but also explain what was changed, why it was needed, how to verify it, and what risks remain. Ask before making major architectural or security trade-offs.