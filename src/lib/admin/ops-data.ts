import {
  adPlacements,
  affiliateLinks,
  articles,
  attractions,
  categories,
  hotels,
  mapMarkers,
  restaurants
} from "@/lib/data";
import type {
  AdminBulkAction,
  AdminFeatureSection,
  AdminField,
  AdminRecord,
  AdminResourceConfig,
  AdminStat
} from "@/types/admin";

const statusOptions = [
  { label: "草稿", value: "draft" },
  { label: "上架", value: "published" },
  { label: "排程", value: "scheduled" },
  { label: "下架", value: "archived" }
];

const activeOptions = [
  { label: "啟用", value: "true" },
  { label: "停用", value: "false" }
];

const providerOptions = [
  { label: "Agoda", value: "agoda" },
  { label: "Booking", value: "booking" },
  { label: "Klook", value: "klook" },
  { label: "KKday", value: "kkday" },
  { label: "Trip.com", value: "trip" },
  { label: "Travelpayouts", value: "travelpayouts" },
  { label: "自訂", value: "custom" }
];

const districtOptions = ["黃浦區", "浦東新區", "靜安區", "徐匯區", "長寧區", "迪士尼度假區"].map((value) => ({
  label: value,
  value
}));

const defaultStatusActions: AdminBulkAction[] = [
  { id: "publish", label: "批次上架", kind: "set-status", key: "status", value: "published" },
  { id: "archive", label: "批次下架", kind: "set-status", key: "status", value: "archived" },
  { id: "delete", label: "批次刪除", kind: "delete", confirm: "確定要刪除選取項目？" }
];

const defaultActiveActions: AdminBulkAction[] = [
  { id: "enable", label: "批次啟用", kind: "set-active", key: "is_active", value: true },
  { id: "disable", label: "批次停用", kind: "set-active", key: "is_active", value: false },
  { id: "delete", label: "批次刪除", kind: "delete", confirm: "確定要刪除選取項目？" }
];

const contentFeatures: AdminFeatureSection[] = [
  {
    title: "內容營運",
    items: ["新增 / 編輯 / 刪除", "草稿、上架、下架、排程狀態", "首頁推薦、熱門排序、地圖置頂", "批次發布 / 下架 / 刪除"]
  },
  {
    title: "SEO 與結構化資料",
    items: ["SEO Title / Description", "OG Image", "Schema JSON-LD", "缺漏提醒與 slug 檢查預留"]
  },
  {
    title: "關聯綁定",
    items: ["相關文章", "附近景點 / 美食 / 住宿", "Affiliate Links", "廣告版位插入設定"]
  }
];

const articleFeatureSections: AdminFeatureSection[] = [
  {
    title: "文章編輯器",
    items: ["Markdown 快捷工具列", "FAQ Schema 編輯", "Article Schema 預覽", "文內自動插入 AdSense 標記"]
  },
  {
    title: "發佈工作流",
    items: ["草稿 / 已發布 / 排程發布 / 下架", "相關文章設定", "Affiliate Links 綁定", "熱門文章排序與瀏覽統計"]
  }
];

function stat(label: string, value: string | number, helper?: string, trend?: string): AdminStat {
  return { label, value, helper, trend };
}

function pickStatus(index: number) {
  return index % 5 === 0 ? "scheduled" : index % 4 === 0 ? "draft" : "published";
}

function boolLabel(value: boolean) {
  return value ? "是" : "否";
}

function asCsv(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : String(value ?? "");
}

const baseDbFields = [
  "name",
  "slug",
  "description",
  "address",
  "district",
  "latitude",
  "longitude",
  "cover_image",
  "gallery",
  "rating",
  "is_featured",
  "seo_title",
  "seo_description",
  "status",
  "is_hot",
  "is_map_pinned"
];

const basePlaceFields: AdminField[] = [
  { key: "name", label: "名稱" },
  { key: "slug", label: "Slug" },
  { key: "status", label: "狀態", type: "select", options: statusOptions },
  { key: "district", label: "地區", type: "select", options: districtOptions },
  { key: "address", label: "地址", span: "full" },
  { key: "latitude", label: "緯度", type: "number" },
  { key: "longitude", label: "經度", type: "number" },
  { key: "rating", label: "評分", type: "number" },
  { key: "cover_image", label: "封面圖片 URL", type: "url", span: "full" },
  { key: "gallery", label: "圖片集 URL", type: "tags", span: "full" },
  { key: "description", label: "描述", type: "textarea", span: "full" },
  { key: "is_featured", label: "首頁推薦", type: "boolean" },
  { key: "is_hot", label: "熱門內容", type: "boolean" },
  { key: "is_map_pinned", label: "地圖置頂", type: "boolean" },
  { key: "seo_title", label: "SEO Title", span: "full" },
  { key: "seo_description", label: "SEO Description", type: "textarea", span: "full" }
];

const basePlaceColumns = [
  { key: "name", label: "名稱", sortable: true },
  { key: "status", label: "狀態", status: true, sortable: true },
  { key: "district", label: "地區", sortable: true },
  { key: "rating", label: "評分", sortable: true, align: "right" as const },
  { key: "is_featured_label", label: "首頁推薦" },
  { key: "is_map_pinned_label", label: "置頂" }
];

export const adminDashboardStats = [
  stat("今日瀏覽量", 1840, "page_views 今日彙總", "+12%"),
  stat("7日瀏覽量", 12640, "近 7 日累積", "+18%"),
  stat("30日瀏覽量", 48320, "近 30 日累積", "+23%"),
  stat("新增會員數", 148, "本月新增 profiles", "+9%"),
  stat("文章總數", articles.length),
  stat("景點總數", attractions.length),
  stat("美食總數", restaurants.length),
  stat("住宿總數", hotels.length),
  stat("Affiliate 點擊數", affiliateLinks.reduce((sum, link) => sum + link.click_count, 0) + 428),
  stat("Adsense 版位數", adPlacements.length + 5),
  stat("待審內容數", 7, "草稿與排程待審")
];

