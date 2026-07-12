import { BadRequestException, Logger } from "@nestjs/common";
import type { BlieChatRequest, BlieChatResponse, BlieLearningResponse } from "@sbud-d/types";

import { LocalLearningProvider, type BlieProvider } from "./ai-provider.js";
import { assembleBlieContext } from "./blie-context.js";

const MIN_MESSAGE_LENGTH = 3;

export class BlieService {
  private readonly logger = new Logger(BlieService.name);

  constructor(private readonly provider: BlieProvider = new LocalLearningProvider()) {}

  chat(input: BlieChatRequest): BlieChatResponse {
    if (!input.message?.trim() || input.message.trim().length < MIN_MESSAGE_LENGTH) {
      throw new BadRequestException("message must contain a learning question.");
    }

    const context = assembleBlieContext(input);

    this.logger.log(
      `BLIE chat request accepted intent=${context.intent} subjectId=${context.subjectId ?? "none"} contextItems=${context.retrievedContext.length}`,
    );

    const response = this.provider.generateLearningResponse({ input, context });
    const validationStatus = this.validateResponse(response);
    const now = new Date().toISOString();

    return {
      id: `blie-${Date.now()}`,
      status: validationStatus === "passed" ? "learning" : "error",
      subjectId: context.subjectId,
      subjectName: context.subjectName,
      topicLabel: context.topicLabel,
      response,
      retrievedContext: context.retrievedContext,
      trace: {
        intent: context.intent,
        retrievalStatus: context.retrievedContext.length > 1 ? "grounded" : "placeholder",
        provider: this.provider.name,
        validationStatus,
        contextSummary: context.contextSummary,
      },
      createdAt: now,
    };
  }

  private validateResponse(response: BlieLearningResponse): "passed" | "needs_more_context" {
    const requiredFields: Array<keyof BlieLearningResponse> = [
      "explanation",
      "connection",
      "example",
      "checkUnderstanding",
      "nextStep",
    ];

    return requiredFields.every((field) => response[field].trim().length > 0)
      ? "passed"
      : "needs_more_context";
  }
}
