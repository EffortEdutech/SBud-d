import type { DashboardSummary } from "@sbud-d/types";

import { getApiBaseUrl } from "../config/environment";

export const fallbackDashboardSummary: DashboardSummary = {
  academicOverview: {
    studentId: "offline-student",
    university: null,
    programmeName: "Academic profile pending",
    fieldOfStudy: null,
    academicYear: null,
    currentSemester: {
      id: "offline-semester",
      label: "Semester setup pending",
      sequence: 1,
      academicPeriod: null,
    },
    academicGoals: ["Create your academic profile"],
  },
  subjects: [],
  learningStatus: {
    stage: "Offline shell",
    knowledgeGrowthLabel: "Connect the API to load academic context",
    readinessLabel: "No subjects loaded",
  },
  blieRecommendation: {
    title: "Set up your academic profile",
    body: "Add programme, semester, and subjects so BLIE can start understanding your learning journey.",
    actionLabel: "Begin setup",
  },
};

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch(`${getApiBaseUrl()}/dashboard`);

  if (!response.ok) {
    throw new Error(`Dashboard request failed with status ${response.status}.`);
  }

  return (await response.json()) as DashboardSummary;
}
