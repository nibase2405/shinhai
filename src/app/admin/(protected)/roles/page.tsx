import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "權限管理" };

export default function AdminRolesPage() {
  return <OperationsResourcePage config={adminResourceConfigs.roles} />;
}
