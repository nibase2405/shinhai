import type { Metadata } from "next";
import { TravelpayoutsManager } from "@/components/admin/travelpayouts-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Travelpayouts 串接" };

export default function AdminTravelpayoutsPage() {
  return (
    <TravelpayoutsManager
      defaultMarker={process.env.TRAVELPAYOUTS_MARKER ?? ""}
      defaultTrs={process.env.TRAVELPAYOUTS_TRS ?? ""}
      hasServerToken={Boolean(process.env.TRAVELPAYOUTS_API_TOKEN)}
    />
  );
}
