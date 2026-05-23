import { getCurrentProfile } from "@/lib/supabase/server";

export type AdminAuthProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string;
  status?: string | null;
  created_at: string;
};

export function isActiveAdminProfile(profile: AdminAuthProfile | null | undefined) {
  return profile?.role === "admin" && profile.status !== "suspended";
}

export async function getCurrentAdminProfile() {
  const profile = (await getCurrentProfile()) as AdminAuthProfile | null;
  return isActiveAdminProfile(profile) ? profile : null;
}
