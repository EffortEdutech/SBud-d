import { describe, expect, it } from "vitest";

import {
  ApiEnvironmentConfigurationError,
  getApiEnvironment,
  parseApiDataMode,
} from "./environment.js";

describe("API environment", () => {
  it("defaults to fixture data mode", () => {
    expect(parseApiDataMode(undefined)).toBe("fixture");
    expect(getApiEnvironment({}).dataMode).toBe("fixture");
  });

  it("accepts fixture and supabase data modes", () => {
    expect(parseApiDataMode("fixture")).toBe("fixture");
    expect(parseApiDataMode("supabase")).toBe("supabase");
  });

  it("rejects unknown data modes", () => {
    expect(() => parseApiDataMode("memory")).toThrow(ApiEnvironmentConfigurationError);
  });
});
