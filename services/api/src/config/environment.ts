export interface ApiEnvironment {
  nodeEnv: string;
  supabasePublishableKey: string;
  supabaseUrl: string;
}

export function getApiEnvironment(): ApiEnvironment {
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
    supabaseUrl: process.env.SUPABASE_URL ?? "",
  };
}
