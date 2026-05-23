import { type NextRequest, NextResponse } from "next/server";
import { getCurrentAdminProfile } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  isHttpUrl,
  normalizeNullable,
  normalizeTravelpayoutsUrl,
  toTravelpayoutsNumberOrString,
  TRAVELPAYOUTS_LINKS_API_URL,
  type TravelpayoutsApiResponse,
  type TravelpayoutsCreateLinkInput
} from "@/lib/travelpayouts";

export async function POST(request: NextRequest) {
  const authError = await authorize();
  if (authError) return authError;

  const body = (await request.json()) as Partial<TravelpayoutsCreateLinkInput>;
  const brandUrl = normalizeTravelpayoutsUrl(body.brandUrl ?? "");

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "請輸入連結名稱。" }, { status: 400 });
  }

  if (!brandUrl || !isHttpUrl(brandUrl)) {
    return NextResponse.json({ error: "請輸入有效的原始品牌 URL。" }, { status: 400 });
  }

  const trs = normalizeNullable(body.trs) ?? normalizeNullable(process.env.TRAVELPAYOUTS_TRS);
  const marker = normalizeNullable(body.marker) ?? normalizeNullable(process.env.TRAVELPAYOUTS_MARKER);
  const token = normalizeNullable(body.apiToken) ?? normalizeNullable(process.env.TRAVELPAYOUTS_API_TOKEN);
  const shorten = body.shorten ?? true;
  const subId = normalizeNullable(body.subId);

  if (!trs || !marker || !token) {
    return NextResponse.json({
      code: "not_configured",
      status: 200,
      message: "缺少 Travelpayouts API token、TRS 或 marker。可在環境變數設定，或在本次表單暫時輸入。",
      requestPreview: {
        endpoint: TRAVELPAYOUTS_LINKS_API_URL,
        trs: trs ?? "",
        marker: marker ?? "",
        shorten,
        links: [{ url: brandUrl, sub_id: subId ?? undefined }]
      }
    });
  }

  const payload = {
    trs: toTravelpayoutsNumberOrString(trs),
    marker: toTravelpayoutsNumberOrString(marker),
    shorten,
    links: [
      {
        url: brandUrl,
        ...(subId ? { sub_id: subId } : {})
      }
    ]
  };

  let travelpayoutsResponse: TravelpayoutsApiResponse;

  try {
    const response = await fetch(TRAVELPAYOUTS_LINKS_API_URL, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token
      },
      body: JSON.stringify(payload)
    });

    travelpayoutsResponse = (await response.json().catch(() => ({}))) as TravelpayoutsApiResponse;

    if (!response.ok) {
      return NextResponse.json(
        {
          error: travelpayoutsResponse.error || `Travelpayouts API 回應失敗：HTTP ${response.status}`,
          travelpayouts: travelpayoutsResponse
        },
        { status: response.status }
      );
    }
  } catch {
    return NextResponse.json({ error: "無法連線到 Travelpayouts API，請稍後重試或確認伺服器網路。" }, { status: 502 });
  }

  const linkResult = travelpayoutsResponse.result?.links?.[0];
  const partnerUrl = linkResult?.partner_url || "";
  const canSave = body.saveToAffiliateLinks && partnerUrl && linkResult?.code === "success";
  const affiliateValues = buildAffiliateValues({
    input: body,
    brandUrl,
    partnerUrl,
    subId,
    trs,
    marker,
    shorten,
    linkResult,
    travelpayoutsResponse
  });

  if (!canSave) {
    return NextResponse.json({ travelpayouts: travelpayoutsResponse, link: linkResult, partnerUrl, saved: null });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({
      travelpayouts: travelpayoutsResponse,
      link: linkResult,
      partnerUrl,
      saved: {
        previewOnly: true,
        values: affiliateValues
      }
    });
  }

  const db = supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db.from("affiliate_links").insert(affiliateValues).select().single();

  if (error) {
    return NextResponse.json({ error: error.message, travelpayouts: travelpayoutsResponse, link: linkResult, partnerUrl }, { status: 400 });
  }

  return NextResponse.json({ travelpayouts: travelpayoutsResponse, link: linkResult, partnerUrl, saved: { data } });
}

async function authorize() {
  const profile = await getCurrentAdminProfile();

  if (!profile) {
    return NextResponse.json({ error: "Admin role is required." }, { status: 403 });
  }

  return null;
}

function buildAffiliateValues({
  input,
  brandUrl,
  partnerUrl,
  subId,
  trs,
  marker,
  shorten,
  linkResult,
  travelpayoutsResponse
}: {
  input: Partial<TravelpayoutsCreateLinkInput>;
  brandUrl: string;
  partnerUrl: string;
  subId: string | null;
  trs: string;
  marker: string;
  shorten: boolean;
  linkResult: unknown;
  travelpayoutsResponse: TravelpayoutsApiResponse;
}) {
  const relatedType = input.relatedType || null;
  const relatedId = normalizeNullable(input.relatedId);

  return {
    title: input.title?.trim() ?? "Travelpayouts partner link",
    provider: "travelpayouts",
    type: input.type ?? "hotel",
    related_type: relatedType,
    related_id: relatedType ? relatedId : null,
    url: partnerUrl,
    original_url: brandUrl,
    sub_id: subId,
    commission_note: input.commissionNote?.trim() || "Travelpayouts partner link",
    is_active: true,
    external_meta: {
      travelpayouts: {
        trs,
        marker,
        shorten,
        link: linkResult,
        response: travelpayoutsResponse
      }
    }
  };
}

type LooseSupabaseClient = {
  from: (table: "affiliate_links") => {
    insert: (values: Record<string, unknown>) => {
      select: () => { single: () => Promise<{ data: unknown; error: { message: string } | null }> };
    };
  };
};
