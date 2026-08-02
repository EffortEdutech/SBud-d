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
interface OperationalHealthStatus {
  observability: {
    alertingConfigured: boolean;
    externalProviderConfigured: boolean;
    logPolicy: "metadata_only";
    mode: "local_baseline";
    monitoredSignals: string[];
  };
  performanceBudgets: {
    apiP95TargetMs: number;
    documentUploadMaxMb: number;
    memoryRssWarningMb: number;
    mobileStartupTargetMs: number;
    syncQueueWarningCount: number;
  };
  readiness: "baseline_ready" | "needs_attention";
  security: {
    healthResponseExposesSecrets: false;
    rlsLiveValidation: "pending" | "ready" | "blocked";
    serviceRoleKeyAllowedInClient: false;
    studentContentAllowedInLogs: false;
    trackedSecretFileScan: "enforced_by_mvp_readiness";
  };
  uptimeSeconds: number;
}

interface CreateHealthStatusInput {
  service: string;
  version: string;
  environment?: string;
  now?: Date;
  operational?: OperationalHealthStatus;
  runtime?: RuntimeHealthStatus;
}

export function createHealthStatus(input: CreateHealthStatusInput) {
  return {
    status: "ok" as const,
    service: input.service,
    version: input.version,
    timestamp: (input.now ?? new Date()).toISOString(),
    environment: input.environment ?? "development",
    ...(input.operational ? { operational: input.operational } : {}),
    ...(input.runtime ? { runtime: input.runtime } : {}),
  };
}
