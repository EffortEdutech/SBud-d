import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  ApiEnvironmentConfigurationError,
  getApiEnvironment,
  type ApiEnvironment,
} from "../config/environment.js";

export class SupabaseApiConfigurationError extends Error {
  constructor() {
    super("Supabase API configuration is missing for supabase data mode.");
  }
}

export function assertSupabaseApiConfigured(environment: ApiEnvironment): void {
  if (!environment.supabaseUrl || !environment.supabasePublishableKey) {
    throw new SupabaseApiConfigurationError();
  }
}

export function assertSupabaseDataModeReady(environment = getApiEnvironment()): void {
  if (environment.dataMode !== "supabase") {
    return;
  }

  try {
    assertSupabaseApiConfigured(environment);
  } catch (error) {
    if (error instanceof SupabaseApiConfigurationError) {
      throw new ApiEnvironmentConfigurationError(error.message);
    }

    throw error;
  }
}

export function createSupabaseApiClient(
  accessToken?: string,
  environment = getApiEnvironment(),
): SupabaseClient {
  assertSupabaseApiConfigured(environment);

  const options = {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    ...(accessToken
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      : {}),
  };

  return createClient(environment.supabaseUrl, environment.supabasePublishableKey, options);
}
