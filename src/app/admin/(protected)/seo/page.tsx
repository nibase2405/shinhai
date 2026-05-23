import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "SEO 管理中心" };

export default function AdminSeoPage() {
  return <OperationsResourcePage config={adminResourceConfigs.seo} />;
}
