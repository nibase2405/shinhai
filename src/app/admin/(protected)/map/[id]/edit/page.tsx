import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminRecordEditor } from "@/components/admin/admin-record-editor";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "地圖 Marker 編輯器" };

export default async function AdminMapMarkerEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = adminResourceConfigs.map;
  const record = config.rows.find((item) => item.id === id);

  if (!record) {
    notFound();
  }

  return (
    <AdminRecordEditor
      title="地圖 Marker 編輯器"
      description={config.description}
      resourceLabel={config.resourceLabel}
      apiResource={config.apiResource}
      backHref="/admin/map"
      record={record}
      fields={config.fields}
      dbFields={config.dbFields}
    />
  );
}
