export type ApiDataMode = "fixture" | "supabase";
export type BlieProviderMode = "local" | "openai-compatible";

export interface ApiEnvironment {
  blieOpenAiApiKey?: string;
  blieOpenAiBaseUrl?: string;
  blieOpenAiModel?: string;
  blieProvider?: BlieProviderMode;
  dataMode: ApiDataMode;
  nodeEnv: string;
  supabasePublishableKey: string;
  supabaseUrl: string;
}

export class ApiEnvironmentConfigurationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function parseApiDataMode(value: string | undefined): ApiDataMode {
  if (!value) {
    return "fixture";
  }

  if (value === "fixture" || value === "supabase") {
    return value;
  }

  throw new ApiEnvironmentConfigurationError(
    "SBUD_API_DATA_MODE must be either fixture or supabase.",
  );
}

export function parseBlieProviderMode(value: string | undefined): BlieProviderMode {
  if (!value) {
    return "local";
  }

  if (value === "local" || value === "openai-compatible") {
    return value;
  }

  throw new ApiEnvironmentConfigurationError(
    "SBUD_BLIE_PROVIDER must be either local or openai-compatible.",
  );
}

export function getApiEnvironment(env: NodeJS.ProcessEnv = process.env): ApiEnvironment {
  return {
    blieOpenAiApiKey: env.SBUD_BLIE_OPENAI_API_KEY ?? "",
    blieOpenAiBaseUrl: env.SBUD_BLIE_OPENAI_BASE_URL ?? "https://api.openai.com/v1",
    blieOpenAiModel: env.SBUD_BLIE_MODEL ?? "gpt-4o-mini",
    blieProvider: parseBlieProviderMode(env.SBUD_BLIE_PROVIDER),
    dataMode: parseApiDataMode(env.SBUD_API_DATA_MODE),
    nodeEnv: env.NODE_ENV ?? "development",
    supabasePublishableKey: env.SUPABASE_PUBLISHABLE_KEY ?? "",
    supabaseUrl: env.SUPABASE_URL ?? "",
  };
}
