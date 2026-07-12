import type { CreatePlkgLearningActivityInput, PlkgNode, PlkgSummary } from "@sbud-d/types";

import { getApiBaseUrl } from "../config/environment";

export const fallbackPlkgSummary: PlkgSummary = {
  studentId: "offline-student",
  statusLabel: "Offline",
  growthLabel: "Connect the API to load your personal knowledge graph.",
  nodeCount: 0,
  edgeCount: 0,
  averageMasteryScore: 0,
  nodes: [],
  edges: [],
  knowledgeGaps: [],
};

export async function fetchPlkgSummary(): Promise<PlkgSummary> {
  const response = await fetch(`${getApiBaseUrl()}/plkg/summary`);

  if (!response.ok) {
    throw new Error(`PLKG summary request failed with status ${response.status}.`);
  }

  return (await response.json()) as PlkgSummary;
}

export async function createPlkgLearningActivity(
  input: CreatePlkgLearningActivityInput,
): Promise<PlkgNode> {
  const response = await fetch(`${getApiBaseUrl()}/plkg/learning-activity`, {
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`PLKG learning activity create failed with status ${response.status}.`);
  }

  return (await response.json()) as PlkgNode;
}
