import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getCurrentAdminProfile } from "@/lib/admin/auth";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentAdminProfile();

  if (!profile) {
    redirect("/admin/login?reason=admin_required");
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <AdminHeader role="admin" />
      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 md:px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar role="admin" />
        <main className="min-w-0 space-y-5">
          <AdminBreadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
