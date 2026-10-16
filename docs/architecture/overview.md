# Dentora architecture overview

## Milestone 1 workspace

Dentora is an npm monorepo with TypeScript for the frontend/contracts and JavaScript ES modules for the API:

- `apps/web` contains the Angular user interface.
- `apps/api` contains the Express REST API, which runs directly on Node.js without a TypeScript runtime loader or compile step.
- `packages/contracts` contains the health response's runtime Zod schema and inferred TypeScript type. Angular consumes the type; the JavaScript API consumes the runtime schema.

The browser calls relative `/api/...` paths. Angular's local development server proxies those requests to Express, so local browser traffic follows the same-origin URL shape planned for deployment. A future hosting platform must still be checked to confirm it can route `/api` to the API service.

The API app is created independently from an HTTP listener so its routes and middleware can be exercised in tests without opening a port. The listener is a separate entry point. The contract package builds ESM JavaScript and TypeScript declarations to its own output and is consumed through its workspace package name.

## First integration slice

`GET /api/health` returns only a static status marker. Angular renders that response. The route does not inspect a database or disclose infrastructure details.

## MongoDB connection and initial model foundation

- Development and production API startup require `MONGODB_URI`. The URI is validated without echoing its value in configuration errors.
- Mongoose is the sole database connection layer. The API connects before binding its HTTP listener and disables automatic index creation. There is no separate Native Driver connection or client lifecycle.
- If connection or listener startup fails, startup stops with a generic message. A partially opened listener and Mongoose connection are closed on failure.
- `SIGINT` and `SIGTERM` trigger graceful shutdown: stop accepting requests, allow active connections up to the existing 10-second drain period, then disconnect Mongoose.
- `NODE_ENV=test` intentionally permits no database URI so API behavior and browser integration tests remain deterministic and do not need Atlas credentials. This exception is limited to explicit test mode.
- The health endpoint remains a liveness check. It does not prove database readiness and does not reveal infrastructure details. A readiness contract should be designed with the deployment platform before it is added.
- Initial schemas describe staff accounts, staff invitations, and password-recovery tokens. They do not add routes or workflows and do not create collections or indexes on Atlas. See `docs/architecture/data-models.md` for fields and deferred entities.
- Booking and contact remain frontend demos and do not persist patient or message data. Gallery media rules and clinic schedule persistence are not settled, so they remain outside these schemas.

## Not included yet

No authentication, session, CSRF, patient booking persistence, contact persistence, file upload, or deployment configuration is part of this milestone. The security-related schemas are groundwork only: they do not enforce authentication, invitation use, token expiry, authorization, MFA, or session revocation. Those workflows need their own implementation, tests, and review.
