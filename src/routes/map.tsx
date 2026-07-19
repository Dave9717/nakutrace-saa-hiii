import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { MapCanvas } from "@/components/map-canvas";
import { CoordinateHUD } from "@/components/coordinate-hud";
import { TransportModeBar, type TransportMode } from "@/components/transport-mode-selector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Fuel,
  Droplets,
  Hospital,
  Shield,
  ShieldAlert,
  Navigation,
  Sun,
  Moon,
} from "lucide-react";
import {
  generateMockRoute,
  generateMockOfflineBoundary,
} from "@/lib/map-utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Offline Map — NAKUTRACE SAI" },
      { name: "description", content: "Vector-tile offline maps with live SOS pins, community reports and GPS routing." },
      { property: "og:title", content: "Offline Map — NAKUTRACE SAI" },
      { property: "og:description", content: "Vector-tile offline maps with live SOS pins, community reports and GPS routing." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://savannah-guide-ai.lovable.app/map" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Offline Map — NAKUTRACE SAI" },
      { name: "twitter:description", content: "Vector-tile offline maps with live SOS pins, community reports and GPS routing." },
    ],
    links: [{ rel: "canonical", href: "https://savannah-guide-ai.lovable.app/map" }],
  }),
  component: MapPage,
});


const safety = [
  { icon: Fuel, label: "Last fuel", value: "12 km · Isiolo" },
  { icon: Droplets, label: "Last water", value: "3 km · Borehole" },
  { icon: Hospital, label: "Last hospital", value: "48 km · Archers Post" },
  { icon: Shield, label: "Last ranger post", value: "21 km · Sera" },
];

function MapPage() {
  const routeData = generateMockRoute();
  const offlineBoundary = generateMockOfflineBoundary();
  const [mapStyle, setMapStyle] = useState<"dark" | "light">("dark");

  const handleModeChange = (mode: TransportMode) => {
    console.log(`Transport mode changed to: ${mode}`);
    // Future: re-route with new transport profile
  };

  return (
    <AppShell title="Map" subtitle="Offline vector tiles · OSM">
      <div className="grid h-[calc(100vh-3.5rem)] gap-0 lg:grid-cols-[1fr_360px]">
        <div className="relative">
          <MapCanvas
            routeData={routeData}
            offlineBoundary={offlineBoundary}
            mapStyle={mapStyle}
          />
          {/* Map style toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMapStyle((prev) => (prev === "dark" ? "light" : "dark"))}
            className="absolute left-3 top-3 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
            title={`Switch to ${mapStyle === "dark" ? "light" : "dark"} map`}
          >
            {mapStyle === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <TransportModeBar onModeChange={handleModeChange} />
          <CoordinateHUD
            latitude={-0.3869}
            longitude={37.6869}
            bearing={340}
            altitude={1673}
            accuracy={5}
          />
          <Button
            variant="destructive"
            size="lg"
            className="absolute bottom-6 right-6 gap-2 rounded-full px-5 shadow-xl z-10"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <ShieldAlert className="h-5 w-5" /> SOS
          </Button>
        </div>
        <aside className="overflow-y-auto border-t border-border bg-card/40 p-4 lg:border-l lg:border-t-0">
          <Card className="p-4">
            <h3 className="text-sm font-semibold">Return to Safety</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Don't worry — I'm here to guide you. Usitense bro.
            </p>
            <Button className="mt-3 w-full gap-2">
              <Navigation className="h-4 w-4" /> Route to nearest safe point
            </Button>
          </Card>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Last known safe locations
          </h3>
          <div className="mt-2 space-y-2">
            {safety.map((s) => (
              <Card key={s.label} className="flex items-center gap-3 p-3">
                <s.icon className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-sm font-medium">{s.value}</div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Cached
                </Badge>
              </Card>
            ))}
          </div>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Route summary
          </h3>
          <Card className="mt-2 p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Distance" value="184 km" />
              <Stat label="ETA" value="3h 42m" />
              <Stat label="Terrain" value="Hard" />
              <Stat label="Fuel" value="~22 L" />
              <Stat label="Water" value="2 sources" />
              <Stat label="Safety" value="8.4 / 10" />
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
