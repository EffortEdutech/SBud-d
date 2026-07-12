import type { EmailPasswordCredentials } from "@sbud-d/types";

import { createMobileSupabaseClient } from "../lib/supabase";

export async function signUpWithEmail(credentials: EmailPasswordCredentials) {
  const supabase = createMobileSupabaseClient();

  return supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });
}

export async function signInWithPassword(credentials: EmailPasswordCredentials) {
  const supabase = createMobileSupabaseClient();

  return supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
}

export async function signOut() {
  const supabase = createMobileSupabaseClient();

  return supabase.auth.signOut();
}
