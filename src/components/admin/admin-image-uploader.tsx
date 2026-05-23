"use client";

import { ImagePlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminImageUploader({
  title = "圖片上傳",
  description = "Supabase Storage / 圖片壓縮流程預留。"
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed bg-secondary/30 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-background p-2 text-primary">
          <ImagePlus className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <Button variant="outline" size="sm" className="mt-3">
            <Upload className="h-4 w-4" />
            選擇圖片
          </Button>
        </div>
      </div>
    </div>
  );
}
