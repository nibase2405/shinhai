"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/components/map/map-view";

const LazyMapView = dynamic(() => import("@/components/map/map-view"), {
  ssr: false,
  loading: () => (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="min-h-[560px] animate-pulse rounded-lg border bg-secondary/60" />
      <div className="space-y-4">
        <div className="h-11 animate-pulse rounded-lg border bg-secondary/60" />
        <div className="h-64 animate-pulse rounded-lg border bg-secondary/60" />
      </div>
    </div>
  )
});

export function DeferredMapView({ markers }: { markers: MapMarker[] }) {
  return <LazyMapView markers={markers} />;
}
