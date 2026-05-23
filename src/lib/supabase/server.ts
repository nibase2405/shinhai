import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseBrowserEnv } from "./env";

export async function createSupabaseServerClient() {
  if (!hasSupabaseBrowserEnv()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Proxy refreshes sessions for requests.
        }
      }
    }
  });
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return data as ProfileRow | null;
}

export async function isCurrentUserAdmin() {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}

type ProfileRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string;
  status: string;
  notes: string | null;
  login_provider: string | null;
  created_at: string;
};
