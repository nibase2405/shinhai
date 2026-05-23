import type { Metadata } from "next";
import { DeferredMapView } from "@/components/map/deferred-map-view";
import { AdsenseSlot } from "@/components/shared/adsense-slot";
import { mapMarkers } from "@/lib/data";

export const metadata: Metadata = {
  title: "上海旅遊地圖",
  description: "上海景點、美食、住宿、咖啡廳、酒吧與購物 marker 地圖。"
};

export default function MapPage() {
  return (
    <div className="container-page space-y-6 py-10">
      <AdsenseSlot placement="map_top_970x250" size="970x250" className="min-h-[250px]" />
      <div>
        <h1 className="section-title">上海旅遊地圖</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          可依景點、美食、住宿、咖啡廳、酒吧與購物切換；Google Maps / Mapbox provider 已預留。
        </p>
      </div>
      <DeferredMapView markers={mapMarkers} />
    </div>
  );
}
