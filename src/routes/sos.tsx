import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
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
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useRealtimeQuery } from "@/hooks/use-realtime-query";
import { toast } from "sonner";
import { formatCoords, formatTimestampWithCoords, requireAuth, AI_DISCLAIMER } from "@/lib/utils";
import { IconBox } from "@/components/icon-box";

export const Route = createFileRoute("/sos")({
  head: () => ({ meta: [{ title: "SOS & Rescue — NAKUTRACE SAI" }] }),
  component: SosPage,
});

type SosType = { icon: typeof Heart; label: string; severity: string; tone?: "destructive" };
const types: SosType[] = [
  { icon: Heart, label: "Medical", severity: "critical", tone: "destructive" },
  { icon: Wrench, label: "Vehicle breakdown", severity: "medium" },
  { icon: Shield, label: "Security threat", severity: "critical", tone: "destructive" },
  { icon: UserSearch, label: "Missing person", severity: "high" },
  { icon: PawPrint, label: "Wildlife attack", severity: "critical", tone: "destructive" },
  { icon: Flame, label: "Fire", severity: "critical", tone: "destructive" },
  { icon: Waves, label: "Flood", severity: "high" },
  { icon: Radio, label: "Search & rescue", severity: "high" },
];

type Alert = {
  id: string;
  message: string | null;
  severity: string;
  status: string;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
};

function SosPage() {
  const { user } = useAuth();
  const coords = useGeolocation({ watch: true, maximumAge: 10_000 });
  const [busy, setBusy] = useState(false);
  const [live] = useRealtimeQuery<Alert>({
    table: "sos_alerts",
    channel: "sos-live",
    select: "id,message,severity,status,created_at,latitude,longitude",
    filter: { column: "status", value: "active" },
    limit: 20,
    onPayload: (prev, payload) => {
      const row = (payload.new ?? payload.old) as Alert;
      if (payload.eventType === "DELETE") return prev.filter((p) => p.id !== row.id);
      const others = prev.filter((p) => p.id !== row.id);
      const next =
        payload.eventType === "INSERT" || (row as Alert).status === "active"
          ? [row as Alert, ...others]
          : others;
      return next.slice(0, 20);
    },
  });

  async function broadcast(label: string, severity: string) {
    if (!requireAuth(user, "broadcast a real SOS")) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("sos_alerts").insert({
        user_id: user.id,
        message: label,
        severity,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
      });
      if (error) throw error;
      toast.success("SOS broadcast — convoy & guardians notified.");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Broadcast failed";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell title="SOS & Rescue" subtitle="Live broadcast · Auto-sync when online">
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
            disabled={busy}
            onClick={() => broadcast("One-tap SOS", "critical")}
          >
            {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : "SOS"}
          </Button>
          {!user && (
            <p className="text-xs text-muted-foreground">
              <Link to="/auth" className="text-primary underline">
                Sign in
              </Link>{" "}
              to broadcast a verified SOS to your convoy.
            </p>
          )}
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <Stat label="GPS lock" value={formatCoords(coords?.lat, coords?.lng) ?? "Awaiting…"} />
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
                role="button"
                onClick={() => broadcast(t.label, t.severity)}
                className="flex cursor-pointer items-center gap-3 p-4 transition-all hover:border-primary/60"
              >
                <IconBox
                  icon={t.icon}
                  variant={t.tone === "destructive" ? "destructive" : "primary"}
                />
                <span className="text-sm font-medium">{t.label}</span>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Radio className="h-4 w-4 text-destructive" />
            Live active alerts
          </h3>
          {live.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              No active emergencies on the network.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {live.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{a.message ?? "Emergency"}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestampWithCoords(a.created_at, a.latitude, a.longitude, "time")}
                    </p>
                  </div>
                  <Badge variant="destructive" className="uppercase">
                    {a.severity}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            Disclaimer
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">{AI_DISCLAIMER}</p>
        </Card>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-surface p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
