import { describe, expect, it } from "vitest";

import {
  LocalLearningProvider,
  OpenAiCompatibleLearningProvider,
  type BlieProviderRequest,
} from "./ai-provider.js";

const providerRequest: BlieProviderRequest = {
  context: {
    contextSummary: "4 context items assembled before generation.",
    intent: "concept_explanation",
    retrievedContext: [
      {
        relevanceLabel: "Student PLKG context",
        snippet: "concept; status: introduced; mastery: 25%.",
        sourceId: "plkg-concept-recursion",
        sourceType: "plkg",
        title: "Recursion",
      },
    ],
    subjectId: "subject-programming",
    subjectName: "Programming Fundamentals",
    topicLabel: "Functions and control flow",
  },
  input: {
    message: "Explain recursion",
    preferredMode: "simple",
    subjectId: "subject-programming",
  },
};

describe("BLIE providers", () => {
  it("keeps the local provider deterministic", async () => {
    const response = await new LocalLearningProvider().generateLearningResponse(providerRequest);

    expect(response.explanation).toContain("Explain recursion");
    expect(response.connection).toContain("Functions and control flow");
  });

  it("calls an OpenAI-compatible chat endpoint and parses JSON learning output", async () => {
    const calls: Array<{ body: unknown; headers: Record<string, string>; url: string }> = [];
    const fetchImpl: typeof fetch = async (url, init) => {
      calls.push({
        body: init?.body ? JSON.parse(init.body.toString()) : null,
        headers: init?.headers as Record<string, string>,
        url: url.toString(),
      });

      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  checkUnderstanding: "What is the stopping condition in your own words?",
                  connection: "This connects to functions and control flow.",
                  example: "A countdown function calls itself with a smaller number.",
                  explanation: "Recursion solves a problem by calling the same function.",
                  nextStep: "Trace one small recursive call by hand.",
                  preparationPriorities: [
                    {
                      id: "priority-1",
                      reason: "Recursion has low mastery.",
                      recommendedAction: "Review the stopping condition.",
                      sourceContextIds: ["plkg-concept-recursion"],
                      title: "Recursion",
                    },
                    {
                      id: "priority-2",
                      reason: "Functions are prerequisite context.",
                      recommendedAction: "Connect recursion to functions.",
                      sourceContextIds: ["plkg-concept-recursion"],
                      title: "Functions",
                    },
                    {
                      id: "priority-3",
                      reason: "Trace practice is required.",
                      recommendedAction: "Trace one call stack.",
                      sourceContextIds: ["plkg-concept-recursion"],
                      title: "Call stack",
                    },
                  ],
                  quickQuiz: {
                    questions: [
                      {
                        answer: "It stops when the base case is reached.",
                        explanation: "This checks the stopping condition.",
                        id: "quiz-1",
                        prompt: "What stops recursion?",
                        sourceContextIds: ["plkg-concept-recursion"],
                      },
                    ],
                    title: "Recursion quick check",
                  },
                }),
              },
            },
          ],
        }),
        { status: 200 },
      );
    };
    const provider = new OpenAiCompatibleLearningProvider(
      {
        blieOpenAiApiKey: "test-key",
        blieOpenAiBaseUrl: "https://provider.example/v1",
        blieOpenAiModel: "test-model",
      },
      fetchImpl,
    );

    const response = await provider.generateLearningResponse(providerRequest);

    expect(response.explanation).toContain("Recursion");
    expect(response.preparationPriorities).toHaveLength(3);
    expect(response.quickQuiz.questions[0]?.prompt).toBe("What stops recursion?");
    expect(calls[0]?.url).toBe("https://provider.example/v1/chat/completions");
    expect(calls[0]?.body).toMatchObject({
      model: "test-model",
      response_format: { type: "json_object" },
    });
    expect(JSON.stringify(calls[0]?.headers)).toContain("Bearer test-key");
  });

  it("requires a server-only provider key in OpenAI-compatible mode", async () => {
    const provider = new OpenAiCompatibleLearningProvider({
      blieOpenAiApiKey: "",
      blieOpenAiBaseUrl: "https://provider.example/v1",
      blieOpenAiModel: "test-model",
    });

    await expect(provider.generateLearningResponse(providerRequest)).rejects.toThrow(
      "SBUD_BLIE_OPENAI_API_KEY",
    );
  });
});
