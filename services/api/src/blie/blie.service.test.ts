import { BadRequestException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { OpenAiCompatibleLearningProvider } from "./ai-provider.js";
import { BlieService, createBlieProvider } from "./blie.service.js";
import { DocumentService } from "../documents/document.service.js";

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
    expect(response.response.preparationPriorities).toHaveLength(3);
    expect(response.response.quickQuiz.questions.length).toBeGreaterThan(0);
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

  it("uses document-derived PLKG concepts for preparation priorities and quiz prompts", async () => {
    const documentService = new DocumentService();
    const uploadedDocument = await documentService.uploadDocument(
      {
        subjectId: "subject-programming",
        topicLabel: "Recursion",
      },
      {
        buffer: Buffer.from(
          "%PDF-1.4\nRecursion breaks a problem into smaller repeated steps. Functions provide reusable inputs and outputs.\n%%EOF",
        ),
        mimetype: "application/pdf",
        originalname: "sprint-16-recursion.pdf",
        size: 2048,
      },
    );
    const extractedDocument = await documentService.extractDocumentText(uploadedDocument.id);

    await documentService.extractDocumentConcepts(extractedDocument.id);

    const response = await new BlieService().chat({
      message: "Prepare me for the next class and give me a quiz",
      subjectId: "subject-programming",
    });

    expect(response.response.preparationPriorities.length).toBe(3);
    expect(response.response.quickQuiz.questions.length).toBeGreaterThan(0);
    expect(
      response.retrievedContext.some((item) => item.sourceId.includes(uploadedDocument.id)),
    ).toBe(true);
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
