import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "系統設定" };

export default function AdminSettingsPage() {
  return <OperationsResourcePage config={adminResourceConfigs.settings} />;
}
