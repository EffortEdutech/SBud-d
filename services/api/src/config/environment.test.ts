import { describe, expect, it } from "vitest";

import {
  ApiEnvironmentConfigurationError,
  getApiEnvironment,
  parseBlieProviderMode,
  parseApiDataMode,
} from "./environment.js";

describe("API environment", () => {
  it("defaults to fixture data mode", () => {
    expect(parseApiDataMode(undefined)).toBe("fixture");
    expect(getApiEnvironment({}).dataMode).toBe("fixture");
    expect(getApiEnvironment({}).blieProvider).toBe("local");
  });

  it("accepts fixture and supabase data modes", () => {
    expect(parseApiDataMode("fixture")).toBe("fixture");
    expect(parseApiDataMode("supabase")).toBe("supabase");
  });

  it("rejects unknown data modes", () => {
    expect(() => parseApiDataMode("memory")).toThrow(ApiEnvironmentConfigurationError);
  });

  it("accepts local and OpenAI-compatible BLIE provider modes", () => {
    expect(parseBlieProviderMode(undefined)).toBe("local");
    expect(parseBlieProviderMode("local")).toBe("local");
    expect(parseBlieProviderMode("openai-compatible")).toBe("openai-compatible");
  });

  it("rejects unknown BLIE provider modes", () => {
    expect(() => parseBlieProviderMode("direct-key")).toThrow(ApiEnvironmentConfigurationError);
  });

  it("loads real provider configuration without requiring tracked secret values", () => {
    const environment = getApiEnvironment({
      SBUD_BLIE_MODEL: "test-model",
      SBUD_BLIE_OPENAI_API_KEY: "secret-key",
      SBUD_BLIE_OPENAI_BASE_URL: "https://provider.example/v1",
      SBUD_BLIE_PROVIDER: "openai-compatible",
    });

    expect(environment).toMatchObject({
      blieOpenAiBaseUrl: "https://provider.example/v1",
      blieOpenAiModel: "test-model",
      blieProvider: "openai-compatible",
    });
    expect(environment.blieOpenAiApiKey).toBe("secret-key");
  });
});
