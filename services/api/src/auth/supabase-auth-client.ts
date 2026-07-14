import type { AuthenticatedUser } from "@sbud-d/types";

import { extractBearerToken } from "./bearer-token.js";
import {
  createSupabaseApiClient,
  SupabaseApiConfigurationError,
} from "../supabase/supabase-api-client.js";

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

  let supabase;

  try {
    supabase = createSupabaseApiClient();
  } catch (error) {
    if (error instanceof SupabaseApiConfigurationError) {
      throw new SupabaseAuthConfigurationError();
    }

    throw error;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw error ?? new MissingBearerTokenError();
  }

  return {
    id: data.user.id,
    email: data.user.email ?? null,
  };
}

export async function getAuthenticatedUserAndTokenFromHeader(
  authorizationHeader: string | undefined,
): Promise<AuthenticatedUser & { accessToken: string }> {
  const token = extractBearerToken(authorizationHeader);

  if (!token) {
    throw new MissingBearerTokenError();
  }

  let supabase;

  try {
    supabase = createSupabaseApiClient();
  } catch (error) {
    if (error instanceof SupabaseApiConfigurationError) {
      throw new SupabaseAuthConfigurationError();
    }

    throw error;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw error ?? new MissingBearerTokenError();
  }

  return {
    accessToken: token,
    id: data.user.id,
    email: data.user.email ?? null,
  };
}
