import { describe, expect, it } from "vitest";

import {
  assertSupabaseDataModeReady,
  SupabaseApiConfigurationError,
} from "./supabase-api-client.js";

describe("Supabase API client boundary", () => {
  it("does not require Supabase variables in fixture mode", () => {
    expect(() =>
      assertSupabaseDataModeReady({
        dataMode: "fixture",
        nodeEnv: "test",
        supabasePublishableKey: "",
        supabaseUrl: "",
      }),
    ).not.toThrow();
  });

  it("requires Supabase variables in supabase data mode", () => {
    expect(() =>
      assertSupabaseDataModeReady({
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "",
        supabaseUrl: "",
      }),
    ).toThrow("Supabase API configuration is missing for supabase data mode.");
  });

  it("uses a dedicated configuration error for direct client creation", async () => {
    const { createSupabaseApiClient } = await import("./supabase-api-client.js");

    expect(() =>
      createSupabaseApiClient(undefined, {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "",
        supabaseUrl: "",
      }),
    ).toThrow(SupabaseApiConfigurationError);
  });
});
