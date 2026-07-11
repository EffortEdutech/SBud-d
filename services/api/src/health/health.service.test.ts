import { describe, expect, it } from "vitest";

import { HealthService } from "./health.service.js";

describe("HealthService", () => {
  it("returns an API health status", () => {
    const health = new HealthService().getHealth();

    expect(health.status).toBe("ok");
    expect(health.service).toBe("ai-study-buddy-api");
    expect(health.version).toBe("0.0.0");
  });
});
