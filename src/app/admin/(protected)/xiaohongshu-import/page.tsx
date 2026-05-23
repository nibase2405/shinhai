import type { Metadata } from "next";
import { XiaohongshuImporter } from "@/components/admin/xiaohongshu-importer";

export const metadata: Metadata = { title: "小紅書匯入" };

export default function AdminXiaohongshuImportPage() {
  return <XiaohongshuImporter />;
}
