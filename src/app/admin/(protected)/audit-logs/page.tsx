import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "Audit Logs" };

export default function AdminAuditLogsPage() {
  return <OperationsResourcePage config={adminResourceConfigs["audit-logs"]} />;
}
