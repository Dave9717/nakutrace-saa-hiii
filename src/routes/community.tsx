import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Users, AlertTriangle, Fuel, Droplets, PawPrint, Shield, Route as RouteIcon, Heart, HelpCircle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Mapping — NAKUTRACE SAI" },
      { name: "description", content: "Post and verify field reports — hazards, wildlife, road conditions — from the community." },
      { property: "og:title", content: "Community Mapping — NAKUTRACE SAI" },
      { property: "og:description", content: "Post and verify field reports — hazards, wildlife, road conditions — from the community." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://savannah-guide-ai.lovable.app/community" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Community Mapping — NAKUTRACE SAI" },
      { name: "twitter:description", content: "Post and verify field reports — hazards, wildlife, road conditions — from the community." },
    ],
    links: [{ rel: "canonical", href: "https://savannah-guide-ai.lovable.app/community" }],
  }),
  component: CommunityPage,
});

const KINDS = [
  { value: "hazard", label: "Hazard", icon: AlertTriangle },
  { value: "fuel", label: "Fuel", icon: Fuel },
  { value: "water", label: "Water", icon: Droplets },
  { value: "wildlife", label: "Wildlife", icon: PawPrint },
  { value: "security", label: "Security", icon: Shield },
  { value: "road", label: "Road", icon: RouteIcon },
  { value: "medical", label: "Medical", icon: Heart },
  { value: "other", label: "Other", icon: HelpCircle },
] as const;

const SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;

type Report = {
  id: string; user_id: string; kind: string; title: string; description: string | null;
  latitude: number | null; longitude: number | null; severity: string; verified_count: number; created_at: string;
};

function CommunityPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [kind, setKind] = useState<string>("hazard");
  const [severity, setSeverity] = useState<string>("medium");
  const [filter, setFilter] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("community_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (!cancelled) setReports((data ?? []) as Report[]);
    })();
    const channel = supabase
      .channel("community-reports")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_reports" }, (p) => {
        setReports((prev) => {
          if (p.eventType === "DELETE") return prev.filter((r) => r.id !== (p.old as Report).id);
          const row = p.new as Report;
          const others = prev.filter((r) => r.id !== row.id);
          return [row, ...others].slice(0, 50);
        });
      })
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, []);

  async function submit() {
    if (!user) return toast.error("Sign in to post.");
    if (!title.trim()) return;
    const { error } = await supabase.from("community_reports").insert({
      user_id: user.id, kind, title: title.trim(), description: desc.trim() || null,
      severity, latitude: coords?.lat ?? null, longitude: coords?.lng ?? null,
    });
    if (error) return toast.error(error.message);
    setTitle(""); setDesc("");
    toast.success("Report shared with the community.");
  }

  async function verify(r: Report) {
    if (!user) return toast.error("Sign in to verify.");
    const { error } = await supabase.rpc("increment_verified_count", { _report_id: r.id });
    if (error) toast.error(error.message);
  }

  const visible = filter === "all" ? reports : reports.filter((r) => r.kind === filter);

  return (
    <AppShell title="Community Mapping" subtitle="Field intelligence — verified by people who've been there">
      <div className="grid gap-4 p-4 md:grid-cols-[1fr_360px] md:p-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className="cursor-pointer">All</Badge>
            {KINDS.map((k) => (
              <Badge key={k.value} variant={filter === k.value ? "default" : "outline"} onClick={() => setFilter(k.value)} className="cursor-pointer gap-1">
                <k.icon className="h-3 w-3" />{k.label}
              </Badge>
            ))}
          </div>
          {visible.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No reports in this category yet.</Card>
          ) : visible.map((r) => {
            const K = KINDS.find((k) => k.value === r.kind) ?? KINDS[7];
            return (
              <Card key={r.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <K.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{r.title}</h3>
                      <Badge variant={r.severity === "critical" || r.severity === "high" ? "destructive" : "secondary"} className="uppercase">{r.severity}</Badge>
                    </div>
                    {r.description && <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                      {r.latitude && r.longitude ? ` • ${r.latitude.toFixed(3)}, ${r.longitude.toFixed(3)}` : ""}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => verify(r)}>
                    <ShieldCheck className="h-3 w-3" />{r.verified_count}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="h-fit p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4" />Post a report</h3>
          {!user ? (
            <p className="mt-3 text-xs text-muted-foreground">
              <Link to="/auth" className="text-primary underline">Sign in</Link> to share field intel.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              <Select value={kind} onValueChange={setKind}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{KINDS.map((k) => <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SEVERITIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Short title (e.g. Fuel at Archers Post)" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea placeholder="Optional details — what you saw, when, conditions." value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
              <p className="text-[10px] text-muted-foreground">
                Location: {coords ? `${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}` : "not detected"}
              </p>
              <Button className="w-full" onClick={submit} disabled={!title.trim()}>Post</Button>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}