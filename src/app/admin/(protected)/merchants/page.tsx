import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "商家廣告管理" };

export default function AdminMerchantsPage() {
  return <OperationsResourcePage config={adminResourceConfigs.merchants} />;
}
