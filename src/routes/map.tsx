import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { MapCanvas } from "@/components/map-canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Footprints,
  Car,
  Bike,
  Bus,
  Truck,
  Navigation,
  Fuel,
  Droplets,
  Hospital,
  Shield,
  ShieldAlert,
  RotateCcw,
  Compass,
} from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useMemo } from "react";
import { formatCoords } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Map — NAKUTRACE SAI" }] }),
  component: MapPage,
});

const modes = [
  { icon: Footprints, label: "Walk" },
  { icon: Car, label: "Car" },
  { icon: Bike, label: "Bike" },
  { icon: Bus, label: "Transit" },
  { icon: Truck, label: "Off-road" },
  { icon: Navigation, label: "Safari" },
];

const safety = [
  { icon: Fuel, label: "Last fuel", value: "12 km · Isiolo" },
  { icon: Droplets, label: "Last water", value: "3 km · Borehole" },
  { icon: Hospital, label: "Last hospital", value: "48 km · Archers Post" },
  { icon: Shield, label: "Last ranger post", value: "21 km · Sera" },
];

function MapPage() {
  const coords = useGeolocation({ watch: true, enableHighAccuracy: true, maximumAge: 1000 });
  const locationSummary = useMemo(() => {
    if (!coords) return "Waiting for GPS…";
    return formatCoords(coords.lat, coords.lng) ?? "GPS lock acquired";
  }, [coords]);

  return (
    <AppShell title="Map" subtitle="Offline vector tiles · OSM">
      <div className="grid h-[calc(100vh-3.5rem)] gap-0 lg:grid-cols-[1fr_360px]">
        <div className="relative">
          <MapCanvas />
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
            <div className="pointer-events-auto flex gap-1 rounded-full border border-border bg-background/70 p-1 shadow-xl backdrop-blur-lg">
              {modes.map((m) => (
                <Button key={m.label} variant="ghost" size="sm" className="gap-1.5 rounded-full">
                  <m.icon className="h-4 w-4" /> {m.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-full bg-card/90 px-4 shadow-lg"
            >
              <RotateCcw className="h-4 w-4" /> Refresh GPS
            </Button>
            <Button
              asChild
              variant="destructive"
              size="lg"
              className="gap-2 rounded-full px-5 shadow-xl"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <Link to="/sos">
                <ShieldAlert className="h-5 w-5" /> SOS
              </Link>
            </Button>
          </div>
        </div>
        <aside className="overflow-y-auto border-t border-border bg-background/20 p-4 lg:border-l lg:border-t-0">
          <Card className="glass-panel p-4">
            <h3 className="text-sm font-semibold">Return to Safety</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Live GPS, heading, route history, and safe-point guidance are available even when
              signal drops.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-background/70 px-3 py-2 text-xs text-muted-foreground">
              <Compass className="h-3.5 w-3.5 text-primary" /> {locationSummary}
            </div>
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
            <div className="mt-4 rounded-2xl border border-border bg-background/60 p-3 text-xs text-muted-foreground">
              <div className="font-medium text-foreground">Travel history</div>
              <div className="mt-1">Last refresh: {locationSummary}</div>
              <div className="mt-1">Route tracking: active · heading available when supported</div>
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
