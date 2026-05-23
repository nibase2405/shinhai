export const TRAVELPAYOUTS_LINKS_API_URL = "https://api.travelpayouts.com/links/v1/create";

export type TravelpayoutsLinkType = "hotel" | "ticket" | "food" | "tour" | "transport";
export type TravelpayoutsRelatedType = "article" | "attraction" | "restaurant" | "hotel" | "";

export type TravelpayoutsCreateLinkInput = {
  title: string;
  brandUrl: string;
  type: TravelpayoutsLinkType;
  relatedType?: TravelpayoutsRelatedType;
  relatedId?: string;
  commissionNote?: string;
  trs?: string;
  marker?: string;
  subId?: string;
  shorten: boolean;
  apiToken?: string;
  saveToAffiliateLinks?: boolean;
};

export type TravelpayoutsLinkResult = {
  url: string;
  code: string;
  partner_url: string;
  message?: string;
};

export type TravelpayoutsApiResponse = {
  result?: {
    trs: string | number;
    marker: string | number;
    shorten: boolean;
    links: TravelpayoutsLinkResult[];
  };
  code?: string;
  status?: number;
  error?: string;
};

export function normalizeTravelpayoutsUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeNullable(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function toTravelpayoutsNumberOrString(value: string) {
  const normalized = value.trim();
  const numberValue = Number(normalized);
  return Number.isFinite(numberValue) && normalized !== "" ? numberValue : normalized;
}
