import { describe, expect, it } from "vitest";

import { createHealthStatus } from "./health.js";

describe("createHealthStatus", () => {
  it("creates a stable health response", () => {
    const health = createHealthStatus({
      service: "api",
      version: "0.0.0",
      environment: "test",
      now: new Date("2026-07-11T00:00:00.000Z"),
    });

    expect(health).toEqual({
      status: "ok",
      service: "api",
      version: "0.0.0",
      timestamp: "2026-07-11T00:00:00.000Z",
      environment: "test",
    });
  });
});
