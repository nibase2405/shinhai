# 上海旅遊攻略網 MVP 1.0

上海旅遊攻略網站 MVP，面向台灣人與華語自由行旅客。功能包含 SEO 文章、景點、美食、住宿、地圖、會員收藏、AdSense 版位、Agoda / Booking / Klook affiliate link 管理與點擊追蹤。

## 技術架構

- Next.js App Router + TypeScript
- TailwindCSS + shadcn/ui style components
- Supabase Auth / Database / RLS
- Google Maps / Mapbox provider-ready 架構
- Next.js Metadata API、`sitemap.ts`、`robots.ts`、JSON-LD
- GA4、Google Search Console、Microsoft Clarity、Google AdSense 預留

## 安裝方式

```bash
pnpm install
pnpm dev
```

預設網址：

```bash
http://localhost:3000
```

## 環境變數

複製 `.env.example` 為 `.env.local`：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
GA4_MEASUREMENT_ID=
CLARITY_PROJECT_ID=
TRAVELPAYOUTS_API_TOKEN=
TRAVELPAYOUTS_MARKER=
TRAVELPAYOUTS_TRS=
```

## Supabase 設定

1. 建立 Supabase project。
2. 到 SQL Editor 依序執行 `supabase/migrations` 內的 SQL migration。
3. 再執行 `supabase/seed.sql` 匯入 MVP 假資料。
4. 在 Authentication 啟用 Email login。
5. 若要建立後台管理員，先用 Email Auth 建立帳號，再將該使用者的 `profiles.role` 改為 `admin`，且 `profiles.status` 保持 `active`。

Schema 已啟用 RLS：

- 一般使用者只能讀 published articles 與公開景點/美食/住宿。
- 使用者只能管理自己的 `favorites`。
- `profiles` 使用者只能更新自己的資料。
- admin 可 CRUD 所有內容資料。
- affiliate click tracking 透過 server API + service role 寫入。

## Google Maps / Mapbox

目前 `MapView` 是 provider-ready placeholder，已支援 marker 篩選、搜尋與 popup。填入以下任一環境變數後，可在 `src/components/map/map-view.tsx` 內替換成正式 provider：

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

## AdSense

`AdsenseSlot` 支援真實 slot，也支援 placeholder：

```tsx
<AdsenseSlot placement="home_top_970x250" size="970x250" slotId="1234567890" />
```

尚未設定 `NEXT_PUBLIC_ADSENSE_CLIENT_ID` 或 `slotId` 時，會顯示灰色 placeholder。

## Affiliate 設定

Affiliate links 集中於 `affiliate_links` 表與後台 `/admin/affiliate-links`。

前端使用 `AffiliateButton`：

```tsx
<AffiliateButton
  provider="klook"
  title="Klook 上海迪士尼門票"
  url="https://www.klook.com/"
  linkId="70000000-0000-4000-8000-000000000001"
  buttonText="查看優惠"
/>
```

流程：

1. 前端 POST `/api/affiliate-click`。
2. API 寫入 `affiliate_clicks`。
3. API 累加 `affiliate_links.click_count`。
4. API 回傳 affiliate URL。
5. 前端開新視窗跳轉。

正式上線前，請將 Agoda / Booking / Klook placeholder URL 換成各平台核發的 affiliate URL。

### Travelpayouts

後台 `/admin/travelpayouts` 可將完整品牌 URL 轉成 Travelpayouts partner link，成功後可直接寫入 `affiliate_links`。

需要設定：

```bash
TRAVELPAYOUTS_API_TOKEN=
TRAVELPAYOUTS_MARKER=
TRAVELPAYOUTS_TRS=
```

其中 `TRAVELPAYOUTS_API_TOKEN` 是 server-side secret，不要加 `NEXT_PUBLIC_`。`TRAVELPAYOUTS_TRS` 是已加入該品牌 program 的 Project ID。後台也支援暫時輸入 token / marker / trs 做單次測試。

## SEO

已實作：

- Root metadata 與各詳情頁 `generateMetadata`
- `/sitemap.xml`
- `/robots.txt`
- Breadcrumb JSON-LD
- Article JSON-LD
- FAQ JSON-LD
- TouristAttraction JSON-LD
- LocalBusiness / Restaurant JSON-LD
- Hotel JSON-LD
- Open Graph image

## 部署到 Vercel

1. Push repo 到 GitHub。
2. 在 Vercel 建立 Project 並選擇 Next.js。
3. 設定 `.env.local` 對應的 Environment Variables。
4. Build command 使用：

```bash
pnpm build
```

5. 部署後更新：

```bash
NEXT_PUBLIC_SITE_URL=https://你的正式網域
```

6. 到 Google Search Console 提交：

```bash
https://你的正式網域/sitemap.xml
```

## Cloudflare Serverless 部署

本專案目前不綁定 DigitalOcean Droplet，也不使用 GitHub Actions SSH 到 Droplet 部署。

Cloudflare Dashboard 請使用：

```text
Build command: pnpm cf:build
Deploy command: pnpm cf:deploy
Root directory: 留空
```

Cloudflare 相關設定：

```text
wrangler.jsonc
cloudflare-serverless-site/wrangler.jsonc
.github/workflows/cloudflare-serverless-site.yml
```

## 主要目錄

```text
src/app                      App Router pages / API routes
src/components               共用 UI、卡片、地圖、後台、會員元件
src/lib/data.ts              MVP seed data for UI fallback
src/lib/supabase             Browser / Server / Service-role clients
src/lib/seo.ts               JSON-LD helpers
src/types                    TypeScript content/database types
supabase/migrations          Supabase schema + RLS migration
supabase/seed.sql            MVP seed data
```

## Admin Operations Backend

本版本已將 `/admin` 升級為旅遊內容營運後台：

- `/admin/login`：後台管理員登入頁。所有 `/admin/*` 管理頁與 `/api/admin/*` route 都會驗證 Supabase session，且只允許 `profiles.role = 'admin'`、未停權的帳號使用。
- `src/proxy.ts` 會依 Supabase SSR 建議刷新 session cookie；管理頁在 server-side 使用 `supabase.auth.getUser()` 重新驗證登入者。
- `/admin/dashboard`：流量、內容、會員、Affiliate、廣告與待審內容總覽。
- `/admin/articles`：文章新增、編輯、刪除、批次操作、排程、SEO、FAQ Schema、Article Schema、相關文章、Affiliate Links、文內廣告位。
- `/admin/attractions`、`/admin/food`、`/admin/hotels`：內容狀態、地區、座標、圖片、SEO、首頁推薦、熱門、地圖置頂與關聯綁定。
- `/admin/map`、`/admin/affiliate-links`、`/admin/travelpayouts`、`/admin/affiliate-clicks`、`/admin/ads`、`/admin/users`、`/admin/categories`、`/admin/tags`、`/admin/seo`、`/admin/media`、`/admin/merchants`、`/admin/roles`、`/admin/import-export`、`/admin/settings`、`/admin/audit-logs`。
- 共用元件包含 AdminLayout、AdminSidebar、AdminHeader、AdminBreadcrumb、AdminDataTable、AdminForm、AdminImageUploader、AdminStatusBadge、AdminStatsCard、AdminChartCard、AdminFilterBar、AdminBulkActions、AdminPagination。
- Supabase migration `20260522001000_admin_operations_schema.sql` 補上 tags、media_assets、ad_clicks、merchants、redirects、site_settings、page_views、import_logs、audit_logs、content_relations、map_markers 與 RBAC/RLS policy。
