"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, Clipboard, ExternalLink, Loader2, PlaneTakeoff, Save, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TravelpayoutsCreateLinkInput, TravelpayoutsLinkType, TravelpayoutsRelatedType } from "@/lib/travelpayouts";

type TravelpayoutsManagerProps = {
  defaultMarker: string;
  defaultTrs: string;
  hasServerToken: boolean;
};

type TravelpayoutsResult = {
  code?: string;
  status?: number;
  message?: string;
  error?: string;
  partnerUrl?: string;
  link?: {
    url?: string;
    code?: string;
    partner_url?: string;
    message?: string;
  };
  saved?: {
    previewOnly?: boolean;
    values?: Record<string, unknown>;
    data?: { id?: string };
  } | null;
  travelpayouts?: unknown;
  requestPreview?: unknown;
};

const linkTypes: Array<{ value: TravelpayoutsLinkType; label: string }> = [
  { value: "hotel", label: "hotel / 住宿" },
  { value: "ticket", label: "ticket / 票券" },
  { value: "tour", label: "tour / 行程" },
  { value: "transport", label: "transport / 交通" },
  { value: "food", label: "food / 美食" }
];

const relatedTypes: Array<{ value: TravelpayoutsRelatedType; label: string }> = [
  { value: "", label: "不綁定" },
  { value: "article", label: "文章" },
  { value: "attraction", label: "景點" },
  { value: "restaurant", label: "美食" },
  { value: "hotel", label: "住宿" }
];

