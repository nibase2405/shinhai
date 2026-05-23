import { createHash } from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function hashIp(value: string | null) {
  if (!value) {
    return null;
  }

  return createHash("sha256")
    .update(`${value}:${process.env.SUPABASE_SERVICE_ROLE_KEY ?? "local"}`)
    .digest("hex");
}

function looksLikeUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    linkId?: string;
    url?: string;
    provider?: string;
    title?: string;
  } | null;

  if (!body?.url) {
    return NextResponse.json({ error: "Missing affiliate url" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase || !body.linkId || !looksLikeUuid(body.linkId)) {
    return NextResponse.json({ url: body.url, tracked: false });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent");
  const referrer = request.headers.get("referer");

  const db = supabase as unknown as AffiliateTrackingClient;
  const { data: link } = await db
    .from("affiliate_links")
    .select("id,url,click_count,is_active")
    .eq("id", body.linkId)
    .maybeSingle();

  const redirectUrl = link?.is_active ? link.url : body.url;

  await db.from("affiliate_clicks").insert({
    affiliate_link_id: link?.id ?? body.linkId,
    ip_hash: hashIp(ip),
    referrer,
    user_agent: userAgent
  });

  if (link) {
    await db
      .from("affiliate_links")
      .update({ click_count: (link.click_count ?? 0) + 1 })
      .eq("id", link.id);
  }

  return NextResponse.json({ url: redirectUrl, tracked: true });
}

type AffiliateLinkRow = {
  id: string;
  url: string;
  click_count: number | null;
  is_active: boolean;
};

type AffiliateTrackingClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: AffiliateLinkRow | null; error: unknown }>;
      };
    };
    insert: (values: Record<string, unknown>) => Promise<{ error: unknown }>;
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => Promise<{ error: unknown }>;
    };
  };
};
