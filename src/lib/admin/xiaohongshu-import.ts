export type XiaohongshuTargetType = "article" | "attraction" | "restaurant" | "hotel";

export type XiaohongshuMetadata = {
  url: string;
  title: string;
  description: string;
  image: string;
  fetchStatus: "not_requested" | "ok" | "failed";
  fetchMessage?: string;
};

export type XiaohongshuDraft = {
  targetType: XiaohongshuTargetType;
  resource: "articles" | "attractions" | "food" | "hotels";
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  values: Record<string, unknown>;
};

type GenerateDraftInput = {
  url?: string;
  targetType: XiaohongshuTargetType;
  pastedText?: string;
  titleHint?: string;
  district?: string;
  metadata?: Partial<XiaohongshuMetadata>;
};

const targetLabels: Record<XiaohongshuTargetType, string> = {
  article: "攻略文章",
  attraction: "景點",
  restaurant: "美食",
  hotel: "住宿"
};

export function isSupportedXiaohongshuUrl(value: string) {
  try {
    const url = new URL(value);
    return ["xiaohongshu.com", "www.xiaohongshu.com", "xhslink.com", "www.xhslink.com"].includes(url.hostname);
  } catch {
    return false;
  }
}

export function normalizeSourceUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
}

export function generateXiaohongshuDraft({
  url = "",
  targetType,
  pastedText = "",
  titleHint = "",
  district = "",
  metadata = {}
}: GenerateDraftInput): XiaohongshuDraft {
  const title = cleanTitle(titleHint || metadata.title || firstLine(pastedText) || `小紅書${targetLabels[targetType]}草稿`);
  const summary = cleanSummary(metadata.description || pastedText || title);
  const tags = extractTags(`${title}\n${metadata.description ?? ""}\n${pastedText}`);
  const slug = slugify(title);
  const sourceBlock = buildSourceBlock(url, pastedText);
  const coverImage = metadata.image || "";

  if (targetType === "article") {
    return {
      targetType,
      resource: "articles",
      title,
      slug,
      summary,
      tags,
      values: {
        title,
        slug,
        excerpt: summary,
        content: sourceBlock,
        cover_image: coverImage || null,
        tags,
        status: "draft",
        published_at: null,
        seo_title: title,
        seo_description: summary,
        og_image: coverImage || null,
        schema_faq_json: [],
        view_count: 0
      }
    };
  }

  const basePlaceValues = {
    name: title,
    slug,
    description: `${summary}\n\n${sourceBlock}`,
    address: "",
    district: district || "待補地區",
    latitude: null,
    longitude: null,
    cover_image: coverImage || null,
    gallery: coverImage ? [coverImage] : [],
    rating: 0,
    is_featured: false,
    is_hot: false,
    is_map_pinned: false,
    seo_title: title,
    seo_description: summary,
    status: "draft"
  };

  if (targetType === "attraction") {
    return {
      targetType,
      resource: "attractions",
      title,
      slug,
      summary,
      tags,
      values: {
        ...basePlaceValues,
        english_name: "",
        opening_hours: "待補",
        ticket_price: "待補",
        transport_info: "待補",
        category: "必去",
        tags
      }
    };
  }

  if (targetType === "restaurant") {
    return {
      targetType,
      resource: "food",
      title,
      slug,
      summary,
      tags,
      values: {
        ...basePlaceValues,
        phone: "",
        opening_hours: "待補",
        average_price: 0,
        cuisine_type: inferCuisineType(`${title} ${pastedText}`),
        menu_images: []
      }
    };
  }

  return {
    targetType,
    resource: "hotels",
    title,
    slug,
    summary,
    tags,
    values: {
      ...basePlaceValues,
      star_rating: null,
      price_range: "待補",
      agoda_url: "",
      booking_url: "",
      trip_url: ""
    }
  };
}

export function extractMetadataFromHtml(url: string, html: string): XiaohongshuMetadata {
  return {
    url,
    title: getMeta(html, "property", "og:title") || getMeta(html, "name", "title") || "",
    description: getMeta(html, "property", "og:description") || getMeta(html, "name", "description") || "",
    image: getMeta(html, "property", "og:image") || "",
    fetchStatus: "ok"
  };
}

function getMeta(html: string, attr: "name" | "property", key: string) {
  const pattern = new RegExp(`<meta[^>]+${attr}=["']${escapeRegExp(key)}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  const reversedPattern = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${escapeRegExp(key)}["'][^>]*>`, "i");
  return decodeHtml(html.match(pattern)?.[1] || html.match(reversedPattern)?.[1] || "");
}

function firstLine(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) ?? "";
}

function cleanTitle(value: string) {
  return value.replace(/\s+/g, " ").replace(/[-_｜|]*小紅書.*$/i, "").trim().slice(0, 70) || "小紅書匯入草稿";
}

function cleanSummary(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.slice(0, 150) || "待編輯摘要";
}

function extractTags(value: string) {
  const hashtagTags = Array.from(value.matchAll(/#([^\s#，,。！？!?.]+)/g)).map((match) => match[1]);
  const keywordTags = ["上海", "自由行", "景點", "美食", "住宿", "迪士尼", "外灘"].filter((keyword) => value.includes(keyword));
  return Array.from(new Set([...hashtagTags, ...keywordTags])).slice(0, 8);
}

function buildSourceBlock(url: string, pastedText: string) {
  return [
    "## 編輯重寫方向",
    "請根據來源整理成適合台灣旅客閱讀的上海自由行內容，補上交通、預算、營業時間、注意事項與 SEO 小標。",
    "",
    "## 來源連結",
    url || "未提供",
    "",
    "## 原始素材摘錄（僅供內部改寫）",
    pastedText.trim() || "尚未貼上筆記內容。"
  ].join("\n");
}

function inferCuisineType(value: string) {
  if (value.includes("咖啡")) return "咖啡廳";
  if (value.includes("酒吧")) return "酒吧";
  if (value.includes("小籠包") || value.includes("湯包")) return "小籠包";
  if (value.includes("火鍋")) return "火鍋";
  if (value.includes("米其林")) return "米其林";
  return "本幫菜";
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || `xhs-import-${Date.now()}`;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
