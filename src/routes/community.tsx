import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/feature-page";
import { Users, Route as RouteIcon, Camera, Fuel, Droplets, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community Mapping — NAKUTRACE SAI" }] }),
  component: () => (
    <FeaturePage
      title="Community Mapping"
      subtitle="Field intelligence, contributed by people who've been there"
      headline="The map gets smarter with every traveler."
      intro="Add trails, roads, desert tracks, shops, campsites, fuel and water points, hazards and events — with photos, video and trust scoring."
      icon={Users}
      features={[
        { icon: RouteIcon, title: "Trails & tracks", desc: "Off-road routes, safari tracks and 4x4-only paths." },
        { icon: Camera, title: "Media-rich", desc: "Attach photos, video and notes to any entry." },
        { icon: Fuel, title: "Fuel reports", desc: "Stock status and price snapshots, community-confirmed." },
        { icon: Droplets, title: "Water sources", desc: "Wells, boreholes, springs and seasonal points." },
        { icon: AlertTriangle, title: "Hazards", desc: "Washouts, wildlife danger zones and security incidents." },
        { icon: CheckCircle2, title: "Trust levels", desc: "Verified · Confirmed · Unverified — at a glance.", badge: "Green/Yellow/Red" },
      ]}
    />
  ),
});