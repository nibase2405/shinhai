"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LockKeyhole, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND_NAME } from "@/lib/brand";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminAuthStatus = {
  configured: boolean;
  authenticated: boolean;
  isAdmin: boolean;
  role: string | null;
  status?: string | null;
};

export function AdminLoginForm({
  reason,
  redirectTo = "/admin/dashboard"
}: {
  reason?: string;
  redirectTo?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(reasonMessage(reason));
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("尚未設定 Supabase 環境變數，無法登入後台。請先設定 Supabase URL 與 Anon Key。");
      setLoading(false);
      return;
    }

    const result = await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setMessage(result.error.message);
      setLoading(false);
      return;
    }

    const statusResponse = await fetch("/api/admin/auth-status", { cache: "no-store" });
    const status = (await statusResponse.json()) as AdminAuthStatus;

    if (!status.isAdmin) {
      await supabase.auth.signOut();
      setMessage("此帳號不是啟用中的 admin 管理員，無法登入後台。");
      setLoading(false);
      return;
    }

    window.location.href = redirectTo;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <Image src="/logo.svg" alt={`${BRAND_NAME} logo`} width={56} height={56} priority className="rounded-xl" />
        <CardTitle className="text-2xl">後台管理員登入</CardTitle>
        <CardDescription>{BRAND_NAME} 內容營運後台僅限 admin 帳號使用。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">密碼</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {message ? <p className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <LockKeyhole className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {loading ? "驗證管理員身分" : "登入後台"}
          </Button>
          <Button type="button" variant="outline" className="w-full" disabled>
            Google Login 預留
          </Button>
        </form>
        <div className="mt-5 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-primary hover:underline">
            返回前台網站
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function reasonMessage(reason?: string) {
  if (reason === "admin_required") {
    return "請先使用 admin 管理員帳號登入後台。";
  }

  if (reason === "signed_out") {
    return "你已登出後台。";
  }

  return "";
}
