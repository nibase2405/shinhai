"use client";

import { useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import {
  ArrowLeft,
  Bold,
  CalendarClock,
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
  Sparkles,
  Tags,
  Trash2
} from "lucide-react";
import { AdminImageUploader } from "@/components/admin/admin-image-uploader";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { adPlacements, affiliateLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Article, Category, ContentStatus } from "@/types/content";

type ArticleForm = Article & {
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

export function AdminArticleEditor({
  article,
  categories,
  backHref = "/admin/articles"
}: {
  article: Article;
  categories: Category[];
  backHref?: string;
}) {
  const articleCategories = categories.filter((category) => category.type === "article");
  const [draft, setDraft] = useState<ArticleForm>(() => toForm(article));
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

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
    update("content", `${draft.content.slice(0, start)}${replacement}${draft.content.slice(end)}`);
    window.setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
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

    setDraft(normalized);
    setIsSaving(true);
    const response = await persistArticle(normalized);
    setNotice(response);
    setIsSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <ButtonLink href={backHref} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
            回到文章清單
          </ButtonLink>
          <h1 className="section-title mt-4">文章編輯器</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            編輯文章內容、SEO、FAQ Schema、關聯文章、廣告插入策略與 Affiliate Links。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <CardTitle className="truncate">{draft.title || "未命名文章"}</CardTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <AdminStatusBadge value={draft.status} />
                <span className="text-sm text-muted-foreground">/{draft.slug}</span>
              </div>
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
              <Button onClick={() => saveArticle()} disabled={isSaving}>
                <Save className="h-4 w-4" />
                {isSaving ? "儲存中" : "儲存變更"}
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
              placeholder="自由行, 迪士尼, 外灘"
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

      <AdminImageUploader title="封面 / 文章圖片" description="先保留上傳入口，之後可接 Supabase Storage 與媒體庫。" />

      <Separator />

      <section className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-medium">文章內文編輯器</p>
            <p className="text-sm text-muted-foreground">支援 Markdown、標題、粗斜體、連結、圖片與 AdSense 插入標記。</p>
          </div>
          <div className="text-sm text-muted-foreground">{draft.content.length.toLocaleString("zh-TW")} 字元</div>
        </div>
        <div className="flex flex-wrap gap-2 rounded-lg border bg-secondary/30 p-2">
          <ToolbarButton label="H2" icon={<Heading2 className="h-4 w-4" />} onClick={() => insertMarkdown("\n## 小標題\n", 1)} />
          <ToolbarButton label="粗體" icon={<Bold className="h-4 w-4" />} onClick={() => wrapSelection("**", "**", "重點文字")} />
          <ToolbarButton label="斜體" icon={<Italic className="h-4 w-4" />} onClick={() => wrapSelection("*", "*", "補充文字")} />
          <ToolbarButton label="引用" icon={<Quote className="h-4 w-4" />} onClick={() => insertMarkdown("\n> 旅行提醒\n", 1)} />
          <ToolbarButton label="清單" icon={<List className="h-4 w-4" />} onClick={() => insertMarkdown("\n- 第一點\n- 第二點\n", 1)} />
          <ToolbarButton label="連結" icon={<Link2 className="h-4 w-4" />} onClick={() => insertMarkdown("[連結文字](https://example.com)", 1)} />
          <ToolbarButton label="圖片" icon={<ImageIcon className="h-4 w-4" />} onClick={() => insertMarkdown("\n![圖片 alt](https://example.com/image.jpg)\n", 1)} />
          <ToolbarButton label="廣告位" icon={<Megaphone className="h-4 w-4" />} onClick={() => insertMarkdown("\n[adsense:article_middle_300x250]\n", 1)} />
        </div>
        <Textarea
          ref={contentRef}
          value={draft.content}
          onChange={(event) => update("content", event.target.value)}
          className="min-h-[420px] font-mono text-sm leading-6"
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
        <Field label="Article Schema 預覽">
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
        <Field label="文章廣告插入策略">
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
            <p className="text-sm text-muted-foreground">會儲存為文章 FAQ JSON-LD 資料。</p>
          </div>
          <Button variant="outline" onClick={addFaq}>
            <Plus className="h-4 w-4" />
            新增 FAQ
          </Button>
        </div>
        <div className="space-y-3">
          {draft.schema_faq_json.map((faq, index) => (
            <div key={`faq-editor-${index}`} className="grid gap-3 rounded-lg border bg-secondary/20 p-3 lg:grid-cols-[1fr_1fr_auto]">
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
            {draft.affiliate_link_ids.length ? draft.affiliate_link_ids.map((item) => <p key={item}>{item}</p>) : <p>尚未綁定連結</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>FAQ 預覽</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {draft.schema_faq_json.map((faq, index) => (
              <div key={`faq-preview-${index}`} className="rounded-md border p-3">
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
    if (line.startsWith("- ")) return <p key={index} className="pl-4">- {line.replace(/^- /, "")}</p>;
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

function toForm(article: Article): ArticleForm {
  return {
    ...article,
    schema_faq_json: article.schema_faq_json?.length ? article.schema_faq_json : [{ ...emptyFaq }],
    related_articles: [],
    affiliate_link_ids: affiliateLinks.slice(0, 2).map((link) => link.title),
    ad_strategy: "auto",
    sort_order: 1
  };
}

function normalizeArticle(article: ArticleForm): ArticleForm {
  return {
    ...article,
    title: article.title.trim() || "未命名文章",
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

async function persistArticle(article: ArticleForm): Promise<Notice> {
  const response = await fetch("/api/admin/articles", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: article.id,
      values: toDatabaseValues(article)
    })
  }).catch(() => null);

  if (!response) {
    return { type: "warning", text: "已更新畫面資料，但目前無法連線到 Supabase API。" };
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    return { type: "warning", text: `儲存未完成${payload?.error ? `：${payload.error}` : "。"}` };
  }

  return { type: "success", text: "文章已儲存。" };
}
