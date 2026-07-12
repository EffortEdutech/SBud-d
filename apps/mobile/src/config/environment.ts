const DEFAULT_API_BASE_URL = "http://localhost:4801/api/v1";

declare const process: {
  env: {
    EXPO_PUBLIC_API_BASE_URL?: string;
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
    EXPO_PUBLIC_SUPABASE_URL?: string;
  };
};

export function getApiBaseUrl(): string {
  return process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

export function getSupabaseConfig() {
  return {
    publishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  };
}
