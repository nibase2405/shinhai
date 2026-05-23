import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "住宿管理" };

export default function AdminHotelsPage() {
  return <OperationsResourcePage config={adminResourceConfigs.hotels} editPathBase="/admin/hotels" />;
}
