import type {
  BlieChatRequest,
  BlieLearningResponse,
  BliePreparationPriority,
  BlieQuickQuizQuestion,
  BlieRetrievedContext,
} from "@sbud-d/types";

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
    const priorityContexts = selectPriorityContexts(context.retrievedContext);
    const preparationPriorities = buildPreparationPriorities(priorityContexts, subjectName);
    const quickQuizQuestions = buildQuickQuizQuestions(priorityContexts, subjectName);

    return {
      explanation: `Let's work through "${question}" using ${subjectName} context. Start with the core idea: identify what the concept does, when it is used, and what prerequisite knowledge it depends on.`,
      connection: `This connects to ${topic}. I retrieved academic profile, subject, document, and PLKG context before forming this response.`,
      example: `Example path: define the concept in one sentence, trace one small example, then compare it with a related idea from ${subjectName}.`,
      checkUnderstanding:
        "In your own words, what is the smallest step in this concept that still feels unclear?",
      nextStep:
        "Review the retrieved subject material, then ask BLIE for a step-by-step explanation of the unclear part.",
      preparationPriorities,
      quickQuiz: {
        title: `Quick check for ${topic}`,
        questions: quickQuizQuestions,
      },
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

function selectPriorityContexts(contextItems: BlieRetrievedContext[]): BlieRetrievedContext[] {
  const ranked = [
    ...contextItems.filter((item) => item.sourceType === "plkg"),
    ...contextItems.filter((item) => item.sourceType === "document"),
    ...contextItems.filter((item) => item.sourceType === "subject"),
    ...contextItems.filter((item) => item.sourceType === "academic_profile"),
  ];
  const selected: BlieRetrievedContext[] = [];

  for (const item of ranked) {
    if (!selected.some((candidate) => candidate.sourceId === item.sourceId)) {
      selected.push(item);
    }

    if (selected.length === 3) {
      break;
    }
  }

  return selected;
}

function buildPreparationPriorities(
  contextItems: BlieRetrievedContext[],
  subjectName: string,
): BliePreparationPriority[] {
  const sourceItems =
    contextItems.length > 0
      ? contextItems
      : [
          {
            relevanceLabel: "Fallback study priority",
            snippet: `Study foundations for ${subjectName}.`,
            sourceId: "fallback-priority",
            sourceType: "subject" as const,
            title: subjectName,
          },
        ];

  return [0, 1, 2].map((index) => {
    const source = sourceItems[index] ?? sourceItems[sourceItems.length - 1]!;

    return {
      id: `priority-${index + 1}-${source.sourceId}`,
      title: source.title,
      reason: `This appears in retrieved ${source.sourceType} context: ${source.snippet}`,
      recommendedAction:
        index === 0
          ? `Review ${source.title} first and explain it in your own words.`
          : index === 1
            ? `Connect ${source.title} to the first priority before class.`
            : `Test yourself on ${source.title} with one short example.`,
      sourceContextIds: [source.sourceId],
    };
  });
}

function buildQuickQuizQuestions(
  contextItems: BlieRetrievedContext[],
  subjectName: string,
): BlieQuickQuizQuestion[] {
  const priorities = buildPreparationPriorities(contextItems, subjectName);

  return priorities.map((priority, index) => ({
    id: `quick-quiz-${index + 1}-${priority.sourceContextIds[0] ?? "context"}`,
    prompt: `In one or two sentences, explain why ${priority.title} matters for ${subjectName}.`,
    answer: `A strong answer connects ${priority.title} to the subject goal and names one example or prerequisite.`,
    explanation:
      "This checks understanding from retrieved student-owned context instead of memorising isolated facts.",
    sourceContextIds: priority.sourceContextIds,
  }));
}

function parseLearningResponse(content: string, context: BlieContextPackage): BlieLearningResponse {
  const parsed = JSON.parse(content) as Partial<Record<keyof BlieLearningResponse, unknown>>;
  const fallbackContexts = selectPriorityContexts(context.retrievedContext);
  const response: BlieLearningResponse = {
    checkUnderstanding:
      typeof parsed.checkUnderstanding === "string" ? parsed.checkUnderstanding.trim() : "",
    connection: typeof parsed.connection === "string" ? parsed.connection.trim() : "",
    example: typeof parsed.example === "string" ? parsed.example.trim() : "",
    explanation: typeof parsed.explanation === "string" ? parsed.explanation.trim() : "",
    nextStep: typeof parsed.nextStep === "string" ? parsed.nextStep.trim() : "",
    preparationPriorities: parsePreparationPriorities(
      parsed.preparationPriorities,
      fallbackContexts,
      context.subjectName ?? "your selected subject",
    ),
    quickQuiz: parseQuickQuiz(
      parsed.quickQuiz,
      fallbackContexts,
      context.subjectName ?? "your selected subject",
      context.topicLabel ?? "the current topic",
    ),
  };

  if (
    [
      response.explanation,
      response.connection,
      response.example,
      response.checkUnderstanding,
      response.nextStep,
    ].some((value) => value.length === 0)
  ) {
    throw new Error("AI provider returned an incomplete learning response.");
  }

  return response;
}

function parsePreparationPriorities(
  value: unknown,
  fallbackContexts: BlieRetrievedContext[],
  subjectName: string,
): BliePreparationPriority[] {
  if (!Array.isArray(value)) {
    return buildPreparationPriorities(fallbackContexts, subjectName);
  }

  const priorities = value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item, index) => ({
      id: typeof item.id === "string" ? item.id : `priority-${index + 1}`,
      title: typeof item.title === "string" ? item.title.trim() : "",
      reason: typeof item.reason === "string" ? item.reason.trim() : "",
      recommendedAction:
        typeof item.recommendedAction === "string" ? item.recommendedAction.trim() : "",
      sourceContextIds: Array.isArray(item.sourceContextIds)
        ? item.sourceContextIds.filter(
            (sourceId): sourceId is string => typeof sourceId === "string",
          )
        : [],
    }))
    .filter(
      (item) =>
        item.title.length > 0 && item.reason.length > 0 && item.recommendedAction.length > 0,
    );

  return priorities.length >= 3
    ? priorities.slice(0, 3)
    : buildPreparationPriorities(fallbackContexts, subjectName);
}

