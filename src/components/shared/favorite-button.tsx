"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FavoriteTargetType } from "@/types/content";

export function FavoriteButton({
  targetType,
  targetId,
  defaultSaved = false
}: {
  targetType: FavoriteTargetType;
  targetId: string;
  defaultSaved?: boolean;
}) {
  const [saved, setSaved] = useState(defaultSaved);
  const [loading, setLoading] = useState(false);

  async function toggleFavorite() {
    const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setSaved((value) => !value);
      return;
    }

    setLoading(true);
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      window.location.href = "/login";
      return;
    }

    if (saved) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("target_type", targetType)
        .eq("target_id", targetId);
      setSaved(false);
    } else {
      const db = supabase as unknown as FavoriteClient;
      await db.from("favorites").insert({
        user_id: user.id,
        target_type: targetType,
        target_id: targetId
      });
      setSaved(true);
    }
    setLoading(false);
  }

  return (
    <Button
      variant={saved ? "accent" : "outline"}
      size="icon"
      onClick={toggleFavorite}
      disabled={loading}
      aria-label={saved ? "取消收藏" : "加入收藏"}
      title={saved ? "取消收藏" : "加入收藏"}
    >
      <Heart className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} />
    </Button>
  );
}

type FavoriteClient = {
  from: (table: "favorites") => {
    insert: (values: { user_id: string; target_type: string; target_id: string }) => Promise<unknown>;
  };
};
