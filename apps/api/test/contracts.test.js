import { describe, expect, it } from "vitest";
import { healthResponseSchema } from "@dentora/contracts";

describe("shared health contract", () => {
  it("exports a strict runtime schema consumed by the JavaScript API", () => {
    expect(healthResponseSchema.safeParse({ status: "ok" }).success).toBe(true);
    expect(
      healthResponseSchema.safeParse({ status: "ok", extra: true }).success,
    ).toBe(false);
    expect(healthResponseSchema.safeParse({ status: "degraded" }).success).toBe(
      false,
    );
  });
});
