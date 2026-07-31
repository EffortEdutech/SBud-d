import type { BlieChatRequest, BlieLearningResponse } from "@sbud-d/types";

import type { BlieContextPackage } from "./blie-context.js";
import type { ApiEnvironment } from "../config/environment.js";

export interface BlieProviderRequest {
  input: BlieChatRequest;
  context: BlieContextPackage;
}

export interface BlieProvider {
  readonly name: string;
  generateLearningResponse(request: BlieProviderRequest): Promise<BlieLearningResponse>;
}

export class LocalLearningProvider implements BlieProvider {
  readonly name = "local-learning-provider";

  async generateLearningResponse({
    input,
    context,
  }: BlieProviderRequest): Promise<BlieLearningResponse> {
    const subjectName = context.subjectName ?? "your selected subject";
    const topic = context.topicLabel ?? "the current topic";
    const question = input.message.trim();

    return {
      explanation: `Let's work through "${question}" using ${subjectName} context. Start with the core idea: identify what the concept does, when it is used, and what prerequisite knowledge it depends on.`,
      connection: `This connects to ${topic}. I retrieved academic profile, subject, document, and PLKG context before forming this response.`,
      example: `Example path: define the concept in one sentence, trace one small example, then compare it with a related idea from ${subjectName}.`,
      checkUnderstanding:
        "In your own words, what is the smallest step in this concept that still feels unclear?",
      nextStep:
        "Review the retrieved subject material, then ask BLIE for a step-by-step explanation of the unclear part.",
    };
  }
}

type FetchLike = typeof fetch;

interface OpenAiCompatibleChatMessage {
  role: "system" | "user";
  content: string;
}

interface OpenAiCompatibleChatResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

function buildContextBlock(context: BlieContextPackage): string {
  return context.retrievedContext
    .map(
      (item, index) =>
        `${index + 1}. [${item.sourceType}] ${item.title}: ${item.snippet} (${item.relevanceLabel})`,
    )
    .join("\n");
}

function parseLearningResponse(content: string): BlieLearningResponse {
  const parsed = JSON.parse(content) as Partial<Record<keyof BlieLearningResponse, unknown>>;
  const response: BlieLearningResponse = {
    checkUnderstanding:
      typeof parsed.checkUnderstanding === "string" ? parsed.checkUnderstanding.trim() : "",
    connection: typeof parsed.connection === "string" ? parsed.connection.trim() : "",
    example: typeof parsed.example === "string" ? parsed.example.trim() : "",
    explanation: typeof parsed.explanation === "string" ? parsed.explanation.trim() : "",
    nextStep: typeof parsed.nextStep === "string" ? parsed.nextStep.trim() : "",
  };

  if (Object.values(response).some((value) => value.length === 0)) {
    throw new Error("AI provider returned an incomplete learning response.");
  }

  return response;
}

export class OpenAiCompatibleLearningProvider implements BlieProvider {
  readonly name = "openai-compatible-provider";

  constructor(
    private readonly environment: Pick<
      ApiEnvironment,
      "blieOpenAiApiKey" | "blieOpenAiBaseUrl" | "blieOpenAiModel"
    >,
    private readonly fetchImpl: FetchLike = fetch,
  ) {}

  async generateLearningResponse(request: BlieProviderRequest): Promise<BlieLearningResponse> {
    const apiKey = this.environment.blieOpenAiApiKey ?? "";
    const baseUrl = this.environment.blieOpenAiBaseUrl ?? "https://api.openai.com/v1";
    const model = this.environment.blieOpenAiModel ?? "gpt-4o-mini";

    if (!apiKey.trim()) {
      throw new Error("SBUD_BLIE_OPENAI_API_KEY is required for openai-compatible BLIE provider.");
    }

    const messages = this.buildMessages(request);
    const endpoint = `${baseUrl.replace(/\/+$/u, "")}/chat/completions`;
    const response = await this.fetchImpl(endpoint, {
      body: JSON.stringify({
        messages,
        model,
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`AI provider request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as OpenAiCompatibleChatResponse;
    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI provider returned no message content.");
    }

    return parseLearningResponse(content);
  }

  private buildMessages({ input, context }: BlieProviderRequest): OpenAiCompatibleChatMessage[] {
    return [
      {
        role: "system",
        content:
          "You are BLIE, AI Study Buddy's learning engine. Use retrieved student context before answering. Return only valid JSON with keys explanation, connection, example, checkUnderstanding, and nextStep. Encourage understanding, not shortcut answers.",
      },
      {
        role: "user",
        content: `Student question: ${input.message.trim()}
Preferred mode: ${input.preferredMode ?? "simple"}
Intent: ${context.intent}
Subject: ${context.subjectName ?? "not selected"}
Topic: ${context.topicLabel ?? "not selected"}
Retrieved context:
${buildContextBlock(context)}

Produce a concise JSON learning response that is grounded in the retrieved context.`,
      },
    ];
  }
}
