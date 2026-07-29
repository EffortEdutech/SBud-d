export type HealthStatusValue = "ok";
export type ApiRuntimeDataMode = "fixture" | "supabase";
export type LiveValidationStatus =
  "fixture_mode" | "supabase_configuration_missing" | "ready_for_authenticated_validation";

export interface ApiRuntimeStatus {
  authRequiredForSupabase: boolean;
  dataMode: ApiRuntimeDataMode;
  liveValidationStatus: LiveValidationStatus;
  persistenceLabel: string;
  supabaseConfigured: boolean;
  validationNotes: string[];
}

export interface HealthStatus {
  status: HealthStatusValue;
  service: string;
  version: string;
  timestamp: string;
  environment: string;
  runtime?: ApiRuntimeStatus;
}
