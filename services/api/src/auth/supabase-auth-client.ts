import { createClient } from "@supabase/supabase-js";
import type { AuthenticatedUser, Database } from "@sbud-d/types";

import { extractBearerToken } from "./bearer-token.js";
import { getApiEnvironment } from "../config/environment.js";

export class SupabaseAuthConfigurationError extends Error {
  constructor() {
    super("Supabase API configuration is missing.");
  }
}

export class MissingBearerTokenError extends Error {
  constructor() {
    super("Missing bearer token.");
  }
}

export async function getAuthenticatedUserFromHeader(
  authorizationHeader: string | undefined,
): Promise<AuthenticatedUser> {
  const token = extractBearerToken(authorizationHeader);

  if (!token) {
    throw new MissingBearerTokenError();
  }

  const environment = getApiEnvironment();

  if (!environment.supabaseUrl || !environment.supabasePublishableKey) {
    throw new SupabaseAuthConfigurationError();
  }

  const supabase = createClient<Database>(
    environment.supabaseUrl,
    environment.supabasePublishableKey,
    {
      auth: {
        persistSession: false,
      },
    },
  );

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw error ?? new MissingBearerTokenError();
  }

  return {
    id: data.user.id,
    email: data.user.email ?? null,
  };
}