export function TravelpayoutsManager({ defaultMarker, defaultTrs, hasServerToken }: TravelpayoutsManagerProps) {
  const [title, setTitle] = useState("Travelpayouts 上海飯店比價");
  const [brandUrl, setBrandUrl] = useState("https://www.booking.com/searchresults.html?ss=Shanghai");
  const [type, setType] = useState<TravelpayoutsLinkType>("hotel");
  const [relatedType, setRelatedType] = useState<TravelpayoutsRelatedType>("article");
  const [relatedId, setRelatedId] = useState("30000000-0000-4000-8000-000000000003");
  const [commissionNote, setCommissionNote] = useState("Travelpayouts 上海旅遊分潤連結");
  const [trs, setTrs] = useState(defaultTrs);
  const [marker, setMarker] = useState(defaultMarker);
  const [subId, setSubId] = useState("admin-shanghai");
  const [apiToken, setApiToken] = useState("");
  const [shorten, setShorten] = useState(true);
  const [result, setResult] = useState<TravelpayoutsResult | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loadingMode, setLoadingMode] = useState<"generate" | "save" | null>(null);

  const partnerUrl = result?.partnerUrl || result?.link?.partner_url || "";
  const savedId = result?.saved?.data?.id;
  const previewJson = result ? JSON.stringify(result, null, 2) : "";
  const envReady = Boolean(hasServerToken && defaultMarker && defaultTrs);

  async function submit(saveToAffiliateLinks: boolean) {
    setLoadingMode(saveToAffiliateLinks ? "save" : "generate");
    setError("");
    setNotice("");
    setResult(null);

    const payload: TravelpayoutsCreateLinkInput = {
      title,
      brandUrl,
      type,
      relatedType,
      relatedId,
      commissionNote,
      trs,
      marker,
      subId,
      shorten,
      apiToken,
      saveToAffiliateLinks
    };

    try {
      const response = await fetch("/api/admin/travelpayouts-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as TravelpayoutsResult;

      if (!response.ok) {
        throw new Error(data.error || "Travelpayouts 連結生成失敗。");
      }

      setResult(data);

      if (data.code === "not_configured") {
        setNotice("已產生 request preview；請補齊 API token、marker 與 TRS 後再送出。");
      } else if (data.saved?.previewOnly) {
        setNotice("已生成 partner link；目前未連接 Supabase admin，因此只顯示可寫入資料。");
      } else if (data.saved?.data) {
        setNotice("已生成 partner link 並寫入 Affiliate Links。");
      } else {
        setNotice("已生成 Travelpayouts partner link。");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Travelpayouts 連結生成失敗。");
    } finally {
      setLoadingMode(null);
    }
  }

  async function copyPartnerUrl() {
    if (!partnerUrl) return;
    await navigator.clipboard.writeText(partnerUrl);
    setNotice("Partner URL 已複製。");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="section-title">Travelpayouts 串接</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            將旅遊品牌原始連結轉換成 Travelpayouts partner link，並可直接寫入 Affiliate Links 供前台按鈕與點擊追蹤使用。
          </p>
        </div>
        <Badge variant={envReady ? "default" : "outline"} className="w-fit">
          {envReady ? "環境變數已設定" : "可用表單暫時輸入 token"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard title="API endpoint" value="/links/v1/create" helper="server-side 呼叫，不在前端暴露 token" />
        <InfoCard title="單次限制" value="最多 10 links" helper="此介面先採單筆生成，避免誤送大量請求" />
        <InfoCard title="追蹤" value="sub_id" helper="可在 Travelpayouts 後台依 sub_id 看成效" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlaneTakeoff className="h-5 w-5 text-primary" />
              Partner Link 生成
            </CardTitle>
            <CardDescription>請使用完整品牌 URL，不要貼短網址。TRS 是已加入品牌 program 的 project ID。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="連結名稱">
              <Input value={title} onChange={(event) => setTitle(event.target.value)} />
            </Field>

            <Field label="原始品牌 URL">
              <Input value={brandUrl} onChange={(event) => setBrandUrl(event.target.value)} placeholder="https://www.booking.com/..." />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="類型">
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value as TravelpayoutsLinkType)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {linkTypes.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Sub ID">
                <Input value={subId} onChange={(event) => setSubId(event.target.value)} placeholder="article-shanghai-hotel" />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="綁定內容類型">
                <select
                  value={relatedType}
                  onChange={(event) => setRelatedType(event.target.value as TravelpayoutsRelatedType)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {relatedTypes.map((option) => (
                    <option key={option.value || "none"} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="綁定內容 ID">
                <Input value={relatedId} onChange={(event) => setRelatedId(event.target.value)} disabled={!relatedType} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="TRS / Project ID">
                <Input value={trs} onChange={(event) => setTrs(event.target.value)} placeholder="197987" />
              </Field>

              <Field label="Marker / Partner ID">
                <Input value={marker} onChange={(event) => setMarker(event.target.value)} placeholder="339296" />
              </Field>
            </div>

            <Field label="API Token">
              <Input
                value={apiToken}
                onChange={(event) => setApiToken(event.target.value)}
                type="password"
                placeholder={hasServerToken ? "已使用 TRAVELPAYOUTS_API_TOKEN，可留空" : "可暫時貼上 token；建議改放環境變數"}
              />
            </Field>

            <Field label="佣金備註">
              <Textarea value={commissionNote} onChange={(event) => setCommissionNote(event.target.value)} />
            </Field>

            <label className="flex items-center gap-3 rounded-md border bg-background p-3 text-sm">
              <input type="checkbox" checked={shorten} onChange={(event) => setShorten(event.target.checked)} />
              <span>
                產生短連結
                <span className="block text-xs text-muted-foreground">Travelpayouts API 的 shorten 參數。</span>
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => submit(false)} disabled={loadingMode !== null}>
                {loadingMode === "generate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                生成連結
              </Button>
              <Button variant="accent" onClick={() => submit(true)} disabled={loadingMode !== null}>
                {loadingMode === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                生成並寫入 Affiliate Links
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>生成結果</CardTitle>
            <CardDescription>成功後可複製 partner URL，或回 Affiliate Links 管理排序、綁定與啟用狀態。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {partnerUrl ? (
              <div className="space-y-3 rounded-lg border bg-secondary/40 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  Partner URL
                </div>
                <p className="break-all font-mono text-xs text-muted-foreground">{partnerUrl}</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={copyPartnerUrl}>
                    <Clipboard className="h-4 w-4" />
                    複製
                  </Button>
                  <ButtonLink href={partnerUrl} variant="outline" size="sm">
                    開啟
                    <ExternalLink className="h-4 w-4" />
                  </ButtonLink>
                  {savedId ? (
                    <ButtonLink href="/admin/affiliate-links" variant="secondary" size="sm">
                      前往 Affiliate Links
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-secondary/30 p-6 text-sm text-muted-foreground">
                尚未生成連結。若尚未設定 token，送出後會先顯示 request preview。
              </div>
            )}

            {notice ? <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{notice}</p> : null}
            {error ? <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}

            <Textarea value={previewJson} readOnly className="min-h-[420px] font-mono text-xs" placeholder="Travelpayouts API response preview" />
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

function InfoCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
