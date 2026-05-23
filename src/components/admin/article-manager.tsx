"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import {
  Bold,
  CalendarClock,
  Copy,
  Eye,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  Megaphone,
  Pencil,
  Plus,
  Quote,
  Save,
  Search,
  Sparkles,
  Tags,
  Trash2
} from "lucide-react";
import { AdminBulkActions } from "@/components/admin/admin-bulk-actions";
import { AdminImageUploader } from "@/components/admin/admin-image-uploader";
import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { adPlacements, affiliateLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Article, Category, ContentStatus } from "@/types/content";

type ArticleForm = Omit<Article, "schema_faq_json"> & {
  schema_faq_json: Array<{ question: string; answer: string }>;
  related_articles: string[];
  affiliate_link_ids: string[];
  ad_strategy: string;
  sort_order: number;
};

type Notice = {
  type: "success" | "warning" | "error";
  text: string;
};

const statusOptions: Array<{ value: ContentStatus; label: string }> = [
  { value: "draft", label: "草稿" },
  { value: "published", label: "已發布" },
  { value: "scheduled", label: "排程發布" },
  { value: "archived", label: "已下架" }
];

const emptyFaq = { question: "", answer: "" };

export function ArticleManager({
  initialArticles,
  categories
}: {
  initialArticles: Article[];
  categories: Category[];
}) {
  const articleCategories = categories.filter((category) => category.type === "article");
  const [items, setItems] = useState<ArticleForm[]>(initialArticles.map((article, index) => toForm(article, index)));
  const [selectedId, setSelectedId] = useState(initialArticles[0]?.id ?? "");
  const [draft, setDraft] = useState<ArticleForm>(() => toForm(initialArticles[0] ?? createEmptyArticle(articleCategories), 0));
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ContentStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const keyword = `${item.title} ${item.slug} ${item.excerpt} ${item.tags.join(" ")}`.toLowerCase();
      const queryMatch = !query.trim() || keyword.includes(query.trim().toLowerCase());
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      const categoryMatch = categoryFilter === "all" || item.category_id === categoryFilter;
      return queryMatch && statusMatch && categoryMatch;
    });
  }, [categoryFilter, items, query, statusFilter]);

  const stats = useMemo(
    () => [
      { label: "文章總數", value: items.length },
      { label: "已發布", value: items.filter((item) => item.status === "published").length },
      { label: "排程發布", value: items.filter((item) => item.status === "scheduled").length },
      { label: "總瀏覽量", value: items.reduce((sum, item) => sum + item.view_count, 0) }
    ],
    [items]
  );

  function selectArticle(article: ArticleForm) {
    setSelectedId(article.id);
    setDraft(copyArticle(article));
    setMode("edit");
    setNotice(null);
  }

  function createArticle() {
    const next = createEmptyArticle(articleCategories);
    setItems((current) => [next, ...current]);
    selectArticle(next);
    setNotice({ type: "success", text: "已建立新文章草稿。" });
  }

  function duplicateArticle() {
    const next: ArticleForm = {
      ...copyArticle(draft),
      id: crypto.randomUUID(),
      title: `${draft.title} 複本`,
      slug: uniqueSlug(`${draft.slug}-copy`, items),
      status: "draft",
      view_count: 0,
      published_at: new Date().toISOString()
    };
    setItems((current) => [next, ...current]);
    selectArticle(next);
    setNotice({ type: "success", text: "已複製為新草稿。" });
  }

  async function saveArticle(nextStatus?: ContentStatus) {
    const normalized = normalizeArticle({
      ...draft,
      status: nextStatus ?? draft.status,
      slug: draft.slug.trim() || slugify(draft.title),
      seo_title: draft.seo_title.trim() || draft.title,
      seo_description: draft.seo_description.trim() || draft.excerpt,
      og_image: draft.og_image.trim() || draft.cover_image
    });
    const siblings = items.filter((item) => item.id !== normalized.id);
    const articleForSave = { ...normalized, slug: uniqueSlug(normalized.slug, siblings) };
    const isExisting = items.some((item) => item.id === articleForSave.id);

    setIsSaving(true);
    setItems((current) =>
      current.some((item) => item.id === articleForSave.id)
        ? current.map((item) => (item.id === articleForSave.id ? articleForSave : item))
        : [articleForSave, ...current]
    );
    setDraft(articleForSave);
    setSelectedId(articleForSave.id);

    const response = await persistArticle(articleForSave, isExisting ? "PATCH" : "POST");
    setNotice(response);
    setIsSaving(false);
  }

  async function removeArticle(article: ArticleForm) {
    if (!window.confirm(`確定要刪除「${article.title}」？`)) return;

    const nextItems = items.filter((item) => item.id !== article.id);
    setItems(nextItems);
    setSelectedRows((current) => {
      const next = new Set(current);
      next.delete(article.id);
      return next;
    });
    selectArticle(nextItems[0] ?? createEmptyArticle(articleCategories));

    const response = await persistDelete(article.id);
    setNotice(response);
  }

  function update<K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function setTagText(value: string) {
    update("tags", parseList(value));
  }

  function addFaq() {
    update("schema_faq_json", [...draft.schema_faq_json, { ...emptyFaq }]);
  }

  function updateFaq(index: number, field: "question" | "answer", value: string) {
    update(
      "schema_faq_json",
      draft.schema_faq_json.map((faq, faqIndex) => (faqIndex === index ? { ...faq, [field]: value } : faq))
    );
  }

  function removeFaq(index: number) {
    update(
      "schema_faq_json",
      draft.schema_faq_json.filter((_, faqIndex) => faqIndex !== index)
    );
  }

  function insertMarkdown(snippet: string, selectOffset = 0) {
    const textarea = contentRef.current;
    if (!textarea) {
      update("content", `${draft.content}${snippet}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextContent = `${draft.content.slice(0, start)}${snippet}${draft.content.slice(end)}`;
    update("content", nextContent);
    window.setTimeout(() => {
      textarea.focus();
      const cursor = start + snippet.length - selectOffset;
      textarea.setSelectionRange(cursor, cursor);
    }, 0);
  }

  function wrapSelection(prefix: string, suffix = prefix, fallback = "文字") {
    const textarea = contentRef.current;
    if (!textarea) {
      insertMarkdown(`${prefix}${fallback}${suffix}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = draft.content.slice(start, end) || fallback;
    const replacement = `${prefix}${selected}${suffix}`;
    const nextContent = `${draft.content.slice(0, start)}${replacement}${draft.content.slice(end)}`;
    update("content", nextContent);
    window.setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  }

  function toggleRow(id: string) {
    setSelectedRows((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function runBulkStatus(status: ContentStatus) {
    if (!selectedRows.size) return;
    setItems((current) => current.map((item) => (selectedRows.has(item.id) ? { ...item, status } : item)));
    setNotice({ type: "success", text: "批次狀態已更新。" });
  }

  function runBulkDelete() {
    if (!selectedRows.size || !window.confirm("確定要批次刪除選取文章？")) return;
    setItems((current) => current.filter((item) => !selectedRows.has(item.id)));
    setSelectedRows(new Set());
    setNotice({ type: "success", text: "已批次刪除選取文章。" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="section-title">文章管理</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            管理 SEO 文章、分類、標籤、封面、內文、FAQ Schema、Article Schema、相關文章、Affiliate Links、文內廣告與發佈工作流。
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminStatsCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      {notice ? (
        <div
          className={cn(
            "rounded-lg border p-3 text-sm",
            notice.type === "success" && "border-primary/30 bg-primary/10 text-primary",
            notice.type === "warning" && "border-accent/50 bg-accent/15 text-accent-foreground",
            notice.type === "error" && "border-destructive/30 bg-destructive/10 text-destructive"
          )}
        >
          {notice.text}
        </div>
      ) : null}

      {selectedRows.size ? (
        <AdminBulkActions
          selectedCount={selectedRows.size}
          actions={[
            { id: "publish", label: "批次發布", kind: "set-status", value: "published" },
            { id: "archive", label: "批次下架", kind: "set-status", value: "archived" },
            { id: "delete", label: "批次刪除", kind: "delete" }
          ]}
          onAction={(action) => (action.kind === "delete" ? runBulkDelete() : runBulkStatus(action.value as ContentStatus))}
        />
      ) : null}

      <div className="flex flex-col gap-6">
        <Card className="order-2">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>文章清單</CardTitle>
              <Button onClick={createArticle}>
                <Plus className="h-4 w-4" />
                新增文章
              </Button>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 rounded-md border bg-background px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜尋標題、Slug、標籤"
                  className="border-0 px-0 focus-visible:ring-0"
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as "all" | ContentStatus)}
                  className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">全部狀態</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">全部分類</option>
                  {articleCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead>文章</TableHead>
                  <TableHead>狀態</TableHead>
                    <TableHead className="w-24 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((article) => (
                  <TableRow key={article.id} className={article.id === selectedId ? "bg-secondary/70" : undefined}>
                    <TableCell>
                      <input type="checkbox" checked={selectedRows.has(article.id)} onChange={() => toggleRow(article.id)} aria-label={`選取 ${article.title}`} />
                    </TableCell>
                    <TableCell className="min-w-0">
                      <button className="block w-full text-left" onClick={() => selectArticle(article)}>
                        <span className="line-clamp-1 font-medium">{article.title}</span>
                        <span className="mt-1 block truncate text-xs text-muted-foreground">/{article.slug}</span>
                      </button>
                    </TableCell>
                    <TableCell>
                      <AdminStatusBadge value={article.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <ButtonLink href={`/admin/articles/${article.id}/edit`} size="icon" variant="outline">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">編輯文章</span>
                        </ButtonLink>
                        <Button size="icon" variant="destructive" onClick={() => removeArticle(article)} aria-label="刪除文章">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="order-1">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>文章編輯器</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">目前編輯：{draft.title || "未命名文章"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant={mode === "edit" ? "default" : "outline"} onClick={() => setMode("edit")}>
                  <Pencil className="h-4 w-4" />
                  編輯
                </Button>
                <Button variant={mode === "preview" ? "default" : "outline"} onClick={() => setMode("preview")}>
                  <Eye className="h-4 w-4" />
                  預覽
                </Button>
                <Button variant="outline" onClick={duplicateArticle}>
                  <Copy className="h-4 w-4" />
                  複製
                </Button>
                <Button variant="secondary" onClick={() => saveArticle("draft")} disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  存草稿
                </Button>
                <Button variant="accent" onClick={() => saveArticle("scheduled")} disabled={isSaving}>
                  <CalendarClock className="h-4 w-4" />
                  排程
                </Button>
                <Button onClick={() => saveArticle("published")} disabled={isSaving}>
                  <Sparkles className="h-4 w-4" />
                  發布
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {mode === "edit" ? (
              <ArticleEditForm
                draft={draft}
                categories={articleCategories}
                contentRef={contentRef}
                update={update}
                setTagText={setTagText}
                insertMarkdown={insertMarkdown}
                wrapSelection={wrapSelection}
                addFaq={addFaq}
                updateFaq={updateFaq}
                removeFaq={removeFaq}
              />
            ) : (
              <ArticlePreview draft={draft} categories={articleCategories} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ArticleEditForm({
  draft,
  categories,
  contentRef,
  update,
  setTagText,
  insertMarkdown,
  wrapSelection,
  addFaq,
  updateFaq,
  removeFaq
}: {
  draft: ArticleForm;
  categories: Category[];
  contentRef: RefObject<HTMLTextAreaElement | null>;
  update: <K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) => void;
  setTagText: (value: string) => void;
  insertMarkdown: (snippet: string, selectOffset?: number) => void;
  wrapSelection: (prefix: string, suffix?: string, fallback?: string) => void;
  addFaq: () => void;
  updateFaq: (index: number, field: "question" | "answer", value: string) => void;
  removeFaq: (index: number) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-2">
        <Field label="文章標題">
          <Input value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder="上海自由行完整攻略" />
        </Field>
        <Field label="Slug">
          <Input value={draft.slug} onChange={(event) => update("slug", event.target.value)} placeholder="shanghai-guide" />
        </Field>
        <Field label="分類">
          <select
            value={draft.category_id}
            onChange={(event) => update("category_id", event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="狀態">
          <select
            value={draft.status}
            onChange={(event) => update("status", event.target.value as ContentStatus)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="發布 / 排程時間">
          <Input
            type="datetime-local"
            value={toDatetimeLocal(draft.published_at)}
            onChange={(event) => update("published_at", fromDatetimeLocal(event.target.value))}
          />
        </Field>
        <Field label="熱門排序">
          <Input type="number" value={draft.sort_order} onChange={(event) => update("sort_order", Number(event.target.value))} />
        </Field>
        <Field label="標籤">
          <div className="flex items-center gap-2 rounded-md border bg-background px-3">
            <Tags className="h-4 w-4 text-muted-foreground" />
            <Input
              value={draft.tags.join(", ")}
              onChange={(event) => setTagText(event.target.value)}
              placeholder="自由行, 迪士尼, 住宿"
              className="border-0 px-0 focus-visible:ring-0"
            />
          </div>
        </Field>
        <Field label="封面圖片 URL">
          <Input value={draft.cover_image} onChange={(event) => update("cover_image", event.target.value)} />
        </Field>
      </section>

      <Field label="文章摘要">
        <Textarea value={draft.excerpt} onChange={(event) => update("excerpt", event.target.value)} className="min-h-24" />
      </Field>

      <AdminImageUploader title="封面 / 內文圖片" description="正式版可串 Supabase Storage，這裡先保留上傳與壓縮入口。" />

      <Separator />

      <section className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-medium">文章內文編輯器</p>
            <p className="text-sm text-muted-foreground">Markdown 快捷工具、圖片、連結、引用與 AdSense 插入標記。</p>
          </div>
          <div className="text-sm text-muted-foreground">{draft.content.length.toLocaleString("zh-TW")} 字元</div>
        </div>
        <div className="flex flex-wrap gap-2 rounded-lg border bg-secondary/30 p-2">
          <ToolbarButton label="H2" icon={<Heading2 className="h-4 w-4" />} onClick={() => insertMarkdown("\n## 小標題\n", 1)} />
          <ToolbarButton label="粗體" icon={<Bold className="h-4 w-4" />} onClick={() => wrapSelection("**", "**", "重點文字")} />
          <ToolbarButton label="斜體" icon={<Italic className="h-4 w-4" />} onClick={() => wrapSelection("*", "*", "補充文字")} />
          <ToolbarButton label="引用" icon={<Quote className="h-4 w-4" />} onClick={() => insertMarkdown("\n> 旅遊提醒\n", 1)} />
          <ToolbarButton label="清單" icon={<List className="h-4 w-4" />} onClick={() => insertMarkdown("\n- 重點一\n- 重點二\n", 1)} />
          <ToolbarButton label="連結" icon={<Link2 className="h-4 w-4" />} onClick={() => insertMarkdown("[連結文字](https://example.com)", 1)} />
          <ToolbarButton label="圖片" icon={<ImageIcon className="h-4 w-4" />} onClick={() => insertMarkdown("\n![圖片 alt](https://example.com/image.jpg)\n", 1)} />
          <ToolbarButton label="廣告位" icon={<Megaphone className="h-4 w-4" />} onClick={() => insertMarkdown("\n[adsense:article_middle_300x250]\n", 1)} />
        </div>
        <Textarea
          ref={contentRef}
          value={draft.content}
          onChange={(event) => update("content", event.target.value)}
          className="min-h-[360px] font-mono text-sm leading-6"
          placeholder="輸入文章內容..."
        />
      </section>

      <Separator />

      <section className="grid gap-4 lg:grid-cols-2">
        <Field label={`SEO Title (${draft.seo_title.length}/60)`}>
          <Input value={draft.seo_title} onChange={(event) => update("seo_title", event.target.value)} />
        </Field>
        <Field label="OG Image">
          <Input value={draft.og_image} onChange={(event) => update("og_image", event.target.value)} />
        </Field>
        <Field label={`SEO Description (${draft.seo_description.length}/160)`}>
          <Textarea value={draft.seo_description} onChange={(event) => update("seo_description", event.target.value)} className="min-h-24" />
        </Field>
        <Field label="Article Schema">
          <Textarea
            readOnly
            value={JSON.stringify({ "@type": "Article", headline: draft.title, datePublished: draft.published_at }, null, 2)}
            className="min-h-24 font-mono text-xs"
          />
        </Field>
      </section>

      <Separator />

      <section className="grid gap-4 lg:grid-cols-2">
        <Field label="相關文章 Slug">
          <Textarea
            value={draft.related_articles.join(", ")}
            onChange={(event) => update("related_articles", parseList(event.target.value))}
            className="min-h-20"
            placeholder="the-bund-night-view-guide, shanghai-best-hotel-districts"
          />
        </Field>
        <Field label="綁定 Affiliate Links">
          <Textarea
            value={draft.affiliate_link_ids.join(", ")}
            onChange={(event) => update("affiliate_link_ids", parseList(event.target.value))}
            className="min-h-20"
            placeholder={affiliateLinks.map((link) => link.title).join(", ")}
          />
        </Field>
        <Field label="文章內自動插入廣告位">
          <select
            value={draft.ad_strategy}
            onChange={(event) => update("ad_strategy", event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="auto">自動插入文首 / 文中 / 文末</option>
            {adPlacements.map((placement) => (
              <option key={placement.placement} value={placement.placement}>
                {placement.placement}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium">FAQ Schema</p>
            <p className="text-sm text-muted-foreground">會同步作為文章頁 FAQ JSON-LD 的來源。</p>
          </div>
          <Button variant="outline" onClick={addFaq}>
            <Plus className="h-4 w-4" />
            新增 FAQ
          </Button>
        </div>
        <div className="space-y-3">
          {draft.schema_faq_json.map((faq, index) => (
            <div key={`${faq.question}-${index}`} className="grid gap-3 rounded-lg border bg-secondary/20 p-3 lg:grid-cols-[1fr_1fr_auto]">
              <Input value={faq.question} onChange={(event) => updateFaq(index, "question", event.target.value)} placeholder="問題" />
              <Input value={faq.answer} onChange={(event) => updateFaq(index, "answer", event.target.value)} placeholder="答案" />
              <Button variant="destructive" size="icon" onClick={() => removeFaq(index)} aria-label="刪除 FAQ">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArticlePreview({ draft, categories }: { draft: ArticleForm; categories: Category[] }) {
  const category = categories.find((item) => item.id === draft.category_id);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border bg-card">
        {draft.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={draft.cover_image} alt={draft.title} className="h-72 w-full object-cover" />
        ) : null}
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {category ? <Badge variant="secondary">{category.name}</Badge> : null}
            <AdminStatusBadge value={draft.status} />
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              {new Date(draft.published_at).toLocaleDateString("zh-TW")}
            </span>
          </div>
          <h2 className="text-3xl font-bold leading-tight">{draft.title}</h2>
          <p className="text-muted-foreground">{draft.excerpt}</p>
        </div>
      </div>

      <div className="prose max-w-none rounded-lg border bg-card p-6">{renderPreview(draft.content)}</div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {draft.affiliate_link_ids.length ? draft.affiliate_link_ids.map((item) => <p key={item}>{item}</p>) : <p>尚未綁定</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>FAQ 預覽</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {draft.schema_faq_json.map((faq, index) => (
              <div key={`${faq.question}-${index}`} className="rounded-md border p-3">
                <p className="font-medium">{faq.question || "未填問題"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{faq.answer || "未填答案"}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ToolbarButton({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} title={label} aria-label={label}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

function renderPreview(content: string) {
  return content.split("\n").map((line, index) => {
    if (!line.trim()) return <div key={index} className="h-3" />;
    if (line.startsWith("## ")) return <h2 key={index}>{line.replace(/^## /, "")}</h2>;
    if (line.startsWith("> ")) {
      return (
        <blockquote key={index} className="border-l-4 border-primary/40 pl-4 text-muted-foreground">
          {line.replace(/^> /, "")}
        </blockquote>
      );
    }
    if (line.startsWith("- ")) return <p key={index} className="pl-4">• {line.replace(/^- /, "")}</p>;
    if (line.startsWith("[adsense:")) {
      return (
        <div key={index} className="my-4 rounded-lg border border-dashed bg-secondary/60 p-4 text-sm text-muted-foreground">
          {line}
        </div>
      );
    }
    return <p key={index}>{line}</p>;
  });
}

function toForm(article: Article, index: number): ArticleForm {
  return {
    ...article,
    schema_faq_json: article.schema_faq_json?.length ? article.schema_faq_json : [{ ...emptyFaq }],
    related_articles: [],
    affiliate_link_ids: affiliateLinks.slice(0, index % 2 === 0 ? 1 : 2).map((link) => link.title),
    ad_strategy: "auto",
    sort_order: index + 1
  };
}

function createEmptyArticle(categories: Category[]): ArticleForm {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "未命名上海攻略",
    slug: `shanghai-guide-${Date.now()}`,
    excerpt: "",
    content: "## 行程重點\n\n請輸入文章內容。\n\n[adsense:article_middle_300x250]\n\n## 交通與預算\n",
    cover_image: "",
    category_id: categories[0]?.id ?? "",
    tags: [],
    author_id: "",
    status: "draft",
    published_at: now,
    seo_title: "",
    seo_description: "",
    og_image: "",
    schema_faq_json: [{ ...emptyFaq }],
    view_count: 0,
    related_articles: [],
    affiliate_link_ids: [],
    ad_strategy: "auto",
    sort_order: 1
  };
}

function copyArticle(article: ArticleForm): ArticleForm {
  return {
    ...article,
    tags: [...article.tags],
    related_articles: [...article.related_articles],
    affiliate_link_ids: [...article.affiliate_link_ids],
    schema_faq_json: article.schema_faq_json.map((faq) => ({ ...faq }))
  };
}

function normalizeArticle(article: ArticleForm): ArticleForm {
  return {
    ...article,
    title: article.title.trim() || "未命名上海攻略",
    slug: article.slug.trim(),
    excerpt: article.excerpt.trim(),
    cover_image: article.cover_image.trim(),
    og_image: article.og_image.trim(),
    tags: article.tags.map((tag) => tag.trim()).filter(Boolean),
    related_articles: article.related_articles.map((item) => item.trim()).filter(Boolean),
    affiliate_link_ids: article.affiliate_link_ids.map((item) => item.trim()).filter(Boolean),
    schema_faq_json: article.schema_faq_json
      .map((faq) => ({ question: faq.question.trim(), answer: faq.answer.trim() }))
      .filter((faq) => faq.question || faq.answer)
  };
}

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `article-${Date.now()}`;
}

function uniqueSlug(slug: string, articles: ArticleForm[]) {
  const base = slug || `article-${Date.now()}`;
  let candidate = base;
  let index = 2;
  while (articles.some((article) => article.slug === candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  return candidate;
}

function toDatetimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  if (!value) return new Date().toISOString();
  return new Date(value).toISOString();
}

function toDatabaseValues(article: ArticleForm) {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    cover_image: article.cover_image || null,
    category_id: article.category_id || null,
    tags: article.tags,
    status: article.status,
    published_at: article.status === "published" || article.status === "scheduled" ? article.published_at : null,
    seo_title: article.seo_title || null,
    seo_description: article.seo_description || null,
    og_image: article.og_image || article.cover_image || null,
    schema_faq_json: article.schema_faq_json,
    view_count: article.view_count
  };
}

async function persistArticle(article: ArticleForm, method: "POST" | "PATCH"): Promise<Notice> {
  const response = await fetch("/api/admin/articles", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: article.id,
      values: toDatabaseValues(article)
    })
  }).catch(() => null);

  if (!response) {
    return { type: "warning", text: "已在畫面儲存；目前沒有連到 Supabase API。" };
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    return { type: "warning", text: `已在畫面儲存；Supabase 同步未完成${payload?.error ? `：${payload.error}` : ""}` };
  }

  return { type: "success", text: "文章已儲存到 Supabase。" };
}

async function persistDelete(id: string): Promise<Notice> {
  const response = await fetch("/api/admin/articles", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  }).catch(() => null);

  if (!response) {
    return { type: "warning", text: "已在畫面刪除；目前沒有連到 Supabase API。" };
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    return { type: "warning", text: `已在畫面刪除；Supabase 同步未完成${payload?.error ? `：${payload.error}` : ""}` };
  }

  return { type: "success", text: "文章已從 Supabase 刪除。" };
}
