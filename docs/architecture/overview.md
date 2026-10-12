# Dentora architecture overview

## Milestone 1 workspace

Dentora is an npm TypeScript monorepo:

- `apps/web` contains the Angular user interface.
- `apps/api` contains the Express REST API.
- `packages/contracts` contains the small set of API types shared by the web and API workspaces.

The browser calls relative `/api/...` paths. Angular's local development server proxies those requests to Express, so local browser traffic follows the same-origin URL shape planned for deployment. A future hosting platform must still be checked to confirm it can route `/api` to the API service.

The API app is created independently from an HTTP listener so its routes and middleware can be exercised in tests without opening a port. The listener is a separate entry point. The contract package builds to its own output and is consumed through its workspace package name.

## First integration slice

`GET /api/health` returns only a static status marker. Angular renders that response. The route does not inspect a database or disclose infrastructure details.

## Not included yet

No authentication, session, CSRF, patient booking, database persistence, file upload, or deployment configuration is part of this milestone. Those features need their own design, tests, and review.