export const adminDashboardRankings = {
  articles: articles
    .slice()
    .sort((a, b) => b.view_count - a.view_count)
    .map((item) => ({ label: item.title, value: item.view_count, helper: item.slug })),
  attractions: attractions.map((item) => ({ label: item.name, value: Number(item.rating ?? 0) * 100, helper: item.district })),
  food: restaurants.map((item) => ({ label: item.name, value: Number(item.rating ?? 0) * 100, helper: item.district })),
  hotels: hotels.map((item) => ({ label: item.name, value: Number(item.rating ?? 0) * 100, helper: item.district })),
  affiliate: affiliateLinks.map((item, index) => ({
    label: item.title,
    value: item.click_count + 120 - index * 16,
    helper: item.provider.toUpperCase()
  }))
};

const attractionRows: AdminRecord[] = attractions.map((item, index) => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  english_name: item.english_name,
  description: item.description,
  address: item.address,
  district: item.district,
  latitude: item.latitude,
  longitude: item.longitude,
  opening_hours: item.opening_hours,
  ticket_price: item.ticket_price,
  transport_info: item.transport_info,
  cover_image: item.cover_image,
  gallery: item.gallery,
  category: item.category,
  tags: item.tags,
  rating: item.rating,
  is_featured: item.is_featured,
  is_featured_label: boolLabel(item.is_featured),
  is_hot: index < 3,
  is_map_pinned: index < 2,
  is_map_pinned_label: boolLabel(index < 2),
  status: pickStatus(index),
  related_food: restaurants.slice(0, 2).map((restaurant) => restaurant.name),
  related_hotels: hotels.slice(0, 2).map((hotel) => hotel.name),
  related_articles: articles.slice(0, 2).map((article) => article.title),
  klook_link: affiliateLinks.find((link) => link.provider === "klook")?.title ?? "",
  seo_title: item.seo_title,
  seo_description: item.seo_description
}));

const restaurantRows: AdminRecord[] = restaurants.map((item, index) => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  description: item.description,
  address: item.address,
  district: item.district,
  latitude: item.latitude,
  longitude: item.longitude,
  phone: item.phone,
  opening_hours: item.opening_hours,
  average_price: item.average_price,
  cuisine_type: item.cuisine_type,
  cover_image: item.cover_image,
  gallery: item.gallery,
  menu_images: item.menu_images,
  rating: item.rating,
  is_featured: item.is_featured,
  is_featured_label: boolLabel(item.is_featured),
  is_hot: index < 3,
  is_map_pinned: index === 0,
  is_map_pinned_label: boolLabel(index === 0),
  status: pickStatus(index),
  related_attractions: attractions.slice(0, 2).map((attraction) => attraction.name),
  related_hotels: hotels.slice(0, 2).map((hotel) => hotel.name),
  related_articles: articles.slice(0, 2).map((article) => article.title),
  merchant_ad: index === 0 ? "商家置頂曝光方案" : "",
  seo_title: item.seo_title,
  seo_description: item.seo_description
}));

const hotelRows: AdminRecord[] = hotels.map((item, index) => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  description: item.description,
  address: item.address,
  district: item.district,
  latitude: item.latitude,
  longitude: item.longitude,
  star_rating: item.star_rating,
  price_range: item.price_range,
  cover_image: item.cover_image,
  gallery: item.gallery,
  rating: item.rating,
  agoda_url: item.agoda_url,
  booking_url: item.booking_url,
  trip_url: item.trip_url,
  klook_stay_url: "",
  is_featured: item.is_featured,
  is_featured_label: boolLabel(item.is_featured),
  is_hot: index < 3,
  is_map_pinned: index === 0,
  is_map_pinned_label: boolLabel(index === 0),
  status: pickStatus(index),
  related_attractions: attractions.slice(0, 2).map((attraction) => attraction.name),
  related_food: restaurants.slice(0, 2).map((restaurant) => restaurant.name),
  related_articles: articles.slice(0, 2).map((article) => article.title),
  seo_title: item.seo_title,
  seo_description: item.seo_description
}));

const affiliateRows: AdminRecord[] = affiliateLinks.map((item, index) => ({
  id: item.id,
  title: item.title,
  provider: item.provider,
  type: item.type,
  related_type: item.related_type,
  related_id: item.related_id,
  url: item.url,
  original_url: item.original_url ?? "",
  sub_id: item.sub_id ?? "",
  commission_note: item.commission_note,
  is_active: item.is_active,
  is_active_label: boolLabel(item.is_active),
  click_count: item.click_count + 120 - index * 16,
  conversion_note: index === 0 ? "迪士尼票券轉換佳" : "",
  sort_order: index + 1,
  auto_rule: index === 0 ? "內容包含迪士尼時推薦" : ""
}));

const adRows: AdminRecord[] = [
  ...adPlacements,
  { id: "ad-extra-home-sidebar", name: "首頁側欄 300x250", placement: "home_sidebar_300x250", size: "300x250", ad_type: "adsense", adsense_slot: "", image_url: "", target_url: "", is_active: true },
  { id: "ad-extra-attraction-related-bottom", name: "景點相關文章下方 728x90", placement: "attraction_related_bottom_728x90", size: "728x90", ad_type: "adsense", adsense_slot: "", image_url: "", target_url: "", is_active: true },
  { id: "ad-extra-map-top", name: "地圖上方 970x250", placement: "map_top_970x250", size: "970x250", ad_type: "adsense", adsense_slot: "", image_url: "", target_url: "", is_active: true },
  { id: "ad-extra-map-sidebar", name: "地圖側欄 300x250", placement: "map_sidebar_300x250", size: "300x250", ad_type: "direct", adsense_slot: "", image_url: "", target_url: "", is_active: true }
].map((item, index) => ({
  id: item.id,
  name: item.name,
  placement: item.placement,
  size: item.size,
  ad_type: item.ad_type,
  adsense_slot: item.adsense_slot ?? "",
  image_url: item.image_url ?? "",
  target_url: item.target_url ?? "",
  is_active: item.is_active,
  is_active_label: boolLabel(item.is_active),
  starts_at: "2026-05-01T00:00",
  ends_at: "2026-12-31T23:59",
  click_count: 40 + index * 13,
  impression_count: 3200 + index * 650,
  sort_order: index + 1
}));

