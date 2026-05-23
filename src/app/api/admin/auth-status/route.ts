import { NextResponse } from "next/server";
import { isActiveAdminProfile } from "@/lib/admin/auth";
import { getCurrentProfile } from "@/lib/supabase/server";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";

export async function GET() {
  if (!hasSupabaseBrowserEnv()) {
    return NextResponse.json({
      configured: false,
      authenticated: false,
      isAdmin: false,
      role: null
    });
  }

  const profile = await getCurrentProfile();

  return NextResponse.json({
    configured: true,
    authenticated: Boolean(profile),
    isAdmin: isActiveAdminProfile(profile),
    role: profile?.role ?? null,
    status: profile?.status ?? null
  });
}
