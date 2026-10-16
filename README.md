# Dentora

Dentora is a dental clinic website and staff dashboard. The first release is scoped to one clinic and one dentist.

The API is JavaScript ES modules and runs directly on Node.js. Angular and the shared contract package remain TypeScript.

## Workspace

- `apps/web` — Angular website.
- `apps/api` — Express REST API.
- `packages/contracts` — shared API request and response types.
- `docs` — architecture and security notes.

## Requirements

- Node.js `24.19.0` (see `.nvmrc`); Angular 22 requires a supported Node release.
- npm `10.8.1`.

Check the versions with `node --version` and `npm --version`. Install dependencies with `npm ci` after checking out the project.

## Development

- The API requires `MONGODB_URI` in development and production. For local API development, copy the root `.env.example` to `.env` and replace the placeholder URI; the API development script loads this root file with Node's built-in `--env-file` support. `.env` is ignored by Git. Never commit its real values; use your hosting platform's secret configuration in deployment. The API tests use `NODE_ENV=test` and intentionally do not require MongoDB.
- PowerShell example (replace placeholders with your own Atlas values; URL-encode special characters in the password): `$env:MONGODB_URI = 'mongodb+srv://<db-user>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority'`.
- Bash example: `export MONGODB_URI='mongodb+srv://<db-user>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority'`.
- Add only your development IP to Atlas Network Access and use a database user with only the permissions needed by the application. Do not allow every IP as a shortcut.
- `npm run dev` starts the API and Angular development server together after `MONGODB_URI` is configured.
- `npm run dev:api` starts only Express at `http://127.0.0.1:3000` after `MONGODB_URI` is configured.
- `npm run dev:web` starts only Angular at `http://localhost:4200`.
- Open `http://localhost:4200`; Angular requests `GET /api/health` through its same-origin development proxy.
- `npm test` runs the API and Angular unit/integration tests.
- `npm run test:e2e` runs the Playwright browser integration test (install the pinned browser first with `npx playwright install chromium` if needed).
- `npm run lint`, `npm run typecheck`, and `npm run build` run linting, TypeScript checks for Angular/shared contracts/tooling, and the workspace builds. The API has no TypeScript compile step; its build script checks JavaScript syntax.
- `npm run check` runs linting, type checks, workspace tests, builds, and the browser integration test.

The API connects to MongoDB through Mongoose before listening, but `GET /api/health` remains a liveness response and does not disclose database or deployment details. Test mode is deliberately database-free. The initial Mongoose schemas cover staff accounts, staff invitations, and password-recovery tokens only. Booking and contact remain demo-only; no patient data is accepted or stored. Indexes are declared by schemas but automatic index creation is disabled.

## Current security scope

The initial backend security foundation adds production-aware origin validation, strict 16 KiB JSON parsing, reusable Zod request validation, request IDs, privacy-limited structured logs, generic categorized errors, tested Helmet headers, and a rate-limit factory that requires an explicit store and failure policy. CORS remains exact-origin and is not an authorization or CSRF control. No feature route has an active production rate limit yet, and the Angular document needs a separate CSP from the API response CSP. This is not a production security assessment. Authentication, sessions, CSRF, authorization, booking, uploads, persistent storage, deployment secrets, proxy/TLS configuration, and operational controls remain outstanding.

See [docs/architecture/overview.md](docs/architecture/overview.md), [docs/security/milestone-1.md](docs/security/milestone-1.md), and [docs/security/backend-foundation.md](docs/security/backend-foundation.md).
