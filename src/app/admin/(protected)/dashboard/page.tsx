import type { Metadata } from "next";
import { BadgeDollarSign, Eye, FileText, Hotel, MapPin, Megaphone, Soup, UsersRound } from "lucide-react";
import { AdminChartCard } from "@/components/admin/admin-chart-card";
import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminDashboardRankings, adminDashboardStats } from "@/lib/admin/ops-data";

export const metadata: Metadata = {
  title: "Admin Dashboard"
};

const statIcons = [Eye, Eye, Eye, UsersRound, FileText, MapPin, Soup, Hotel, BadgeDollarSign, Megaphone, FileText];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">儀表板</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          追蹤流量、內容量、會員、廣告版位、Affiliate 點擊與待審內容，作為日常營運入口。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminDashboardStats.map((stat, index) => {
          const Icon = statIcons[index] ?? FileText;
          return (
            <AdminStatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              helper={stat.helper}
              trend={stat.trend}
              icon={<Icon className="h-5 w-5" />}
            />
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminChartCard title="熱門文章排行" items={adminDashboardRankings.articles.slice(0, 5)} />
        <AdminChartCard title="Affiliate 點擊排行" items={adminDashboardRankings.affiliate.slice(0, 5)} />
        <AdminChartCard title="熱門景點排行" items={adminDashboardRankings.attractions.slice(0, 5)} />
        <AdminChartCard title="熱門美食排行" items={adminDashboardRankings.food.slice(0, 5)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>熱門住宿排行</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {adminDashboardRankings.hotels.slice(0, 5).map((item, index) => (
              <div key={item.label} className="rounded-lg border bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">#{index + 1}</p>
                <p className="mt-1 line-clamp-2 font-medium">{item.label}</p>
                <p className="mt-2 text-xs text-muted-foreground">{item.helper}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
