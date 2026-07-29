import type { HealthStatus } from "@sbud-d/types";

import { apiFetch } from "../lib/api-client";

export const fallbackHealthStatus: HealthStatus = {
  environment: "development",
  service: "ai-study-buddy-api",
  status: "ok",
  timestamp: new Date(0).toISOString(),
  version: "0.0.0",
  runtime: {
    authRequiredForSupabase: false,
    dataMode: "fixture",
    liveValidationStatus: "fixture_mode",
    persistenceLabel: "Offline fallback",
    supabaseConfigured: false,
    validationNotes: ["API health is unavailable; mobile is showing local fallback data."],
  },
};

export async function fetchHealthStatus(): Promise<HealthStatus> {
  const response = await apiFetch("/health");

  if (!response.ok) {
    throw new Error(`Health request failed with status ${response.status}.`);
  }

  return (await response.json()) as HealthStatus;
}
