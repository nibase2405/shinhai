"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AffiliateProvider } from "@/types/content";

export function AffiliateButton({
  provider,
  title,
  url,
  linkId,
  buttonText
}: {
  provider: AffiliateProvider;
  title: string;
  url: string;
  linkId: string;
  buttonText?: string;
}) {
  async function handleClick() {
    const response = await fetch("/api/affiliate-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        linkId,
        provider,
        title,
        url
      })
    });

    if (!response.ok) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    const payload = (await response.json()) as { url?: string };
    window.open(payload.url || url, "_blank", "noopener,noreferrer");
  }

  return (
    <Button onClick={handleClick} variant={provider === "klook" ? "accent" : "default"} className="w-full min-w-0 whitespace-nowrap px-3">
      <span className="min-w-0 truncate">{buttonText || title}</span>
      <ExternalLink className="h-4 w-4 shrink-0" />
    </Button>
  );
}
