import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "景點管理" };

export default function AdminAttractionsPage() {
  return <OperationsResourcePage config={adminResourceConfigs.attractions} editPathBase="/admin/attractions" />;
}
