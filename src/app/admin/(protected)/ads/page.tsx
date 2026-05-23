import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "廣告版位管理" };

export default function AdminAdsPage() {
  return <OperationsResourcePage config={adminResourceConfigs.ads} />;
}
