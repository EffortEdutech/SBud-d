import { Injectable } from "@nestjs/common";
import { createHealthStatus } from "@sbud-d/shared";
import type { ApiRuntimeStatus, HealthStatus } from "@sbud-d/types";

import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";

const API_SERVICE_NAME = "ai-study-buddy-api";
const API_VERSION = "0.0.0";

@Injectable()
export class HealthService {
  constructor(private readonly environment: ApiEnvironment = getApiEnvironment()) {}

  getHealth(): HealthStatus {
    return createHealthStatus({
      service: API_SERVICE_NAME,
      version: API_VERSION,
      environment: this.environment.nodeEnv,
      runtime: this.getRuntimeStatus(),
    });
  }

  private getRuntimeStatus(): ApiRuntimeStatus {
    const supabaseConfigured = Boolean(
      this.environment.supabaseUrl && this.environment.supabasePublishableKey,
    );
    const blieProviderConfigured =
      this.environment.blieProvider === "local" || Boolean(this.environment.blieOpenAiApiKey);
    const blieProviderLabel =
      this.environment.blieProvider === "openai-compatible"
        ? "OpenAI-compatible provider"
        : "Local deterministic provider";

    if (this.environment.dataMode === "fixture") {
      return {
        authRequiredForSupabase: false,
        blieProviderConfigured,
        blieProviderLabel,
        dataMode: "fixture",
        liveValidationStatus: "fixture_mode",
        persistenceLabel: "Fixture mode",
        supabaseConfigured,
        validationNotes: [
          "Local/demo fixture data is active.",
          "Set SBUD_API_DATA_MODE=supabase for live persistence validation.",
        ],
      };
    }

    if (!supabaseConfigured) {
      return {
        authRequiredForSupabase: true,
        blieProviderConfigured,
        blieProviderLabel,
        dataMode: "supabase",
        liveValidationStatus: "supabase_configuration_missing",
        persistenceLabel: "Supabase mode needs configuration",
        supabaseConfigured: false,
        validationNotes: [
          "Supabase mode is selected, but server Supabase variables are incomplete.",
          "Do not expose Supabase keys or bearer tokens in logs, chat, or tracked files.",
        ],
      };
    }

    return {
      authRequiredForSupabase: true,
      blieProviderConfigured,
      blieProviderLabel,
      dataMode: "supabase",
      liveValidationStatus: "ready_for_authenticated_validation",
      persistenceLabel: "Supabase mode",
      supabaseConfigured: true,
      validationNotes: [
        "Server Supabase variables are configured.",
        "Live RLS validation still requires authenticated test-user bearer tokens locally.",
      ],
    };
  }
}
