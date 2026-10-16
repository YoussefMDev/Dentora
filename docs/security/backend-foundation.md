# Backend security foundation

This document records the security behaviors implemented in the backend foundation milestone. It is not a production-readiness statement.

## Configuration and secrets

- Local development keeps the existing `API_PORT` and `WEB_ORIGIN` defaults.
- Production startup requires an explicit exact `WEB_ORIGIN` and requires its scheme to be HTTPS. Configuration errors contain fixed messages and do not print environment values.
- `MONGODB_URI` is required for development and production API startup and is never included in configuration errors. Use shell environment variables locally and the selected hosting platform's secret manager in deployment. `.env` files remain ignored; do not commit credentials or put them in Angular configuration or logs. Explicit `NODE_ENV=test` may omit the URI because tests do not connect to a database.
- The API still binds to the existing local address. Host binding, TLS termination, and trusted proxy settings need a hosting-specific review before deployment.

## Parsing and validation

- JSON parsing remains strict and limited to 16 KiB.
- Malformed JSON and oversized bodies return generic 400 and 413 responses.
- Request schemas use Zod at runtime. The API is JavaScript; static types in the Angular/contracts workspaces do not validate network input.
- Object schemas must use `z.strictObject(...)` at every object level where unknown keys must be rejected. The validation middleware does not modify `request.body`; handlers read the parsed value from `response.locals['validatedBody']`. Any trimming, coercion, defaults, or transformations must be intentional in the schema and covered by tests.
- Validation errors return a generic message without field values or schema details.

## Headers and CORS

- Helmet's configured defaults are applied to API responses and tested by inspecting actual header values, including CSP directives.
- The API CSP applies to API responses. It does not set the policy for Angular's `index.html` when Angular is served by a separate development server or hosting service. The hosting path that serves the Angular document must define and test its own CSP before production.
- CORS continues to allow only the configured exact origin for the existing read methods, with credentials disabled. Requests from other origins may still reach and be processed by the API; browsers use CORS headers to decide whether JavaScript can read the response. CORS is not authentication, authorization, or CSRF protection.
- Same-origin `/api` deployment remains preferred. Hosting must be checked before changing CORS, cookie, or proxy behavior.

## Request logs and errors

- Each request receives a server-generated UUID in `X-Request-Id`; client-supplied request IDs are not trusted.
- Structured access logs include only the request ID, method, status, and duration. Error logs include the request ID, status, and a stable error category. Rate-limit store failures include only the named policy.
- Logs do not include request paths, query strings, bodies, cookies, authorization headers, raw exception text, or secrets. Logging sink failures are swallowed so they cannot break request handling.
- API errors keep generic messages. Server logs retain safe categories such as malformed JSON, validation failure, and rate-limit store failure.

## Rate-limit foundation and limitations

- Named policy categories exist for login, invitation, password recovery, booking, and contact. No feature endpoint is rate-limited yet, and this milestone does not assign production quotas.
- The limiter factory requires an explicit store, window, request limit, and store failure policy. It never relies on the package's default in-memory store.
- Tests inject a deterministic store only for test execution. A process-local test store is not suitable evidence for multi-instance production behavior.
- Store failure must be explicitly selected per protected endpoint before production activation. `fail-closed` returns a generic 503 and prevents the request from proceeding. `fail-open` allows the request to continue without the quota, while logging only a safe failure event. The right choice depends on the endpoint's availability and abuse risk; it remains a deployment/release decision.
- Client IP rate limiting is not reliable behind a proxy until the hosting topology and exact trusted proxy configuration are known. Do not enable `trust proxy` broadly.

## Still outstanding

Authentication, server-managed sessions, CSRF, Admin/Staff authorization, MFA, account recovery and invitation flows, route-specific schemas and quotas, booking, uploads, patient data, audit events, production secret-management integration, HTTPS/proxy setup, operational monitoring, and deployment are not implemented here. Mongoose schemas now describe staff accounts, invitations, and recovery tokens, but no workflow uses them; schema validation alone does not enforce authorization, token expiry, single use, or unique indexes on Atlas. The database connection and model definitions do not mean production readiness. Each future feature needs its own threat review and behavior-based tests. Dependency audit results are point-in-time checks, not a guarantee that dependencies remain vulnerability-free.
