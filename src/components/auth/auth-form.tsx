"use client";

import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("尚未設定 Supabase 環境變數，表單目前為 UI 預覽模式。");
      setLoading(false);
      return;
    }

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/member`
            }
          });

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage(mode === "login" ? "登入成功，正在前往會員中心。" : "註冊完成，請依 Supabase Email 設定確認信箱。");
      if (mode === "login") {
        window.location.href = "/member";
      }
    }
    setLoading(false);
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "login" ? "會員登入" : "建立會員"}</CardTitle>
        <CardDescription>
          {mode === "login" ? "使用 Supabase Email Login 登入。" : "註冊後可收藏文章、景點、美食與住宿。"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密碼</Label>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          {message ? <p className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="h-4 w-4" />
            {loading ? "處理中" : mode === "login" ? "登入" : "註冊"}
          </Button>
          <Button type="button" variant="outline" className="w-full" disabled>
            Google Login 預留
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
