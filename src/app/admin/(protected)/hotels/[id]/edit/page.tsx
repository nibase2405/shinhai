import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminRecordEditor } from "@/components/admin/admin-record-editor";
import { adminResourceConfigs } from "@/lib/admin/ops-data";

export const metadata: Metadata = { title: "住宿編輯器" };

export default async function AdminHotelEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = adminResourceConfigs.hotels;
  const record = config.rows.find((item) => item.id === id);

  if (!record) {
    notFound();
  }

  return (
    <AdminRecordEditor
      title="住宿編輯器"
      description={config.description}
      resourceLabel={config.resourceLabel}
      apiResource={config.apiResource}
      backHref="/admin/hotels"
      record={record}
      fields={config.fields}
      dbFields={config.dbFields}
    />
  );
}