const userRows: AdminRecord[] = [
  { id: "user-1", email: "admin@shinehai.travel", display_name: "站長", role: "admin", status: "active", provider: "email", favorite_count: 0, created_at: "2026-05-01", notes: "系統管理員" },
  { id: "user-2", email: "editor@shinehai.travel", display_name: "內容編輯", role: "editor", status: "active", provider: "email", favorite_count: 18, created_at: "2026-05-06", notes: "負責文章與景點" },
  { id: "user-3", email: "ads@shinehai.travel", display_name: "廣告營運", role: "ads_manager", status: "active", provider: "google", favorite_count: 4, created_at: "2026-05-12", notes: "Affiliate 與廣告" },
  { id: "user-4", email: "merchant@example.com", display_name: "合作商家", role: "merchant", status: "suspended", provider: "email", favorite_count: 2, created_at: "2026-05-18", notes: "待補合作資料" }
];

const tagRows: AdminRecord[] = [
  "上海自由行",
  "上海迪士尼",
  "外灘夜景",
  "住宿推薦",
  "小籠包",
  "親子旅行",
  "購物",
  "交通"
].map((name, index) => ({
  id: `tag-${index + 1}`,
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  type: index < 4 ? "article" : "shared",
  seo_title: `${name}攻略`,
  seo_description: `${name}相關文章與旅遊內容`,
  cover_image: "",
  sort_order: index + 1,
  is_active: true,
  is_active_label: "是"
}));

const categoryRows: AdminRecord[] = categories.map((item, index) => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  type: item.type,
  seo_title: `${item.name}攻略`,
  seo_description: `${item.name}分類頁 SEO 描述`,
  cover_image: "",
  sort_order: index + 1,
  is_active: true,
  is_active_label: "是"
}));

const markerRows: AdminRecord[] = mapMarkers.map((item, index) => ({
  id: item.id,
  name: "name" in item ? item.name : "",
  marker_type: item.markerType,
  category: "category" in item ? asCsv(item.category) : "marker",
  icon: index % 3 === 0 ? "star" : index % 3 === 1 ? "pin" : "hotel",
  latitude: item.latitude,
  longitude: item.longitude,
  is_visible: true,
  is_visible_label: "是",
  is_map_pinned: index < 3,
  is_paid_promoted: index === 0,
  sort_order: index + 1
}));

const clickRows: AdminRecord[] = affiliateRows.flatMap((link, linkIndex) =>
  Array.from({ length: 3 }).map((_, index) => ({
    id: `click-${link.id}-${index}`,
    clicked_at: `2026-05-${String(22 - index).padStart(2, "0")} 1${index}:24`,
    provider: link.provider,
    title: link.title,
    source_page: index === 0 ? "/blog/shanghai-disneyland-one-day-guide" : "/hotels",
    user: index === 1 ? "editor@shinehai.travel" : "訪客",
    referrer: index === 2 ? "google" : "direct",
    device: index === 0 ? "mobile" : "desktop",
    browser: index === 0 ? "Safari" : "Chrome",
    click_count: Number(link.click_count) - linkIndex * 3 - index
  }))
);

