"use client";

import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MarkerPopup } from "@/components/map/marker-popup";
import { cn } from "@/lib/utils";

export type MapMarker = {
  id: string;
  name: string;
  cover_image: string;
  latitude: number;
  longitude: number;
  rating: number;
  markerType: string;
  href: string;
};

const markerTypes = ["全部", "景點", "美食", "住宿", "咖啡廳", "酒吧", "購物"];

export function MapView({ markers }: { markers: MapMarker[] }) {
  const [activeType, setActiveType] = useState("全部");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(markers[0]?.id ?? "");
  const hasProvider = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  const filteredMarkers = useMemo(() => {
    return markers.filter((marker) => {
      const typeMatch = activeType === "全部" || marker.markerType === activeType;
      const queryMatch = !query || marker.name.toLowerCase().includes(query.toLowerCase());
      return typeMatch && queryMatch;
    });
  }, [activeType, markers, query]);

  const activeMarker = filteredMarkers.find((marker) => marker.id === activeId) || filteredMarkers[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="relative min-h-[560px] overflow-hidden rounded-lg border bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_28%),linear-gradient(135deg,rgba(14,165,233,0.14),rgba(255,255,255,0.7))]">
        <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-32px)] flex-wrap gap-2 rounded-lg border bg-card/95 p-2 shadow-sm backdrop-blur">
          {markerTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                activeType === type ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              )}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 z-10 rounded-lg border bg-card/95 px-3 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur">
          {hasProvider ? "已偵測地圖 API Key，可接 Google Maps / Mapbox Provider。" : "地圖 Provider 預留：填入 Google Maps 或 Mapbox token 後可替換此視圖。"}
        </div>
        <div className="absolute inset-0">
          {filteredMarkers.map((marker, index) => (
            <button
              key={marker.id}
              onClick={() => setActiveId(marker.id)}
              className={cn(
                "absolute inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border bg-card px-3 py-2 text-xs font-medium shadow-md transition-transform hover:scale-105",
                activeMarker?.id === marker.id ? "bg-primary text-primary-foreground" : ""
              )}
              style={{
                left: `${24 + ((index * 17) % 58)}%`,
                top: `${28 + ((index * 23) % 52)}%`
              }}
            >
              <MapPin className="h-4 w-4" />
              {marker.name}
            </button>
          ))}
        </div>
      </div>
      <aside className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border bg-card px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜尋地點"
            className="border-0 px-0 focus-visible:ring-0"
          />
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium">地點列表</p>
            <Badge variant="secondary">{filteredMarkers.length} 筆</Badge>
          </div>
          <div className="max-h-[320px] space-y-2 overflow-auto pr-1">
            {filteredMarkers.map((marker) => (
              <button
                key={marker.id}
                onClick={() => setActiveId(marker.id)}
                className={cn(
                  "w-full rounded-md border p-3 text-left text-sm hover:bg-secondary",
                  activeMarker?.id === marker.id ? "border-primary bg-secondary" : ""
                )}
              >
                <span className="font-medium">{marker.name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{marker.markerType} / {marker.rating}</span>
              </button>
            ))}
          </div>
        </div>
        {activeMarker ? (
          <MarkerPopup
            image={activeMarker.cover_image}
            name={activeMarker.name}
            category={activeMarker.markerType}
            rating={activeMarker.rating}
            href={activeMarker.href}
          />
        ) : null}
        <div className="rounded-lg border border-dashed bg-secondary/40 p-4 text-sm text-muted-foreground">
          付費商家置頂 marker 功能預留：後台可新增 sponsored 欄位後排序置頂。
        </div>
      </aside>
    </div>
  );
}

export default MapView;
