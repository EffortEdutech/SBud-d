interface RuntimeHealthStatus {
  authRequiredForSupabase: boolean;
  blieProviderConfigured: boolean;
  blieProviderLabel: string;
  dataMode: "fixture" | "supabase";
  liveValidationStatus:
    "fixture_mode" | "supabase_configuration_missing" | "ready_for_authenticated_validation";
  persistenceLabel: string;
  supabaseConfigured: boolean;
  validationNotes: string[];
}

interface CreateHealthStatusInput {
  service: string;
  version: string;
  environment?: string;
  now?: Date;
  runtime?: RuntimeHealthStatus;
}

export function createHealthStatus(input: CreateHealthStatusInput) {
  return {
    status: "ok" as const,
    service: input.service,
    version: input.version,
    timestamp: (input.now ?? new Date()).toISOString(),
    environment: input.environment ?? "development",
    ...(input.runtime ? { runtime: input.runtime } : {}),
  };
}