const mediaRows: AdminRecord[] = [
  { id: "media-1", url: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403", title: "外灘天際線", alt_text: "上海外灘夜景", category: "景點", mime_type: "image/jpeg", size_bytes: 320000, used_in: "首頁、外灘文章" },
  { id: "media-2", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945", title: "飯店大廳", alt_text: "上海飯店住宿", category: "住宿", mime_type: "image/jpeg", size_bytes: 280000, used_in: "住宿推薦" },
  { id: "media-3", url: "https://images.unsplash.com/photo-1563245372-f21724e3856d", title: "上海美食", alt_text: "上海小吃", category: "美食", mime_type: "image/jpeg", size_bytes: 210000, used_in: "美食清單" }
];

const merchantRows: AdminRecord[] = [
  { id: "merchant-1", name: "外灘精選餐酒館", merchant_type: "restaurant", address: "黃浦區外灘", phone: "+86 21 0000 0001", image_url: "", cooperation_status: "active", plan: "premium", ad_start_at: "2026-05-01", ad_end_at: "2026-08-01", related_type: "restaurant", related_id: restaurants[0]?.id, is_map_pinned: true, is_home_featured: true, notes: "首頁推薦與地圖置頂" },
  { id: "merchant-2", name: "南京路伴手禮店", merchant_type: "shop", address: "南京路步行街", phone: "+86 21 0000 0002", image_url: "", cooperation_status: "pending", plan: "standard", ad_start_at: "2026-06-01", ad_end_at: "2026-09-01", related_type: "attraction", related_id: attractions[4]?.id, is_map_pinned: false, is_home_featured: false, notes: "待確認素材" }
];

const seoRows: AdminRecord[] = [
  { id: "seo-home", page: "首頁", path: "/", meta_title: "上海自由行攻略", meta_description: "台灣旅客上海自由行完整攻略", og_image: "已設定", issue: "通過", severity: "low" },
  { id: "seo-missing-og", page: "住宿列表", path: "/hotels", meta_title: "上海住宿推薦", meta_description: "已設定", og_image: "缺少", issue: "缺少 OG Image", severity: "medium" },
  { id: "seo-redirect", page: "舊迪士尼攻略", path: "/old-disney-guide", meta_title: "", meta_description: "", og_image: "", issue: "需建立 301 Redirect", severity: "high" }
];

const roleRows: AdminRecord[] = [
  { id: "role-admin", role: "admin", description: "全部權限", permissions: "所有後台模組", users: 1 },
  { id: "role-editor", role: "editor", description: "內容管理", permissions: "文章、景點、美食、住宿、SEO", users: 1 },
  { id: "role-ads", role: "ads_manager", description: "廣告與分潤", permissions: "Adsense、Affiliate、商家", users: 1 },
  { id: "role-merchant", role: "merchant", description: "商家資料", permissions: "自己的商家資料", users: 1 },
  { id: "role-user", role: "user", description: "一般會員", permissions: "前台收藏與個人資料", users: 128 }
];

const importRows: AdminRecord[] = [
  { id: "import-articles", resource: "articles", action: "CSV 匯入文章", status: "ready", last_run: "2026-05-20 10:30", total_rows: 120, success_count: 118, error_count: 2 },
  { id: "export-users", resource: "users", action: "匯出會員 CSV", status: "ready", last_run: "2026-05-21 09:12", total_rows: 132, success_count: 132, error_count: 0 },
  { id: "import-hotels", resource: "hotels", action: "批次匯入住宿", status: "draft", last_run: "", total_rows: 0, success_count: 0, error_count: 0 }
];

const settingsRows: AdminRecord[] = [
  { id: "setting-site-name", key: "site_name", label: "網站名稱", value: "上海旅遊攻略網", group: "brand" },
  { id: "setting-contact-email", key: "contact_email", label: "聯絡 Email", value: "hello@shinehai.travel", group: "contact" },
  { id: "setting-ga4", key: "ga4_measurement_id", label: "GA4 ID", value: "", group: "analytics" },
  { id: "setting-adsense", key: "adsense_client_id", label: "Google Adsense Client ID", value: "", group: "ads" },
  { id: "setting-travelpayouts-marker", key: "travelpayouts_marker", label: "Travelpayouts Marker", value: "", group: "affiliate" },
  { id: "setting-travelpayouts-trs", key: "travelpayouts_trs", label: "Travelpayouts Project ID / TRS", value: "", group: "affiliate" },
  { id: "setting-mapbox", key: "mapbox_token", label: "Mapbox Token", value: "", group: "map" }
];

const auditRows: AdminRecord[] = [
  { id: "audit-1", actor: "admin@shinehai.travel", action: "update", table_name: "articles", record_id: articles[0]?.id, before_data: "status=draft", after_data: "status=published", created_at: "2026-05-22 09:20" },
  { id: "audit-2", actor: "editor@shinehai.travel", action: "create", table_name: "attractions", record_id: attractions[0]?.id, before_data: "", after_data: "name=外灘", created_at: "2026-05-22 10:02" },
  { id: "audit-3", actor: "ads@shinehai.travel", action: "update", table_name: "affiliate_links", record_id: affiliateLinks[0]?.id, before_data: "is_active=false", after_data: "is_active=true", created_at: "2026-05-22 11:18" }
];

function config(configValue: AdminResourceConfig): AdminResourceConfig {
  return configValue;
}

export const adminResourceConfigs = {
  attractions: config({
    title: "景點管理",
    description: "管理景點分類、地區、座標、票價、交通、圖片集、SEO、相關內容與 Klook 票券綁定。",
    resourceLabel: "景點",
    apiResource: "attractions",
    rows: attractionRows,
    columns: basePlaceColumns,
    fields: [
      ...basePlaceFields,
      { key: "english_name", label: "英文名稱" },
      { key: "category", label: "景點分類", type: "select", options: ["必去", "免費", "親子", "夜景", "情侶"].map((value) => ({ label: value, value })) },
      { key: "opening_hours", label: "開放時間" },
      { key: "ticket_price", label: "門票價格" },
      { key: "transport_info", label: "交通方式", type: "textarea", span: "full" },
      { key: "related_food", label: "附近美食綁定", type: "tags", span: "full" },
      { key: "related_hotels", label: "附近住宿綁定", type: "tags", span: "full" },
      { key: "related_articles", label: "相關文章綁定", type: "tags", span: "full" },
      { key: "klook_link", label: "Klook 門票連結", span: "full" }
    ],
    filters: [
      { key: "status", label: "狀態", options: statusOptions },
      { key: "district", label: "地區", options: districtOptions }
    ],
    bulkActions: defaultStatusActions,
    searchableKeys: ["name", "slug", "district", "category", "tags"],
    dbFields: [...baseDbFields, "english_name", "opening_hours", "ticket_price", "transport_info", "category", "tags"],
    stats: [stat("上架景點", attractionRows.filter((row) => row.status === "published").length), stat("地圖置頂", attractionRows.filter((row) => row.is_map_pinned).length), stat("首頁推薦", attractionRows.filter((row) => row.is_featured).length)],
    featureSections: contentFeatures
  }),
  food: config({
    title: "美食管理",
    description: "管理餐廳、菜系、人均消費、菜單圖片、商家廣告、附近內容與 SEO。",
    resourceLabel: "餐廳",
    apiResource: "food",
    rows: restaurantRows,
    columns: [
      ...basePlaceColumns.slice(0, 3),
      { key: "cuisine_type", label: "菜系", sortable: true },
      { key: "average_price", label: "人均", sortable: true, align: "right" },
      ...basePlaceColumns.slice(4)
    ],
    fields: [
      ...basePlaceFields,
      { key: "cuisine_type", label: "菜系", type: "select", options: ["火鍋", "小籠包", "米其林", "咖啡廳", "酒吧", "本幫菜", "夜宵"].map((value) => ({ label: value, value })) },
      { key: "average_price", label: "人均消費", type: "number" },
      { key: "phone", label: "電話" },
      { key: "opening_hours", label: "營業時間" },
      { key: "menu_images", label: "菜單圖片", type: "tags", span: "full" },
      { key: "related_attractions", label: "附近景點綁定", type: "tags", span: "full" },
      { key: "related_hotels", label: "附近住宿綁定", type: "tags", span: "full" },
      { key: "merchant_ad", label: "商家廣告綁定", span: "full" }
    ],
    filters: [
      { key: "status", label: "狀態", options: statusOptions },
      { key: "district", label: "地區", options: districtOptions }
    ],
    bulkActions: defaultStatusActions,
    searchableKeys: ["name", "slug", "district", "cuisine_type"],
    dbFields: [...baseDbFields, "phone", "opening_hours", "average_price", "cuisine_type", "menu_images"],
    stats: [stat("上架餐廳", restaurantRows.filter((row) => row.status === "published").length), stat("商家廣告", restaurantRows.filter((row) => row.merchant_ad).length), stat("首頁推薦", restaurantRows.filter((row) => row.is_featured).length)],
    featureSections: contentFeatures
  }),
  hotels: config({
    title: "住宿管理",
    description: "管理飯店星級、價格區間、住宿分潤 URL、附近內容、SEO 與熱門住宿排序。",
    resourceLabel: "飯店",
    apiResource: "hotels",
    rows: hotelRows,
    columns: [
      ...basePlaceColumns.slice(0, 3),
      { key: "star_rating", label: "星級", sortable: true, align: "right" },
      { key: "price_range", label: "價格" },
      ...basePlaceColumns.slice(4)
    ],
    fields: [
      ...basePlaceFields,
      { key: "star_rating", label: "星級", type: "number" },
      { key: "price_range", label: "價格區間" },
      { key: "agoda_url", label: "Agoda URL", type: "url", span: "full" },
      { key: "booking_url", label: "Booking URL", type: "url", span: "full" },
      { key: "trip_url", label: "Trip.com URL", type: "url", span: "full" },
      { key: "klook_stay_url", label: "Klook Stay URL 預留", type: "url", span: "full" },
      { key: "related_attractions", label: "附近景點綁定", type: "tags", span: "full" },
      { key: "related_food", label: "附近美食綁定", type: "tags", span: "full" },
      { key: "related_articles", label: "相關文章綁定", type: "tags", span: "full" }
    ],
    filters: [
      { key: "status", label: "狀態", options: statusOptions },
      { key: "district", label: "地區", options: districtOptions }
    ],
    bulkActions: defaultStatusActions,
    searchableKeys: ["name", "slug", "district", "price_range"],
    dbFields: [...baseDbFields, "star_rating", "price_range", "agoda_url", "booking_url", "trip_url", "klook_stay_url"],
    stats: [stat("上架住宿", hotelRows.filter((row) => row.status === "published").length), stat("五星飯店", hotelRows.filter((row) => Number(row.star_rating) >= 5).length), stat("首頁推薦", hotelRows.filter((row) => row.is_featured).length)],
    featureSections: contentFeatures
  }),
  map: config({
    title: "地圖資料管理",
    description: "集中管理景點、美食、住宿與商家 marker，支援 icon、置頂、付費曝光、顯示狀態與座標修正。",
    resourceLabel: "Marker",
    rows: markerRows,
    columns: [
      { key: "name", label: "名稱", sortable: true },
      { key: "marker_type", label: "類型", sortable: true },
      { key: "icon", label: "Icon" },
      { key: "latitude", label: "緯度" },
      { key: "longitude", label: "經度" },
      { key: "is_visible_label", label: "顯示" },
      { key: "is_map_pinned", label: "置頂", status: true }
    ],
    fields: [
      { key: "name", label: "名稱" },
      { key: "marker_type", label: "Marker 類型", type: "select", options: ["景點", "美食", "住宿", "咖啡廳", "酒吧", "購物", "商家"].map((value) => ({ label: value, value })) },
      { key: "category", label: "分類" },
      { key: "icon", label: "Marker Icon" },
      { key: "latitude", label: "緯度", type: "number" },
      { key: "longitude", label: "經度", type: "number" },
      { key: "is_visible", label: "地圖顯示", type: "boolean" },
      { key: "is_map_pinned", label: "置頂 Marker", type: "boolean" },
      { key: "is_paid_promoted", label: "付費曝光", type: "boolean" }
    ],
    filters: [{ key: "marker_type", label: "Marker 類型", options: ["景點", "美食", "住宿", "咖啡廳", "酒吧", "購物", "商家"].map((value) => ({ label: value, value })) }],
    bulkActions: [
      { id: "show", label: "批次顯示", kind: "set-active", key: "is_visible", value: true },
      { id: "hide", label: "批次隱藏", kind: "set-active", key: "is_visible", value: false }
    ],
    stats: [stat("Marker 總數", markerRows.length), stat("置頂 Marker", markerRows.filter((row) => row.is_map_pinned).length), stat("付費曝光", markerRows.filter((row) => row.is_paid_promoted).length)],
    featureSections: [{ title: "座標工具", items: ["經緯度快速修正", "批次匯入 Google Map 座標", "Mapbox / Google Maps 整合預留"] }]
  }),
  "affiliate-links": config({
    title: "Affiliate 分潤管理",
    description: "管理 Agoda、Booking、Klook、KKday、Trip.com、Travelpayouts 與自訂分潤連結，並支援綁定內容與自動推薦規則。",
    resourceLabel: "Affiliate Link",
    apiResource: "affiliate-links",
    rows: affiliateRows,
    columns: [
      { key: "title", label: "名稱", sortable: true },
      { key: "provider", label: "Provider", sortable: true },
      { key: "type", label: "類型", sortable: true },
      { key: "related_type", label: "綁定" },
      { key: "click_count", label: "點擊", sortable: true, align: "right" },
      { key: "is_active_label", label: "啟用" }
    ],
    fields: [
      { key: "title", label: "名稱" },
      { key: "provider", label: "Provider", type: "select", options: providerOptions },
      { key: "type", label: "類型", type: "select", options: ["hotel", "ticket", "food", "tour", "transport"].map((value) => ({ label: value, value })) },
      { key: "related_type", label: "綁定內容類型", type: "select", options: ["article", "attraction", "restaurant", "hotel"].map((value) => ({ label: value, value })) },
      { key: "related_id", label: "綁定內容 ID" },
      { key: "url", label: "Affiliate URL", type: "url", span: "full" },
      { key: "original_url", label: "原始品牌 URL", type: "url", span: "full" },
      { key: "sub_id", label: "Sub ID / 追蹤參數" },
      { key: "commission_note", label: "佣金備註", type: "textarea", span: "full" },
      { key: "conversion_note", label: "轉換備註", type: "textarea", span: "full" },
      { key: "auto_rule", label: "自動推薦規則", type: "textarea", span: "full" },
      { key: "sort_order", label: "排序", type: "number" },
      { key: "is_active", label: "啟用", type: "boolean" }
    ],
    filters: [
      { key: "provider", label: "Provider", options: providerOptions },
      { key: "is_active", label: "狀態", options: activeOptions }
    ],
    bulkActions: defaultActiveActions,
    dbFields: ["title", "provider", "type", "related_type", "related_id", "url", "original_url", "sub_id", "commission_note", "is_active", "sort_order", "auto_rule"],
    stats: [stat("連結數", affiliateRows.length), stat("今日點擊", 86), stat("30日點擊", 2140)],
    featureSections: [
      { title: "Travelpayouts 串接", items: ["後台可生成 partner links", "支援 marker、trs、shorten 與 sub_id", "成功後可直接寫入 Affiliate Links"] },
      { title: "自動推薦", items: ["依 provider、類型與內容關鍵字推薦", "文章底部 Affiliate Links 綁定", "點擊統計與排序優化"] }
    ]
  }),
  "affiliate-clicks": config({
    title: "Affiliate 點擊統計",
    description: "追蹤點擊時間、Provider、來源頁、使用者、Referrer、裝置與瀏覽器，提供今日、7日、30日排行。",
    resourceLabel: "點擊紀錄",
    rows: clickRows,
    columns: [
      { key: "clicked_at", label: "時間", sortable: true },
      { key: "provider", label: "Provider", sortable: true },
      { key: "title", label: "Link 名稱" },
      { key: "source_page", label: "來源頁面" },
      { key: "user", label: "使用者" },
      { key: "device", label: "裝置" },
      { key: "browser", label: "瀏覽器" }
    ],
    fields: [
      { key: "clicked_at", label: "點擊時間", readOnly: true },
      { key: "provider", label: "Provider", readOnly: true },
      { key: "title", label: "Link 名稱", readOnly: true },
      { key: "source_page", label: "來源頁面", readOnly: true },
      { key: "referrer", label: "Referrer", readOnly: true },
      { key: "device", label: "裝置", readOnly: true },
      { key: "browser", label: "瀏覽器", readOnly: true }
    ],
    filters: [{ key: "provider", label: "Provider", options: providerOptions }],
    stats: [stat("今日點擊", 86), stat("7日點擊", 482), stat("30日點擊", 2140)],
    featureSections: [{ title: "分析維度", items: ["Provider 排行", "來源頁面排行", "裝置 / 瀏覽器拆解", "轉換備註串接預留"] }]
  }),
  ads: config({
    title: "廣告版位管理",
    description: "管理 Google Adsense 與自售 Banner，包含版位、尺寸、Slot ID、投放日期、點擊與曝光預留。",
    resourceLabel: "廣告",
    apiResource: "ads",
    rows: adRows,
    columns: [
      { key: "name", label: "廣告名稱", sortable: true },
      { key: "placement", label: "位置", sortable: true },
      { key: "size", label: "尺寸" },
      { key: "ad_type", label: "類型" },
      { key: "click_count", label: "點擊", sortable: true, align: "right" },
      { key: "is_active_label", label: "啟用" }
    ],
    fields: [
      { key: "name", label: "廣告名稱" },
      { key: "placement", label: "廣告位置", type: "select", options: ["home_top_970x250", "home_middle_728x90", "home_sidebar_300x250", "article_top_728x90", "article_middle_300x250", "article_bottom_336x280", "attraction_middle_300x250", "attraction_related_bottom_728x90", "food_middle_300x250", "hotel_middle_300x250", "map_top_970x250", "map_sidebar_300x250"].map((value) => ({ label: value, value })) },
      { key: "size", label: "廣告尺寸" },
      { key: "ad_type", label: "廣告類型", type: "select", options: ["adsense", "direct"].map((value) => ({ label: value, value })) },
      { key: "adsense_slot", label: "Adsense Slot ID" },
      { key: "image_url", label: "圖片 URL", type: "url", span: "full" },
      { key: "target_url", label: "跳轉 URL", type: "url", span: "full" },
      { key: "starts_at", label: "開始時間", type: "datetime" },
      { key: "ends_at", label: "結束時間", type: "datetime" },
      { key: "sort_order", label: "排序", type: "number" },
      { key: "is_active", label: "啟用", type: "boolean" }
    ],
    filters: [{ key: "ad_type", label: "類型", options: ["adsense", "direct"].map((value) => ({ label: value, value })) }],
    bulkActions: defaultActiveActions,
    dbFields: ["name", "placement", "size", "ad_type", "adsense_slot", "image_url", "target_url", "is_active", "starts_at", "ends_at", "sort_order"],
    stats: [stat("版位數", adRows.length), stat("今日點擊", 72), stat("曝光預留", "12.4K")],
    featureSections: [{ title: "投放管理", items: ["Adsense Slot ID", "自售 Banner 圖片與跳轉", "開始 / 結束時間", "點擊與曝光數預留"] }]
  }),
  users: config({
    title: "會員管理",
    description: "查看會員、收藏、註冊時間、登入方式，並管理角色、停權、備註與 CSV 匯出。",
    resourceLabel: "會員",
    apiResource: "users",
    rows: userRows,
    columns: [
      { key: "email", label: "Email", sortable: true },
      { key: "display_name", label: "名稱" },
      { key: "role", label: "角色", status: true },
      { key: "status", label: "狀態", status: true },
      { key: "provider", label: "登入方式" },
      { key: "favorite_count", label: "收藏", sortable: true, align: "right" }
    ],
    fields: [
      { key: "email", label: "Email" },
      { key: "display_name", label: "顯示名稱" },
      { key: "role", label: "角色", type: "select", options: ["user", "editor", "admin", "merchant"].map((value) => ({ label: value, value })) },
      { key: "status", label: "狀態", type: "select", options: ["active", "suspended"].map((value) => ({ label: value, value })) },
      { key: "provider", label: "登入方式" },
      { key: "notes", label: "備註", type: "textarea", span: "full" }
    ],
    filters: [
      { key: "role", label: "角色", options: ["user", "editor", "admin", "merchant"].map((value) => ({ label: value, value })) },
      { key: "status", label: "狀態", options: ["active", "suspended"].map((value) => ({ label: value, value })) }
    ],
    stats: [stat("會員總數", 132), stat("本月新增", 48), stat("停權會員", 1)],
    featureSections: [{ title: "會員操作", items: ["搜尋會員", "查看會員收藏", "角色管理", "停權 / 啟用", "匯出會員 CSV"] }]
  }),
  categories: config({
    title: "分類管理",
    description: "管理文章、景點、美食、住宿分類，含 SEO Title、Description、封面圖、排序與啟用狀態。",
    resourceLabel: "分類",
    rows: categoryRows,
    columns: [
      { key: "name", label: "分類名稱", sortable: true },
      { key: "slug", label: "Slug", sortable: true },
      { key: "type", label: "類型", sortable: true },
      { key: "sort_order", label: "排序", sortable: true },
      { key: "is_active_label", label: "啟用" }
    ],
    fields: [
      { key: "name", label: "分類名稱" },
      { key: "slug", label: "Slug" },
      { key: "type", label: "分類類型", type: "select", options: ["article", "attraction", "food", "hotel"].map((value) => ({ label: value, value })) },
      { key: "seo_title", label: "SEO Title", span: "full" },
      { key: "seo_description", label: "SEO Description", type: "textarea", span: "full" },
      { key: "cover_image", label: "分類封面圖", type: "url", span: "full" },
      { key: "sort_order", label: "排序", type: "number" },
      { key: "is_active", label: "啟用", type: "boolean" }
    ],
    filters: [{ key: "type", label: "類型", options: ["article", "attraction", "food", "hotel"].map((value) => ({ label: value, value })) }],
    bulkActions: defaultActiveActions,
    stats: [stat("分類總數", categoryRows.length), stat("文章分類", categoryRows.filter((row) => row.type === "article").length)]
  }),
  tags: config({
    title: "標籤管理",
    description: "管理全站標籤、SEO、封面圖、排序與啟用狀態。",
    resourceLabel: "標籤",
    rows: tagRows,
    columns: [
      { key: "name", label: "標籤名稱", sortable: true },
      { key: "slug", label: "Slug" },
      { key: "type", label: "類型" },
      { key: "sort_order", label: "排序", sortable: true },
      { key: "is_active_label", label: "啟用" }
    ],
    fields: [
      { key: "name", label: "標籤名稱" },
      { key: "slug", label: "Slug" },
      { key: "type", label: "類型" },
      { key: "seo_title", label: "SEO Title", span: "full" },
      { key: "seo_description", label: "SEO Description", type: "textarea", span: "full" },
      { key: "cover_image", label: "封面圖", type: "url", span: "full" },
      { key: "sort_order", label: "排序", type: "number" },
      { key: "is_active", label: "啟用", type: "boolean" }
    ],
    bulkActions: defaultActiveActions,
    stats: [stat("標籤數", tagRows.length), stat("啟用標籤", tagRows.length)]
  }),
  seo: config({
    title: "SEO 管理中心",
    description: "管理全站 SEO 設定、Sitemap、Robots、Schema、文章 SEO 檢查、404 與 301 Redirect。",
    resourceLabel: "SEO 檢查",
    rows: seoRows,
    columns: [
      { key: "page", label: "頁面", sortable: true },
      { key: "path", label: "路徑" },
      { key: "meta_title", label: "Meta Title" },
      { key: "og_image", label: "OG Image" },
      { key: "issue", label: "提醒", status: true },
      { key: "severity", label: "等級", status: true }
    ],
    fields: [
      { key: "page", label: "頁面" },
      { key: "path", label: "路徑" },
      { key: "meta_title", label: "Meta Title", span: "full" },
      { key: "meta_description", label: "Meta Description", type: "textarea", span: "full" },
      { key: "og_image", label: "OG Image" },
      { key: "issue", label: "SEO 提醒" },
      { key: "severity", label: "等級", type: "select", options: ["low", "medium", "high"].map((value) => ({ label: value, value })) }
    ],
    filters: [{ key: "severity", label: "等級", options: ["low", "medium", "high"].map((value) => ({ label: value, value })) }],
    stats: [stat("Sitemap 狀態", "正常"), stat("缺 Meta Description", 1), stat("缺 OG Image", 1), stat("301 Redirect", 1)],
    featureSections: [{ title: "SEO 工具", items: ["首頁 Meta 設定", "Robots 設定", "Schema 管理", "Slug 重複提醒", "404 頁面與 301 Redirect 管理"] }]
  }),
  media: config({
    title: "媒體庫",
    description: "管理圖片上傳、搜尋、分類、Alt Text、Title、使用位置與未使用圖片清理。",
    resourceLabel: "媒體",
    rows: mediaRows,
    columns: [
      { key: "title", label: "圖片標題", sortable: true },
      { key: "category", label: "分類" },
      { key: "alt_text", label: "Alt Text" },
      { key: "mime_type", label: "格式" },
      { key: "size_bytes", label: "大小", sortable: true, align: "right" },
      { key: "used_in", label: "使用位置" }
    ],
    fields: [
      { key: "url", label: "圖片 URL", type: "url", span: "full" },
      { key: "title", label: "圖片 Title" },
      { key: "alt_text", label: "圖片 Alt Text" },
      { key: "category", label: "圖片分類" },
      { key: "used_in", label: "使用位置記錄", type: "textarea", span: "full" }
    ],
    stats: [stat("圖片數", mediaRows.length), stat("未使用圖片", 1), stat("壓縮預留", "待接入")],
    featureSections: [{ title: "媒體流程", items: ["圖片上傳 placeholder", "圖片壓縮預留", "Alt Text 與 Title 管理", "刪除未使用圖片"] }]
  }),
  merchants: config({
    title: "商家廣告管理",
    description: "管理合作商家、方案、廣告日期、綁定內容、地圖置頂、首頁推薦與備註。",
    resourceLabel: "商家",
    rows: merchantRows,
    columns: [
      { key: "name", label: "商家名稱", sortable: true },
      { key: "merchant_type", label: "類型" },
      { key: "cooperation_status", label: "合作狀態", status: true },
      { key: "plan", label: "方案" },
      { key: "ad_end_at", label: "結束日期", sortable: true },
      { key: "is_map_pinned", label: "地圖置頂", status: true }
    ],
    fields: [
      { key: "name", label: "商家名稱" },
      { key: "merchant_type", label: "商家類型" },
      { key: "address", label: "地址", span: "full" },
      { key: "phone", label: "電話" },
      { key: "image_url", label: "圖片", type: "url", span: "full" },
      { key: "cooperation_status", label: "合作狀態", type: "select", options: ["pending", "active", "paused", "ended"].map((value) => ({ label: value, value })) },
      { key: "plan", label: "付費方案" },
      { key: "ad_start_at", label: "廣告開始日期", type: "datetime" },
      { key: "ad_end_at", label: "廣告結束日期", type: "datetime" },
      { key: "related_type", label: "綁定內容類型" },
      { key: "related_id", label: "綁定內容 ID" },
      { key: "is_map_pinned", label: "地圖置頂", type: "boolean" },
      { key: "is_home_featured", label: "首頁推薦", type: "boolean" },
      { key: "notes", label: "備註", type: "textarea", span: "full" }
    ],
    stats: [stat("合作商家", merchantRows.length), stat("進行中", 1), stat("地圖置頂", 1)],
    featureSections: [{ title: "商家曝光", items: ["綁定美食 / 景點 / 住宿", "地圖置頂", "首頁推薦", "付費方案與投放日期"] }]
  }),
  roles: config({
    title: "權限管理",
    description: "以 RBAC 管理 admin、editor、ads_manager、merchant、user 的後台權限。",
    resourceLabel: "角色",
    rows: roleRows,
    columns: [
      { key: "role", label: "角色", status: true },
      { key: "description", label: "說明" },
      { key: "permissions", label: "權限" },
      { key: "users", label: "使用者數", sortable: true, align: "right" }
    ],
    fields: [
      { key: "role", label: "角色" },
      { key: "description", label: "說明" },
      { key: "permissions", label: "權限", type: "textarea", span: "full" }
    ],
    stats: [stat("角色數", roleRows.length), stat("管理角色", 3), stat("商家角色", 1)],
    featureSections: [{ title: "RBAC 規則", items: ["admin 全權限", "editor 管理內容", "ads_manager 管理廣告與 Affiliate", "merchant 僅管理自己的商家資料"] }]
  }),
  "import-export": config({
    title: "資料匯入 / 匯出",
    description: "批次匯入文章、景點、美食、住宿、Affiliate Links，並匯出內容、會員與點擊紀錄。",
    resourceLabel: "匯入匯出工作",
    rows: importRows,
    columns: [
      { key: "action", label: "工作" },
      { key: "resource", label: "資源" },
      { key: "status", label: "狀態", status: true },
      { key: "last_run", label: "上次執行" },
      { key: "success_count", label: "成功", sortable: true, align: "right" },
      { key: "error_count", label: "錯誤", sortable: true, align: "right" }
    ],
    fields: [
      { key: "resource", label: "資源", type: "select", options: ["articles", "attractions", "food", "hotels", "affiliate_links", "users", "affiliate_clicks"].map((value) => ({ label: value, value })) },
      { key: "action", label: "操作" },
      { key: "status", label: "狀態" },
      { key: "last_run", label: "上次執行" }
    ],
    stats: [stat("可匯入資源", 5), stat("可匯出資源", 6), stat("最近錯誤", 2)],
    featureSections: [{ title: "CSV 流程", items: ["批次匯入文章 CSV", "批次匯入景點 / 美食 / 住宿 CSV", "匯出會員與 Affiliate 點擊紀錄", "import_logs 記錄錯誤"] }]
  }),
  settings: config({
    title: "系統設定",
    description: "管理網站名稱、Logo、Favicon、社群連結、Analytics、Adsense、地圖 Token 與 Affiliate 預設參數。",
    resourceLabel: "設定",
    rows: settingsRows,
    columns: [
      { key: "label", label: "設定項目", sortable: true },
      { key: "key", label: "Key" },
      { key: "value", label: "值" },
      { key: "group", label: "群組", sortable: true }
    ],
    fields: [
      { key: "label", label: "設定名稱" },
      { key: "key", label: "Key" },
      { key: "value", label: "Value", span: "full" },
      { key: "group", label: "群組" }
    ],
    stats: [stat("設定群組", 6), stat("Analytics", "預留"), stat("Maps", "預留")],
    featureSections: [{ title: "環境設定", items: ["GA4 ID", "Google Search Console 驗證碼", "Microsoft Clarity ID", "Google Adsense Client ID", "Mapbox / Google Maps Key", "Travelpayouts 預設參數"] }]
  }),
  "audit-logs": config({
    title: "Audit Logs",
    description: "記錄操作人、操作類型、資料表、資料 ID、操作前後資料與操作時間。",
    resourceLabel: "Audit Log",
    rows: auditRows,
    columns: [
      { key: "created_at", label: "時間", sortable: true },
      { key: "actor", label: "操作人" },
      { key: "action", label: "操作", status: true },
      { key: "table_name", label: "資料表" },
      { key: "record_id", label: "資料 ID" },
      { key: "after_data", label: "操作後資料" }
    ],
    fields: [
      { key: "actor", label: "操作人", readOnly: true },
      { key: "action", label: "操作類型", readOnly: true },
      { key: "table_name", label: "資料表", readOnly: true },
      { key: "record_id", label: "資料 ID", readOnly: true },
      { key: "before_data", label: "操作前資料", type: "textarea", readOnly: true, span: "full" },
      { key: "after_data", label: "操作後資料", type: "textarea", readOnly: true, span: "full" }
    ],
    stats: [stat("今日操作", 18), stat("內容異動", 11), stat("廣告異動", 4)],
    featureSections: [{ title: "稽核欄位", items: ["操作人", "操作類型", "資料表", "資料 ID", "before_data / after_data JSONB", "操作時間"] }]
  })
};

export const articleAdminFeatures = articleFeatureSections;
