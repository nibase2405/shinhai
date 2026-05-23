import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "分類管理" };

export default function AdminCategoriesPage() {
  return <OperationsResourcePage config={adminResourceConfigs.categories} />;
}
