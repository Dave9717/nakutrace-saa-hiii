import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Wrench,
  Shield,
  UserSearch,
  PawPrint,
  Flame,
  Waves,
  Radio,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/sos")({
  head: () => ({ meta: [{ title: "SOS & Rescue — NAKUTRACE SAI" }] }),
  component: SosPage,
});

const types = [
  { icon: Heart, label: "Medical", tone: "destructive" },
  { icon: Wrench, label: "Vehicle breakdown" },
  { icon: Shield, label: "Security threat", tone: "destructive" },
  { icon: UserSearch, label: "Missing person" },
  { icon: PawPrint, label: "Wildlife attack", tone: "destructive" },
  { icon: Flame, label: "Fire", tone: "destructive" },
  { icon: Waves, label: "Flood" },
  { icon: Radio, label: "Search & rescue" },
];

function SosPage() {
  return (
    <AppShell title="SOS & Rescue" subtitle="Mesh-broadcast · Auto-sync when online">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-8">
        <Card
          className="flex flex-col items-center gap-4 border-destructive/40 bg-destructive/5 p-8 text-center"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <Badge variant="destructive" className="uppercase tracking-widest">
            Persistent emergency
          </Badge>
          <h2 className="text-2xl font-bold">One-tap SOS</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Saves GPS, pins your location for up to 142 hours, broadcasts over Bluetooth mesh & WiFi
            Direct, and alerts your convoy & guardians.
          </p>
          <Button
            size="lg"
            variant="destructive"
            className="h-20 w-20 rounded-full text-base font-bold"
            style={{ boxShadow: "0 0 0 8px oklch(0.58 0.23 22 / 25%)" }}
          >
            SOS
          </Button>
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <Stat label="GPS pin TTL" value="6h – 142h" />
            <Stat label="Mesh relay" value="BT + WiFi-Direct" />
            <Stat label="Encryption" value="End-to-end" />
          </div>
        </Card>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Emergency type
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {types.map((t) => (
              <Card
                key={t.label}
                className="flex cursor-pointer items-center gap-3 p-4 transition-all hover:border-primary/60"
              >
                <div
                  className={
                    "flex h-10 w-10 items-center justify-center rounded-md " +
                    (t.tone === "destructive"
                      ? "bg-destructive/15 text-destructive"
                      : "bg-primary/15 text-primary")
                  }
                >
                  <t.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{t.label}</span>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            Disclaimer
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            AI guidance is informational only and must not replace professional emergency, rescue,
            navigation, medical, or security services.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}