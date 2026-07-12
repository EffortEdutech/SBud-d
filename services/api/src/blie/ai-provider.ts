import type { BlieChatRequest, BlieLearningResponse } from "@sbud-d/types";

import type { BlieContextPackage } from "./blie-context.js";

export interface BlieProviderRequest {
  input: BlieChatRequest;
  context: BlieContextPackage;
}

export interface BlieProvider {
  readonly name: string;
  generateLearningResponse(request: BlieProviderRequest): BlieLearningResponse;
}

export class LocalLearningProvider implements BlieProvider {
  readonly name = "local-learning-provider";

  generateLearningResponse({ input, context }: BlieProviderRequest): BlieLearningResponse {
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
