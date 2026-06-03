type Env = {
  ASSETS: Fetcher;
  SITE_NAME: string;
  ORIGIN_SITE_URL: string;
};

type SearchItem = {
  title: string;
  type: "景點" | "美食" | "住宿" | "購物";
  district: string;
  description: string;
  url: string;
};

const searchItems: SearchItem[] = [
  {
    title: "外灘",
    type: "景點",
    district: "黃浦區",
    description: "上海經典夜景、萬國建築群與自由行必訪景點。",
    url: "/attractions/the-bund"
  },
  {
    title: "上海迪士尼",
    type: "景點",
    district: "浦東新區",
    description: "親子旅遊、門票與一日遊行程推薦。",
    url: "/attractions/shanghai-disneyland"
  },
  {
    title: "南翔饅頭店",
    type: "美食",
    district: "黃浦區",
    description: "小籠包與豫園周邊經典美食。",
    url: "/food/nanxiang-mantou-dian"
  },
  {
    title: "上海外灘 W 酒店",
    type: "住宿",
    district: "虹口區",
    description: "外灘景觀、高端住宿與訂房推薦。",
    url: "/hotels/w-shanghai-the-bund"
  },
  {
    title: "南京路步行街",
    type: "購物",
    district: "黃浦區",
    description: "上海購物、伴手禮與夜間散步路線。",
    url: "/attractions/nanjing-road"
  }
];

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: env.SITE_NAME, runtime: "cloudflare-workers" });
    }

    if (url.pathname === "/api/search") {
      return json(search(url, env));
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return html(renderHome(env));
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    return html(renderNotFound(env), 404);
  }
};

export default worker;

function search(url: URL, env: Env) {
  const keyword = normalize(url.searchParams.get("q"));
  const district = normalize(url.searchParams.get("district"));
  const type = normalize(url.searchParams.get("type"));

  const results = searchItems.filter((item) => {
    const keywordMatched =
      !keyword ||
      normalize(item.title).includes(keyword) ||
      normalize(item.description).includes(keyword);
    const districtMatched = !district || normalize(item.district) === district;
    const typeMatched = !type || normalize(item.type) === type;
    return keywordMatched && districtMatched && typeMatched;
  });

  return {
    count: results.length,
    results: results.map((item) => ({
      ...item,
      url: new URL(item.url, env.ORIGIN_SITE_URL).toString()
    }))
  };
}

function renderHome(env: Env) {
  const cards = searchItems
    .map(
      (item) => `
        <article class="card">
          <span>${escapeHtml(item.type)} / ${escapeHtml(item.district)}</span>
          <h2>${escapeHtml(item.title)}</h2>
          <p>${escapeHtml(item.description)}</p>
          <a href="${escapeHtml(new URL(item.url, env.ORIGIN_SITE_URL).toString())}">查看主站攻略</a>
        </article>`
    )
    .join("");

  return `<!doctype html>
  <html lang="zh-Hant">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(env.SITE_NAME)} Cloudflare Serverless</title>
      <meta name="description" content="Cloudflare Workers 獨立 Serverless 站臺，可作為上海旅遊攻略網的邊緣入口、API 或活動頁。" />
      <link rel="icon" href="/favicon.svg" />
      <style>
        :root { color-scheme: light; font-family: Inter, "Noto Sans TC", system-ui, sans-serif; }
        body { margin: 0; background: #f6f8fb; color: #0f172a; }
        header { background: #fff; border-bottom: 1px solid #dbe3ef; }
        .wrap { max-width: 1120px; margin: 0 auto; padding: 28px 20px; }
        .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 20px; }
        .brand img { width: 40px; height: 40px; }
        .hero { padding: 56px 20px 32px; background: linear-gradient(135deg, #0b63ce, #12295a); color: white; }
        .hero h1 { margin: 0 0 12px; font-size: clamp(34px, 6vw, 64px); letter-spacing: 0; }
        .hero p { max-width: 720px; margin: 0; font-size: 18px; line-height: 1.8; color: #dbeafe; }
        .panel { margin-top: 24px; display: grid; grid-template-columns: 1fr 160px 140px auto; gap: 10px; }
        input, select, button { min-height: 44px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0 12px; font-size: 15px; }
        button { background: #f5a623; border-color: #f5a623; color: #111827; font-weight: 700; cursor: pointer; }
        .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .card { background: #fff; border: 1px solid #dbe3ef; border-radius: 8px; padding: 20px; box-shadow: 0 8px 20px rgb(15 23 42 / 6%); }
        .card span { color: #0b63ce; font-size: 13px; font-weight: 700; }
        .card h2 { margin: 10px 0 8px; font-size: 20px; }
        .card p { color: #475569; line-height: 1.7; }
        .card a { color: #0b63ce; font-weight: 700; text-decoration: none; }
        code { background: #e8eef7; padding: 3px 6px; border-radius: 6px; }
        @media (max-width: 760px) {
          .panel, .grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <header><div class="wrap brand"><img src="/favicon.svg" alt="" />${escapeHtml(env.SITE_NAME)} Cloudflare Project</div></header>
      <main>
        <section class="hero">
          <div class="wrap">
            <h1>上海自由行邊緣入口</h1>
            <p>這是一個獨立 Cloudflare Workers Serverless project，可作為主站前面的活動頁、搜尋 API、快取入口或輕量 landing page。</p>
            <form class="panel" action="/api/search" method="get">
              <input name="q" placeholder="搜尋景點、美食、住宿" />
              <select name="district">
                <option value="">全部行政區</option>
                <option>黃浦區</option>
                <option>浦東新區</option>
                <option>虹口區</option>
              </select>
              <select name="type">
                <option value="">全部類型</option>
                <option>景點</option>
                <option>美食</option>
                <option>住宿</option>
                <option>購物</option>
              </select>
              <button type="submit">搜尋 API</button>
            </form>
          </div>
        </section>
        <section class="wrap">
          <p>健康檢查：<code>/api/health</code>，搜尋 API：<code>/api/search?q=外灘&type=景點</code></p>
          <div class="grid">${cards}</div>
        </section>
      </main>
    </body>
  </html>`;
}

function renderNotFound(env: Env) {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><title>404 - ${escapeHtml(
    env.SITE_NAME
  )}</title></head><body><h1>找不到頁面</h1><p><a href="/">回首頁</a></p></body></html>`;
}

function html(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}

function json(data: unknown) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=30"
    }
  });
}

function normalize(value: string | null) {
  return (value ?? "").trim().toLowerCase();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
