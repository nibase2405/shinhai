import { type NextRequest, NextResponse } from "next/server";
import { getCurrentAdminProfile } from "@/lib/admin/auth";
import {
  extractMetadataFromHtml,
  generateXiaohongshuDraft,
  isSupportedXiaohongshuUrl,
  normalizeSourceUrl,
  type XiaohongshuTargetType
} from "@/lib/admin/xiaohongshu-import";

const targetTypes: XiaohongshuTargetType[] = ["article", "attraction", "restaurant", "hotel"];

export async function POST(request: NextRequest) {
  const authError = await authorize();
  if (authError) return authError;

  const body = (await request.json()) as {
    url?: string;
    targetType?: XiaohongshuTargetType;
    pastedText?: string;
    titleHint?: string;
    district?: string;
  };

  const targetType = body.targetType && targetTypes.includes(body.targetType) ? body.targetType : "article";
  const url = normalizeSourceUrl(body.url);

  if (url && !isSupportedXiaohongshuUrl(url)) {
    return NextResponse.json({ error: "目前只支援 xiaohongshu.com 或 xhslink.com 連結。" }, { status: 400 });
  }

  const metadata = url ? await fetchPublicMetadata(url) : { url: "", title: "", description: "", image: "", fetchStatus: "not_requested" as const };
  const draft = generateXiaohongshuDraft({
    url,
    targetType,
    pastedText: body.pastedText,
    titleHint: body.titleHint,
    district: body.district,
    metadata
  });

  return NextResponse.json({ metadata, draft });
}

async function authorize() {
  const profile = await getCurrentAdminProfile();

  if (!profile) {
    return NextResponse.json({ error: "Admin role is required." }, { status: 403 });
  }

  return null;
}

async function fetchPublicMetadata(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 ShinehaiTravelBot/1.0; +https://shinehai.travel"
      }
    });

    if (!response.ok) {
      return {
        url,
        title: "",
        description: "",
        image: "",
        fetchStatus: "failed" as const,
        fetchMessage: `公開頁抓取失敗：HTTP ${response.status}`
      };
    }

    const html = await response.text();
    return extractMetadataFromHtml(url, html);
  } catch {
    return {
      url,
      title: "",
      description: "",
      image: "",
      fetchStatus: "failed" as const,
      fetchMessage: "公開頁無法抓取，請貼上筆記文字後再生成草稿。"
    };
  } finally {
    clearTimeout(timeout);
  }
}
