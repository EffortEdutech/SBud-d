export type HealthStatusValue = "ok";
export type ApiRuntimeDataMode = "fixture" | "supabase";
export type LiveValidationStatus =
  "fixture_mode" | "supabase_configuration_missing" | "ready_for_authenticated_validation";

export interface ApiRuntimeStatus {
  authRequiredForSupabase: boolean;
  blieProviderConfigured: boolean;
  blieProviderLabel: string;
  dataMode: ApiRuntimeDataMode;
  liveValidationStatus: LiveValidationStatus;
  persistenceLabel: string;
  supabaseConfigured: boolean;
  validationNotes: string[];
}

export type OperationalReadinessStatus = "baseline_ready" | "needs_attention";

export interface PerformanceBudgetStatus {
  apiP95TargetMs: number;
  documentUploadMaxMb: number;
  memoryRssWarningMb: number;
  mobileStartupTargetMs: number;
  syncQueueWarningCount: number;
}

export interface SecurityBaselineStatus {
  healthResponseExposesSecrets: false;
  rlsLiveValidation: "pending" | "ready" | "blocked";
  serviceRoleKeyAllowedInClient: false;
  studentContentAllowedInLogs: false;
  trackedSecretFileScan: "enforced_by_mvp_readiness";
}

export interface ObservabilityBaselineStatus {
  alertingConfigured: boolean;
  externalProviderConfigured: boolean;
  logPolicy: "metadata_only";
  mode: "local_baseline";
  monitoredSignals: string[];
}

export interface OperationalStatus {
  observability: ObservabilityBaselineStatus;
  performanceBudgets: PerformanceBudgetStatus;
  readiness: OperationalReadinessStatus;
  security: SecurityBaselineStatus;
  uptimeSeconds: number;
}

export interface HealthStatus {
  status: HealthStatusValue;
  service: string;
  version: string;
  timestamp: string;
  environment: string;
  operational?: OperationalStatus;
  runtime?: ApiRuntimeStatus;
}
