import type { BlieChatRequest, BlieChatResponse } from "@sbud-d/types";

import { getApiBaseUrl } from "../config/environment";

export const fallbackBlieResponse: BlieChatResponse = {
  id: "offline-blie",
  status: "error",
  subjectId: null,
  subjectName: null,
  topicLabel: null,
  response: {
    explanation: "BLIE is offline right now.",
    connection: "Reconnect the API to retrieve academic and document context before generation.",
    example: "Try again when the API status shows connected.",
    checkUnderstanding: "Which topic were you trying to study?",
    nextStep: "Start the API and send the question again.",
  },
  retrievedContext: [],
  trace: {
    intent: "general_learning",
    retrievalStatus: "placeholder",
    provider: "offline-fallback",
    validationStatus: "needs_more_context",
    contextSummary: "No live context retrieved.",
  },
  createdAt: "offline",
};

export async function sendBlieChat(input: BlieChatRequest): Promise<BlieChatResponse> {
  const response = await fetch(`${getApiBaseUrl()}/blie/chat`, {
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`BLIE chat failed with status ${response.status}.`);
  }

  return (await response.json()) as BlieChatResponse;
}
