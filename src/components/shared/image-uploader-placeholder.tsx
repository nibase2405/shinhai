import { UploadCloud } from "lucide-react";

export function ImageUploaderPlaceholder({ label = "圖片上傳預留" }: { label?: string }) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
      <UploadCloud className="h-6 w-6" />
      <span>{label}</span>
      <span className="text-xs">後續可串 Supabase Storage 或外部 CDN</span>
    </div>
  );
}
