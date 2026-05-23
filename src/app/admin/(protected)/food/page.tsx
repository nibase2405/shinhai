import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "美食管理" };

export default function AdminFoodPage() {
  return <OperationsResourcePage config={adminResourceConfigs.food} editPathBase="/admin/food" />;
}
