import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "Affiliate 點擊統計" };

export default function AdminAffiliateClicksPage() {
  return <OperationsResourcePage config={adminResourceConfigs["affiliate-clicks"]} />;
}
