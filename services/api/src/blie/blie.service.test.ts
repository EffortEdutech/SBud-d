import { BadRequestException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { OpenAiCompatibleLearningProvider } from "./ai-provider.js";
import { BlieService, createBlieProvider } from "./blie.service.js";

describe("BlieService", () => {
  it("answers with retrieved context before generation", async () => {
    const response = await new BlieService().chat({
      message: "Explain recursion with a simple example",
      subjectId: "subject-programming",
    });

    expect(response.trace.intent).toBe("concept_explanation");
    expect(response.trace.retrievalStatus).toBe("grounded");
    expect(response.trace.provider).toBe("local-learning-provider");
    expect(response.retrievedContext.map((item) => item.sourceType)).toContain("document");
    expect(response.retrievedContext.map((item) => item.sourceType)).toContain("plkg");
    expect(response.response.checkUnderstanding).toBeTruthy();
  });

  it("supports document-specific learning questions", async () => {
    const response = await new BlieService().chat({
      message: "Use my lecture notes to guide revision",
      subjectId: "subject-programming",
    });

    expect(response.trace.intent).toBe("revision");
    expect(response.subjectName).toBe("Programming Fundamentals");
  });

  it("rejects empty learning questions", async () => {
    await expect(new BlieService().chat({ message: "" })).rejects.toThrow(BadRequestException);
  });

  it("selects the OpenAI-compatible provider from environment configuration", () => {
    const provider = createBlieProvider({
      blieOpenAiApiKey: "test-key",
      blieOpenAiBaseUrl: "https://provider.example/v1",
      blieOpenAiModel: "test-model",
      blieProvider: "openai-compatible",
      dataMode: "fixture",
      nodeEnv: "test",
      supabasePublishableKey: "",
      supabaseUrl: "",
    });

    expect(provider).toBeInstanceOf(OpenAiCompatibleLearningProvider);
  });
});
