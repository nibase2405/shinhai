import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "標籤管理" };

export default function AdminTagsPage() {
  return <OperationsResourcePage config={adminResourceConfigs.tags} />;
}
