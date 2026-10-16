import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { createErrorHandler } from "../src/middleware/error-handler.js";
import { requestContext } from "../src/middleware/request-context.js";
import { validateBody } from "../src/middleware/validate-body.js";
import { createRateLimiter } from "../src/security/rate-limit.js";
function createTestApp(log = () => undefined) {
  const app = express();
  app.use(requestContext(log));
  app.use(express.json({ limit: "16kb", strict: true }));
  return app;
}
class DeterministicStore {
  entries = new Map();
  windowMs = 60_000;
  init(options) {
    this.windowMs = options.windowMs;
  }
  increment(key) {
    const now = Date.now();
    const current = this.entries.get(key);
    const entry =
      !current || current.resetTime.getTime() <= now
        ? { totalHits: 0, resetTime: new Date(now + this.windowMs) }
        : current;
    entry.totalHits += 1;
    this.entries.set(key, entry);
    return { totalHits: entry.totalHits, resetTime: entry.resetTime };
  }
  decrement(key) {
    const entry = this.entries.get(key);
    if (entry) entry.totalHits = Math.max(0, entry.totalHits - 1);
  }
  resetKey(key) {
    this.entries.delete(key);
  }
}
function createLimiterApp(store, storeFailurePolicy, log = () => undefined) {
  const app = createTestApp(log);
  app.use(
    createRateLimiter({
      name: "login",
      limit: 2,
      windowMs: 60_000,
      store,
      storeFailurePolicy,
      log,
    }),
  );
  app.get("/limited", (_request, response) => response.json({ status: "ok" }));
  app.use(createErrorHandler(log));
  return app;
}
describe("request context and safe logging", () => {
  it("adds a server-generated request ID and logs only approved fields", async () => {
    const records = [];
    const app = createTestApp((record) => records.push(record));
    app.post("/private/:recordId", (_request, _response, next) => {
      next(new Error("RAW_EXCEPTION_SECRET"));
    });
    app.use(createErrorHandler((record) => records.push(record)));
    const response = await request(app)
      .post("/private/path-secret?token=query-secret")
      .set("Cookie", "session=cookie-secret")
      .set("Authorization", "Bearer authorization-secret")
      .set("X-Request-Id", "client-controlled-id")
      .send({ password: "body-secret", apiKey: "payload-secret" })
      .expect(500);
    expect(response.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/i);
    expect(response.headers["x-request-id"]).not.toBe("client-controlled-id");
    expect(response.body).toEqual({
      error: {
        code: "INTERNAL_ERROR",
        message: "Request could not be processed.",
      },
    });
    const serialized = JSON.stringify(records);
    for (const secret of [
      "path-secret",
      "query-secret",
      "cookie-secret",
      "authorization-secret",
      "body-secret",
      "payload-secret",
      "RAW_EXCEPTION_SECRET",
      "session=",
      "Bearer",
    ]) {
      expect(serialized).not.toContain(secret);
    }
    expect(records).toContainEqual(
      expect.objectContaining({
        event: "api_error",
        errorCode: "INTERNAL_ERROR",
        statusCode: 500,
      }),
    );
    expect(records).toContainEqual(
      expect.objectContaining({
        event: "http_request",
        method: "POST",
        statusCode: 500,
      }),
    );
  });
});
describe("Zod request validation", () => {
  it("accepts valid input without mutating the untrusted request body", async () => {
    const app = createTestApp();
    const schema = z.strictObject({ displayName: z.string().min(1) });
    app.post("/validated", validateBody(schema), (request, response) => {
      response.json({
        body: request.body,
        validatedBody: response.locals["validatedBody"],
      });
    });
    app.use(createErrorHandler());
    const response = await request(app)
      .post("/validated")
      .send({ displayName: "Alex" })
      .expect(200);
    expect(response.body).toEqual({
      body: { displayName: "Alex" },
      validatedBody: { displayName: "Alex" },
    });
  });
  it("rejects invalid values and unknown fields instead of silently dropping them", async () => {
    const app = createTestApp();
    app.post(
      "/validated",
      validateBody(z.object({ displayName: z.string().min(1) })),
      (_request, response) => response.json({ status: "accepted" }),
    );
    app.use(createErrorHandler());
    const invalidValue = await request(app)
      .post("/validated")
      .send({ displayName: "" })
      .expect(400);
    const unknownField = await request(app)
      .post("/validated")
      .send({ displayName: "Alex", isAdmin: true })
      .expect(400);
    expect(invalidValue.body.error.code).toBe("VALIDATION_ERROR");
    expect(unknownField.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request could not be processed.",
      },
    });
    expect(JSON.stringify(unknownField.body)).not.toContain("isAdmin");
  });
});
describe("rate-limit factory", () => {
  it("rejects unknown policy names at runtime", () => {
    expect(() =>
      createRateLimiter({
        name: "unknown-policy",
        limit: 1,
        windowMs: 1000,
        store: new DeterministicStore(),
        storeFailurePolicy: "fail-closed",
      }),
    ).toThrow("An approved rate-limit policy name is required.");
  });
  it("requires an explicit store and store-failure policy", () => {
    expect(() =>
      createRateLimiter({
        name: "contact",
        limit: 1,
        windowMs: 1000,
        store: undefined,
        storeFailurePolicy: "fail-closed",
      }),
    ).toThrow("An explicit rate-limit store is required.");
    expect(() =>
      createRateLimiter({
        name: "contact",
        limit: 1,
        windowMs: 1000,
        store: new DeterministicStore(),
        storeFailurePolicy: undefined,
      }),
    ).toThrow("A rate-limit store failure policy must be selected.");
  });
  it("enforces the configured quota and returns a generic 429 response", async () => {
    const app = createLimiterApp(new DeterministicStore(), "fail-closed");
    await request(app).get("/limited").expect(200);
    await request(app).get("/limited").expect(200);
    const limited = await request(app).get("/limited").expect(429);
    expect(limited.body).toEqual({
      error: {
        code: "RATE_LIMITED",
        message: "Request could not be processed.",
      },
    });
    expect(limited.headers["ratelimit"]).toBeDefined();
    expect(limited.headers["x-ratelimit-limit"]).toBeUndefined();
  });
  it("fails closed with a generic categorized response when the store fails", async () => {
    const records = [];
    const failingStore = {
      increment: async () => {
        throw new Error("RAW_STORE_SECRET");
      },
      decrement: () => undefined,
      resetKey: () => undefined,
    };
    const app = createLimiterApp(failingStore, "fail-closed", (record) =>
      records.push(record),
    );
    const response = await request(app).get("/limited").expect(503);
    expect(response.body).toEqual({
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Request could not be processed.",
      },
    });
    expect(JSON.stringify(records)).not.toContain("RAW_STORE_SECRET");
    expect(records).toContainEqual({
      event: "rate_limit_store_failure",
      policy: "login",
    });
    expect(records).toContainEqual(
      expect.objectContaining({
        event: "api_error",
        errorCode: "RATE_LIMIT_STORE_UNAVAILABLE",
        statusCode: 503,
      }),
    );
  });
  it("does not use a store whose initialization failed", async () => {
    const records = [];
    let incrementCalls = 0;
    const initializationFailureStore = {
      init: async () => {
        throw new Error("RAW_INIT_SECRET");
      },
      increment: () => {
        incrementCalls += 1;
        return { totalHits: 1, resetTime: new Date(Date.now() + 60_000) };
      },
      decrement: () => undefined,
      resetKey: () => undefined,
    };
    const app = createLimiterApp(
      initializationFailureStore,
      "fail-closed",
      (record) => records.push(record),
    );
    const response = await request(app).get("/limited").expect(503);
    expect(response.body.error.code).toBe("SERVICE_UNAVAILABLE");
    expect(incrementCalls).toBe(0);
    expect(JSON.stringify(records)).not.toContain("RAW_INIT_SECRET");
    expect(records).toContainEqual({
      event: "rate_limit_store_failure",
      policy: "login",
    });
  });
  it("fails open only when explicitly selected and records a safe store-failure event", async () => {
    const records = [];
    const failingStore = {
      increment: async () => {
        throw new Error("RAW_STORE_SECRET");
      },
      decrement: () => undefined,
      resetKey: () => undefined,
    };
    const app = createLimiterApp(failingStore, "fail-open", (record) =>
      records.push(record),
    );
    await request(app).get("/limited").expect(200);
    expect(records).toContainEqual({
      event: "rate_limit_store_failure",
      policy: "login",
    });
    expect(JSON.stringify(records)).not.toContain("RAW_STORE_SECRET");
  });
});