function parseQuickQuiz(
  value: unknown,
  fallbackContexts: BlieRetrievedContext[],
  subjectName: string,
  topic: string,
) {
  const fallbackQuestions = buildQuickQuizQuestions(fallbackContexts, subjectName);

  if (typeof value !== "object" || value === null || !("questions" in value)) {
    return {
      title: `Quick check for ${topic}`,
      questions: fallbackQuestions,
    };
  }

  const quiz = value as Record<string, unknown>;
  const questions = Array.isArray(quiz.questions)
    ? quiz.questions
        .filter(
          (item): item is Record<string, unknown> => typeof item === "object" && item !== null,
        )
        .map((item, index) => ({
          answer: typeof item.answer === "string" ? item.answer.trim() : "",
          explanation: typeof item.explanation === "string" ? item.explanation.trim() : "",
          id: typeof item.id === "string" ? item.id : `quick-quiz-${index + 1}`,
          prompt: typeof item.prompt === "string" ? item.prompt.trim() : "",
          sourceContextIds: Array.isArray(item.sourceContextIds)
            ? item.sourceContextIds.filter(
                (sourceId): sourceId is string => typeof sourceId === "string",
              )
            : [],
        }))
        .filter(
          (item) => item.prompt.length > 0 && item.answer.length > 0 && item.explanation.length > 0,
        )
    : [];

  return {
    title: typeof quiz.title === "string" ? quiz.title.trim() : `Quick check for ${topic}`,
    questions: questions.length > 0 ? questions.slice(0, 3) : fallbackQuestions,
  };
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

    return parseLearningResponse(content, request.context);
  }

  private buildMessages({ input, context }: BlieProviderRequest): OpenAiCompatibleChatMessage[] {
    return [
      {
        role: "system",
        content:
          "You are BLIE, AI Study Buddy's learning engine. Use retrieved student context before answering. Return only valid JSON with keys explanation, connection, example, checkUnderstanding, nextStep, preparationPriorities, and quickQuiz. preparationPriorities must contain exactly 3 items with id, title, reason, recommendedAction, and sourceContextIds. quickQuiz must contain a title and 1-3 questions with id, prompt, answer, explanation, and sourceContextIds. Encourage understanding, not shortcut answers.",
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

Produce a concise JSON learning response that is grounded in the retrieved context. Include exactly three preparation priorities and a quick quiz for the next study session.`,
      },
    ];
  }
}
