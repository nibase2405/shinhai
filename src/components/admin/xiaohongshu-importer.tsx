"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Clipboard, FilePlus2, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { XiaohongshuDraft, XiaohongshuMetadata, XiaohongshuTargetType } from "@/lib/admin/xiaohongshu-import";

type ImportResponse = {
  metadata?: XiaohongshuMetadata;
  draft?: XiaohongshuDraft;
  error?: string;
};

type CreateResponse = {
  data?: { id?: string };
  error?: string;
};

const targetOptions: Array<{ value: XiaohongshuTargetType; label: string; helper: string }> = [
  { value: "article", label: "攻略文章", helper: "建立到 articles 草稿" },
  { value: "attraction", label: "景點", helper: "建立到 attractions 草稿" },
  { value: "restaurant", label: "美食", helper: "建立到 restaurants 草稿" },
  { value: "hotel", label: "住宿", helper: "建立到 hotels 草稿" }
];

const statusLabels: Record<XiaohongshuMetadata["fetchStatus"], string> = {
  ok: "公開 metadata 已抓取",
  failed: "公開頁抓取失敗",
  not_requested: "未提供連結"
};

export function XiaohongshuImporter() {
  const [url, setUrl] = useState("");
  const [targetType, setTargetType] = useState<XiaohongshuTargetType>("article");
  const [titleHint, setTitleHint] = useState("");
  const [district, setDistrict] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [metadata, setMetadata] = useState<XiaohongshuMetadata | null>(null);
  const [draft, setDraft] = useState<XiaohongshuDraft | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [createdPath, setCreatedPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const draftJson = draft ? JSON.stringify(draft.values, null, 2) : "";

  async function generateDraft() {
    setLoading(true);
    setError("");
    setNotice("");
    setCreatedPath("");

    try {
      const response = await fetch("/api/admin/xiaohongshu-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, targetType, pastedText, titleHint, district })
      });
      const payload = (await response.json()) as ImportResponse;

      if (!response.ok || !payload.draft) {
        throw new Error(payload.error || "小紅書內容解析失敗。");
      }

      setMetadata(payload.metadata ?? null);
      setDraft(payload.draft);
      setNotice("已生成草稿，請確認欄位後再建立。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "小紅書內容解析失敗。");
    } finally {
      setLoading(false);
    }
  }

  async function createDraft() {
    if (!draft) return;

    setCreating(true);
    setError("");
    setNotice("");
    setCreatedPath("");

    try {
      const response = await fetch(`/api/admin/${draft.resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: draft.values })
      });
      const payload = (await response.json()) as CreateResponse;

      if (!response.ok) {
        throw new Error(payload.error || "草稿建立失敗。");
      }

      const id = payload.data?.id;
      setCreatedPath(id ? `/admin/${draft.resource}/${id}/edit` : "");
      setNotice(id ? "草稿已建立，可以進入編輯器補齊內容。" : "草稿已建立。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "草稿建立失敗。");
    } finally {
      setCreating(false);
    }
  }

  async function copyDraftJson() {
    if (!draftJson) return;

    try {
      await navigator.clipboard.writeText(draftJson);
      setNotice("草稿 JSON 已複製。");
    } catch {
      setError("瀏覽器不允許複製，請直接選取右側 JSON。");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="section-title">小紅書匯入</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            貼上小紅書連結與筆記文字，先生成可改寫的營運草稿，再建立為攻略文章、景點、美食或住宿資料。
          </p>
        </div>
        <Badge variant="outline" className="w-fit">內容營運工具</Badge>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              來源與生成設定
            </CardTitle>
            <CardDescription>
              系統會嘗試抓取公開 OG metadata；完整內容請貼到筆記文字中，方便後續在編輯器重寫。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="小紅書連結">
              <Input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://www.xiaohongshu.com/explore/..."
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="建立類型">
                <select
                  value={targetType}
                  onChange={(event) => setTargetType(event.target.value as XiaohongshuTargetType)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {targetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {targetOptions.find((option) => option.value === targetType)?.helper}
                </p>
              </Field>

              <Field label="地區">
                <Input value={district} onChange={(event) => setDistrict(event.target.value)} placeholder="例：黃浦區、浦東新區" />
              </Field>
            </div>

            <Field label="標題提示">
              <Input value={titleHint} onChange={(event) => setTitleHint(event.target.value)} placeholder="例：上海外灘夜景攻略" />
            </Field>

            <Field label="貼上筆記文字">
              <Textarea
                value={pastedText}
                onChange={(event) => setPastedText(event.target.value)}
                className="min-h-[220px]"
                placeholder="貼上小紅書筆記文字、重點、標籤或營運備註。請改寫後再發布。"
              />
            </Field>

            <div className="rounded-lg border bg-secondary/40 p-4 text-sm text-muted-foreground">
              這個工具不繞過小紅書登入、權限或反爬限制。若公開頁無法抓取，仍可透過貼上的文字建立內部改寫草稿。
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={generateDraft} disabled={loading || (!url.trim() && !pastedText.trim() && !titleHint.trim())}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                解析並生成草稿
              </Button>
              <Button variant="outline" onClick={copyDraftJson} disabled={!draft}>
                <Clipboard className="h-4 w-4" />
                複製草稿 JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>草稿預覽</CardTitle>
            <CardDescription>確認欄位後建立草稿，接著到對應編輯器補齊圖片、座標、SEO 與 affiliate 設定。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {metadata ? (
              <div className="flex flex-wrap gap-2">
                <Badge variant={metadata.fetchStatus === "ok" ? "default" : "outline"}>{statusLabels[metadata.fetchStatus]}</Badge>
                {metadata.fetchMessage ? <Badge variant="secondary">{metadata.fetchMessage}</Badge> : null}
              </div>
            ) : null}

            {draft ? (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <PreviewItem label="標題" value={draft.title} />
                  <PreviewItem label="Slug" value={draft.slug} />
                  <PreviewItem label="資料表" value={draft.resource} />
                  <PreviewItem label="標籤" value={draft.tags.length ? draft.tags.join("、") : "待補"} />
                </div>

                <div className="rounded-lg border bg-background p-4">
                  <p className="text-sm font-medium">摘要</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{draft.summary}</p>
                </div>

                <Textarea value={draftJson} readOnly className="min-h-[320px] font-mono text-xs" aria-label="草稿 JSON 預覽" />

                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={createDraft} disabled={creating}>
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus2 className="h-4 w-4" />}
                    建立草稿
                  </Button>
                  {createdPath ? (
                    <ButtonLink href={createdPath} variant="outline">
                      進入編輯器
                      <ArrowRight className="h-4 w-4" />
                    </ButtonLink>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed bg-secondary/30 p-8 text-center">
                <div>
                  <p className="font-medium">尚未生成草稿</p>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    請先在左側貼上連結或筆記文字，選擇建立類型後生成草稿。
                  </p>
                </div>
              </div>
            )}

            {notice ? <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{notice}</p> : null}
            {error ? <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}
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

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-medium" title={value}>{value}</p>
    </div>
  );
}
