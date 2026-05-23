"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton({
  redirectTo = "/login",
  label = "登出"
}: {
  redirectTo?: string;
  label?: string;
}) {
  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = redirectTo;
  }

  return (
    <Button variant="outline" onClick={signOut}>
      <LogOut className="h-4 w-4" />
      {label}
    </Button>
  );
}
