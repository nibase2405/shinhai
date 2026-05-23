import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: "會員註冊",
  description: `註冊 ${BRAND_NAME} 會員，收藏上海旅遊攻略內容。`
};

export default function RegisterPage() {
  return (
    <div className="container-page py-12">
      <AuthForm mode="register" />
      <p className="mt-5 text-center text-sm text-muted-foreground">
        已經有帳號？{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          前往登入
        </Link>
      </p>
    </div>
  );
}
