# Dentora

Dentora is a dental clinic website and staff dashboard. The first release is scoped to one clinic and one dentist.

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

- `npm run dev` starts the API and Angular development server together.
- `npm run dev:api` starts only Express at `http://127.0.0.1:3000`.
- `npm run dev:web` starts only Angular at `http://localhost:4200`.
- Open `http://localhost:4200`; Angular requests `GET /api/health` through its same-origin development proxy.
- `npm test` runs the API and Angular unit/integration tests.
- `npm run test:e2e` runs the Playwright browser integration test (install the pinned browser first with `npx playwright install chromium` if needed).
- `npm run lint`, `npm run typecheck`, and `npm run build` run linting, type checks, and builds.
- `npm run check` runs linting, type checks, workspace tests, builds, and the browser integration test.

The API health response contains no database or deployment information. This milestone does not accept or store patient data.

## Current security scope

Milestone 1 configures request size limits, JSON parsing errors, Helmet headers, exact-origin CORS, and safe generic error responses. Automated tests exercise these behaviors. This is a development foundation, not a production security assessment. Authentication, sessions, CSRF, authorization, endpoint-specific rate limits, booking, uploads, persistent storage, production secrets, and deployment controls remain outstanding.

See [docs/architecture/overview.md](docs/architecture/overview.md) and [docs/security/milestone-1.md](docs/security/milestone-1.md).
