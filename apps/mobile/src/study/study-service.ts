import type { CreateStudyReflectionInput, StudyRevisionItem, StudySummary } from "@sbud-d/types";

import { getApiBaseUrl } from "../config/environment";

export const fallbackStudySummary: StudySummary = {
  studentId: "offline-student",
  preparationReadinessLabel: "Offline preparation pending",
  revisionProgressLabel: "Offline revision pending",
  recommendedFocusLabel: "Connect the API to load study guidance.",
  preparationPlans: [],
  revisionItems: [],
};

export async function fetchStudySummary(): Promise<StudySummary> {
  const response = await fetch(`${getApiBaseUrl()}/study/summary`);

  if (!response.ok) {
    throw new Error(`Study summary request failed with status ${response.status}.`);
  }

  return (await response.json()) as StudySummary;
}

export async function createStudyReflection(
  input: CreateStudyReflectionInput,
): Promise<StudyRevisionItem> {
  const response = await fetch(`${getApiBaseUrl()}/study/revision/reflection`, {
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Study reflection request failed with status ${response.status}.`);
  }

  return (await response.json()) as StudyRevisionItem;
}
