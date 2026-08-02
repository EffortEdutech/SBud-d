import { Injectable } from "@nestjs/common";
import { createHealthStatus } from "@sbud-d/shared";
import type { ApiRuntimeStatus, HealthStatus, OperationalStatus } from "@sbud-d/types";

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
      operational: this.getOperationalStatus(),
      runtime: this.getRuntimeStatus(),
    });
  }

  private getOperationalStatus(): OperationalStatus {
    const rlsLiveValidation =
      this.environment.dataMode === "fixture"
        ? "pending"
        : this.environment.supabaseUrl && this.environment.supabasePublishableKey
          ? "ready"
          : "blocked";

    return {
      observability: {
        alertingConfigured: false,
        externalProviderConfigured: false,
        logPolicy: "metadata_only",
        mode: "local_baseline",
        monitoredSignals: [
          "api_health",
          "request_duration_ms",
          "document_processing_errors",
          "blie_provider_mode",
          "sync_pending_failed_counts",
        ],
      },
      performanceBudgets: {
        apiP95TargetMs: 750,
        documentUploadMaxMb: 50,
        memoryRssWarningMb: 512,
        mobileStartupTargetMs: 3000,
        syncQueueWarningCount: 25,
      },
      readiness:
        rlsLiveValidation === "blocked" || !this.isMemoryWithinBaseline()
          ? "needs_attention"
          : "baseline_ready",
      security: {
        healthResponseExposesSecrets: false,
        rlsLiveValidation,
        serviceRoleKeyAllowedInClient: false,
        studentContentAllowedInLogs: false,
        trackedSecretFileScan: "enforced_by_mvp_readiness",
      },
      uptimeSeconds: Math.round(process.uptime()),
    };
  }

  private isMemoryWithinBaseline(): boolean {
    return process.memoryUsage().rss / 1024 / 1024 < 512;
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
