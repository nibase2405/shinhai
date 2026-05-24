import { createClient, type RealtimeClientOptions } from "@supabase/supabase-js";
import WebSocket from "ws";
import type { Database } from "@/types/database";
import { getSupabaseUrl, hasSupabaseAdminEnv } from "./env";

const nodeRealtimeTransport = WebSocket as unknown as NonNullable<RealtimeClientOptions["transport"]>;

export function createSupabaseAdminClient() {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  return createClient<Database>(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    realtime: {
      transport: nodeRealtimeTransport
    }
  });
}
