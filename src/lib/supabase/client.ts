"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseBrowserEnv } from "./env";

export function createSupabaseBrowserClient() {
  if (!hasSupabaseBrowserEnv()) {
    return null;
  }

  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
