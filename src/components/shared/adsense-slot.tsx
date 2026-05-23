import { cn } from "@/lib/utils";

export function AdsenseSlot({
  placement,
  size,
  slotId,
  className
}: {
  placement: string;
  size: string;
  slotId?: string | null;
  className?: string;
}) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId || !slotId) {
    return (
      <div
        className={cn(
          "flex min-h-24 w-full max-w-full items-center justify-center overflow-hidden rounded-lg border border-dashed bg-secondary/50 p-4 text-center text-xs text-muted-foreground [overflow-wrap:anywhere] sm:text-sm",
          className
        )}
      >
        AdSense 廣告位：{placement} / {size}
      </div>
    );
  }

  return (
    <ins
      className={cn("adsbygoogle block", className)}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
