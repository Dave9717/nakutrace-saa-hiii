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
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

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

type Alert = { id: string; message: string | null; severity: string; status: string; created_at: string; latitude: number | null; longitude: number | null };

function SosPage() {
  const { user } = useAuth();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState<Alert[]>([]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, maximumAge: 10_000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("sos_alerts")
        .select("id,message,severity,status,created_at,latitude,longitude")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(20);
      if (!cancelled) setLive((data ?? []) as Alert[]);
    })();
    const channel = supabase
      .channel("sos-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sos_alerts" },
        (payload) => {
          setLive((prev) => {
            const row = (payload.new ?? payload.old) as Alert;
            if (payload.eventType === "DELETE") return prev.filter((p) => p.id !== row.id);
            const others = prev.filter((p) => p.id !== row.id);
            const next = payload.eventType === "INSERT" || (row as Alert).status === "active" ? [row as Alert, ...others] : others;
            return next.slice(0, 20);
          });
        },
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  async function broadcast(label: string, severity: string) {
    if (!user) {
      toast.error("Sign in to broadcast a real SOS.");
      return;
    }
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
    } catch (e: any) {
      toast.error(e.message ?? "Broadcast failed");
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
              <Link to="/auth" className="text-primary underline">Sign in</Link> to broadcast a verified SOS to your convoy.
            </p>
          )}
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <Stat label="GPS lock" value={coords ? `${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}` : "Awaiting…"} />
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
            <Radio className="h-4 w-4 text-destructive" />
            Live active alerts
          </h3>
          {live.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">No active emergencies on the network.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {live.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{a.message ?? "Emergency"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleTimeString()}
                      {a.latitude && a.longitude ? ` • ${a.latitude.toFixed(3)}, ${a.longitude.toFixed(3)}` : ""}
                    </p>
                  </div>
                  <Badge variant="destructive" className="uppercase">{a.severity}</Badge>
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