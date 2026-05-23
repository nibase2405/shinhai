export type ContentStatus = "draft" | "published" | "scheduled" | "archived";
export type FavoriteTargetType = "article" | "attraction" | "restaurant" | "hotel";
export type AffiliateProvider = "agoda" | "booking" | "klook" | "kkday" | "trip" | "travelpayouts" | "custom";

export type CategoryType = "article" | "attraction" | "food" | "hotel";

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category_id: string;
  tags: string[];
  author_id: string;
  status: ContentStatus;
  published_at: string;
  seo_title: string;
  seo_description: string;
  og_image: string;
  schema_faq_json: Array<{ question: string; answer: string }>;
  view_count: number;
}

export interface Attraction {
  id: string;
  name: string;
  slug: string;
  english_name: string;
  description: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  ticket_price: string;
  transport_info: string;
  cover_image: string;
  gallery: string[];
  category: string;
  tags: string[];
  rating: number;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  phone: string;
  opening_hours: string;
  average_price: number;
  cuisine_type: string;
  cover_image: string;
  gallery: string[];
  menu_images: string[];
  rating: number;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  star_rating: number;
  price_range: string;
  cover_image: string;
  gallery: string[];
  rating: number;
  agoda_url: string;
  booking_url: string;
  trip_url: string;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
}

export interface AffiliateLink {
  id: string;
  title: string;
  provider: AffiliateProvider;
  type: "hotel" | "ticket" | "food" | "tour" | "transport";
  related_type: FavoriteTargetType | null;
  related_id: string | null;
  url: string;
  original_url?: string | null;
  sub_id?: string | null;
  commission_note: string;
  is_active: boolean;
  click_count: number;
}

export interface AdPlacement {
  id: string;
  name: string;
  placement: string;
  size: string;
  ad_type: "adsense" | "direct";
  adsense_slot: string | null;
  image_url: string | null;
  target_url: string | null;
  is_active: boolean;
}
