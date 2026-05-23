import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "資料匯入匯出" };

export default function AdminImportExportPage() {
  return <OperationsResourcePage config={adminResourceConfigs["import-export"]} />;
}
