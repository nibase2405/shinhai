import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "Affiliate 分潤管理" };

export default function AdminAffiliateLinksPage() {
  return <OperationsResourcePage config={adminResourceConfigs["affiliate-links"]} />;
}
