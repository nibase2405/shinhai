import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "地圖管理" };

export default function AdminMapPage() {
  return <OperationsResourcePage config={adminResourceConfigs.map} editPathBase="/admin/map" />;
}
