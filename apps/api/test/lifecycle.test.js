import express from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { startApi } from "../src/lifecycle.js";
const runtimes = [];
afterEach(async () => {
  await Promise.all(runtimes.splice(0).map((runtime) => runtime.shutdown()));
});
describe("API lifecycle", () => {
  it("connects before listening and keeps the health endpoint available", async () => {
    const events = [];
    const close = vi.fn(async () => {
      events.push("close");
    });
    const connection = { close };
    const runtime = await startApi(
      {
        port: 0,
        webOrigin: "http://localhost:4200",
        environment: "development",
        mongoUri: "mongodb://localhost/dentora",
      },
      {
        connectDatabase: async () => {
          events.push("connect");
          return connection;
        },
        buildApp: () => {
          events.push("app");
          const app = express();
          app.get("/api/health", (_request, response) =>
            response.json({ status: "ok" }),
          );
          return app;
        },
      },
    );
    runtimes.push(runtime);
    expect(events).toEqual(["connect", "app"]);
    expect(runtime.databaseConnection).toBe(connection);
    const address = runtime.server.address();
    expect(address).not.toBeNull();
    if (!address || typeof address === "string") {
      throw new Error("Expected the local API listener to have a TCP address.");
    }
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
    expect(events).toEqual(["connect", "app"]);
    await runtime.shutdown();
    await runtime.shutdown();
    expect(close).toHaveBeenCalledTimes(1);
  });
  it("does not start listening when the database connection fails", async () => {
    const buildApp = vi.fn(() => express());
    await expect(
      startApi(
        {
          port: 0,
          webOrigin: "http://localhost:4200",
          environment: "development",
          mongoUri: "mongodb://localhost/dentora",
        },
        {
          connectDatabase: async () => {
            throw new Error("private connection details");
          },
          buildApp,
        },
      ),
    ).rejects.toThrow("Check required configuration and MongoDB connectivity.");
    expect(buildApp).not.toHaveBeenCalled();
  });
  it("does not connect to MongoDB in the explicit test configuration", async () => {
    const connectDatabase = vi.fn();
    const runtime = await startApi(
      {
        port: 0,
        webOrigin: "http://localhost:4200",
        environment: "test",
        mongoUri: "mongodb://ignored.test/dentora",
      },
      { connectDatabase },
    );
    runtimes.push(runtime);
    expect(connectDatabase).not.toHaveBeenCalled();
  });
});
