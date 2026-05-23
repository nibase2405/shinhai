import type { Metadata } from "next";
import { OperationsResourcePage } from "@/components/admin/operations-resource-page";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "媒體庫" };

export default function AdminMediaPage() {
  return <OperationsResourcePage config={adminResourceConfigs.media} />;
}
