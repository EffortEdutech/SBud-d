import { describe, expect, it } from "vitest";

import { HealthService } from "./health.service.js";

describe("HealthService", () => {
  it("returns an API health status", () => {
    const health = new HealthService().getHealth();

    expect(health.status).toBe("ok");
    expect(health.service).toBe("ai-study-buddy-api");
    expect(health.version).toBe("0.0.0");
    expect(health.runtime?.dataMode).toBe("fixture");
    expect(health.runtime?.liveValidationStatus).toBe("fixture_mode");
  });

  it("reports Supabase mode as ready when server variables are configured", () => {
    const health = new HealthService({
      dataMode: "supabase",
      nodeEnv: "test",
      supabasePublishableKey: "test-key",
      supabaseUrl: "https://example.supabase.co",
    }).getHealth();

    expect(health.runtime).toMatchObject({
      authRequiredForSupabase: true,
      dataMode: "supabase",
      liveValidationStatus: "ready_for_authenticated_validation",
      persistenceLabel: "Supabase mode",
      supabaseConfigured: true,
    });
  });

  it("reports missing Supabase configuration without exposing config values", () => {
    const health = new HealthService({
      dataMode: "supabase",
      nodeEnv: "test",
      supabasePublishableKey: "",
      supabaseUrl: "",
    }).getHealth();

    expect(health.runtime).toMatchObject({
      authRequiredForSupabase: true,
      dataMode: "supabase",
      liveValidationStatus: "supabase_configuration_missing",
      supabaseConfigured: false,
    });
    expect(JSON.stringify(health)).not.toContain("test-key");
    expect(JSON.stringify(health)).not.toContain("supabase.co");
  });
});
