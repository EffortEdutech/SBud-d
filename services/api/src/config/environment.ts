export type ApiDataMode = "fixture" | "supabase";

export interface ApiEnvironment {
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

export function getApiEnvironment(env: NodeJS.ProcessEnv = process.env): ApiEnvironment {
  return {
    dataMode: parseApiDataMode(env.SBUD_API_DATA_MODE),
    nodeEnv: env.NODE_ENV ?? "development",
    supabasePublishableKey: env.SUPABASE_PUBLISHABLE_KEY ?? "",
    supabaseUrl: env.SUPABASE_URL ?? "",
  };
}
