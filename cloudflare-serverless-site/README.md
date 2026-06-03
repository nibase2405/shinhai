# 上海旅遊攻略網 Cloudflare Serverless Project

這是獨立於 Next.js 主站的 Cloudflare Workers 專案，可作為邊緣入口、活動頁、快取層或輕量 API。

## 安裝

```bash
pnpm install
cp .dev.vars.example .dev.vars
```

## 本機開發

```bash
pnpm dev
```

預設網址：

```text
http://127.0.0.1:8787
```

## 可用路由

- `/`：Serverless landing page
- `/api/health`：健康檢查
- `/api/search?q=外灘&type=景點&district=黃浦區`：示範搜尋 API
- `/robots.txt`、`/favicon.svg`：由 Workers Assets 提供

## Cloudflare CLI

```bash
pnpm exec wrangler login
pnpm exec wrangler whoami
pnpm dry-run
pnpm deploy
```

Cloudflare 後台如果從 repo 根目錄執行 `npx wrangler deploy`，會使用根目錄的 `wrangler.jsonc`，它會明確指向此子專案：

```text
main = cloudflare-serverless-site/src/index.ts
assets = cloudflare-serverless-site/public
```

## GitHub Actions

`.github/workflows/cloudflare-serverless-site.yml` 會在 PR / push 修改此資料夾時執行驗證：

```text
pnpm --filter shanghai-travel-cloudflare-site cf:types
pnpm --filter shanghai-travel-cloudflare-site typecheck
pnpm --filter shanghai-travel-cloudflare-site dry-run
```

正式部署採手動觸發 `workflow_dispatch`，並需要在 GitHub Secrets 設定：

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

## 環境變數

`wrangler.jsonc` 目前放的是非敏感 vars：

```text
SITE_NAME=上海旅遊攻略網
ORIGIN_SITE_URL=https://kimbowl.cc
```

若之後要接 API token 或 Supabase service role，請使用 Wrangler secret：

```bash
pnpm exec wrangler secret put SOME_SECRET_NAME
```

不要把 secret 寫入 `wrangler.jsonc` 或 `.dev.vars` 後提交。

## GitHub Actions

此專案有獨立 workflow：`.github/workflows/cloudflare-serverless-site.yml`。

- push / pull request：只驗證 `typecheck` 與 `wrangler deploy --dry-run`
- manual run：在 GitHub Actions 手動執行 `Cloudflare Serverless Site` 才會正式部署

正式部署前請在 GitHub repo secrets 設定：

```text
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
```
