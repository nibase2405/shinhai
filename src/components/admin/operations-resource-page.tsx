import { CheckCircle2 } from "lucide-react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminImageUploader } from "@/components/admin/admin-image-uploader";
import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminResourceConfig } from "@/types/admin";

export function OperationsResourcePage({ config, editPathBase }: { config: AdminResourceConfig; editPathBase?: string }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="section-title">{config.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>

      {config.stats?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {config.stats.map((item) => (
            <AdminStatsCard key={item.label} label={item.label} value={item.value} helper={item.helper} trend={item.trend} />
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {config.featureSections?.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              {section.description ? <p className="text-sm text-muted-foreground">{section.description}</p> : null}
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
        <AdminImageUploader />
      </div>

      <AdminDataTable
        title={`${config.resourceLabel}資料表`}
        description="支援搜尋、篩選、排序、分頁、批次操作、確認刪除與儲存提示。"
        apiResource={config.apiResource}
        columns={config.columns}
        rows={config.rows}
        fields={config.fields}
        filters={config.filters}
        bulkActions={config.bulkActions}
        searchableKeys={config.searchableKeys}
        dbFields={config.dbFields}
        editPathBase={editPathBase}
      />
    </div>
  );
}
