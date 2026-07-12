import { createClient } from "@supabase/supabase-js";
import type { Database } from "@sbud-d/types";

import { getSupabaseConfig } from "../config/environment";

export function createMobileSupabaseClient() {
  const config = getSupabaseConfig();

  if (!config.url || !config.publishableKey) {
    throw new Error("Supabase mobile configuration is missing.");
  }

  return createClient<Database>(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}
