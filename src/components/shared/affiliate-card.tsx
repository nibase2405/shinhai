import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AffiliateButton } from "@/components/shared/affiliate-button";
import type { AffiliateLink } from "@/types/content";

export function AffiliateCard({ link }: { link: AffiliateLink }) {
  return (
    <Card className="flex h-full min-w-0 flex-col">
      <CardHeader className="pb-3">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 min-w-0 text-base leading-snug">{link.title}</CardTitle>
          <Badge variant="accent" className="shrink-0">{link.provider.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{link.commission_note}</p>
        <AffiliateButton
          provider={link.provider}
          title={link.title}
          url={link.url}
          linkId={link.id}
          buttonText="查看優惠"
        />
      </CardContent>
    </Card>
  );
}
