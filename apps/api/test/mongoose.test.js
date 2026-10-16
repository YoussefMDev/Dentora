import { describe, expect, it, vi } from "vitest";
import {
  connectMongoose,
  DatabaseConnectionError,
} from "../src/database/mongoose.js";

describe("Mongoose connection helper", () => {
  it("opens one Mongoose connection without automatically creating indexes", async () => {
    const connection = { readyState: 1 };
    const connect = vi.fn().mockResolvedValue(undefined);
    const disconnect = vi.fn().mockResolvedValue(undefined);
    const instance = { connect, disconnect, connection };

    const result = await connectMongoose(
      "mongodb://example.test/dentora",
      instance,
    );

    expect(connect).toHaveBeenCalledTimes(1);
    expect(connect).toHaveBeenCalledWith("mongodb://example.test/dentora", {
      autoIndex: false,
    });
    expect(result.connection).toBe(connection);
    await result.close();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("sanitizes connection errors and attempts to close a failed connection", async () => {
    const connect = vi
      .fn()
      .mockRejectedValue(new Error("private-password leaked"));
    const disconnect = vi.fn().mockResolvedValue(undefined);
    const instance = { connect, disconnect, connection: {} };

    let caught;
    try {
      await connectMongoose(
        "mongodb://user:private-password@example.test/db",
        instance,
      );
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(DatabaseConnectionError);
    expect(String(caught)).not.toContain("private-password");
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
