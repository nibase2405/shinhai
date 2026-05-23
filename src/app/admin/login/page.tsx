import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getCurrentAdminProfile } from "@/lib/admin/auth";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: "後台管理員登入",
  description: `${BRAND_NAME} 後台管理員登入頁。`
};

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: Promise<{ reason?: string; redirectTo?: string }>;
}) {
  const profile = await getCurrentAdminProfile();

  if (profile) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  const redirectTo = normalizeAdminRedirect(params?.redirectTo);

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-10">
      <AdminLoginForm reason={params?.reason} redirectTo={redirectTo} />
    </main>
  );
}

function normalizeAdminRedirect(redirectTo?: string) {
  if (redirectTo?.startsWith("/admin/") && redirectTo !== "/admin/login") {
    return redirectTo;
  }

  return "/admin/dashboard";
}
