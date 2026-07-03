import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, UserCheck, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/guardian")({
  head: () => ({
    meta: [
      { title: "Guardian Mode — NAKUTRACE SAI" },
      { name: "description", content: "Trusted contacts, persistent safety check-ins and live GPS alerts for loved ones." },
      { property: "og:title", content: "Guardian Mode — NAKUTRACE SAI" },
      { property: "og:description", content: "Trusted contacts, persistent safety check-ins and live GPS alerts for loved ones." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://savannah-guide-ai.lovable.app/guardian" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Guardian Mode — NAKUTRACE SAI" },
      { name: "twitter:description", content: "Trusted contacts, persistent safety check-ins and live GPS alerts for loved ones." },
    ],
    links: [{ rel: "canonical", href: "https://savannah-guide-ai.lovable.app/guardian" }],
  }),
  component: GuardianPage,
});

type Guardian = { id: string; name: string; contact: string; relationship: string | null };
type Checkin = { id: string; status: string; note: string | null; latitude: number | null; longitude: number | null; created_at: string };

function GuardianPage() {
  const { user } = useAuth();
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [relationship, setRelationship] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!user) return;
    const [{ data: g }, { data: c }] = await Promise.all([
      supabase.from("guardians").select("*").order("created_at", { ascending: false }),
      supabase.from("guardian_checkins").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    setGuardians((g ?? []) as Guardian[]);
    setCheckins((c ?? []) as Checkin[]);
  }
  useEffect(() => { load(); }, [user]);

  async function addGuardian(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !name || !contact) return;
    const { error } = await supabase.from("guardians").insert({ user_id: user.id, name, contact, relationship: relationship || null });
    if (error) return toast.error(error.message);
    setName(""); setContact(""); setRelationship("");
    toast.success("Guardian added");
    load();
  }

  async function removeGuardian(id: string) {
    const { error } = await supabase.from("guardians").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  async function checkIn(status: string) {
    if (!user) return;
    setBusy(true);
    const coords = await new Promise<GeolocationCoordinates | null>((res) => {
      if (!navigator.geolocation) return res(null);
      navigator.geolocation.getCurrentPosition((p) => res(p.coords), () => res(null), { enableHighAccuracy: true, timeout: 5000 });
    });
    const { error } = await supabase.from("guardian_checkins").insert({
      user_id: user.id, status, note: note || null,
      latitude: coords?.latitude ?? null, longitude: coords?.longitude ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setNote("");
    toast.success(`Checked in as ${status}`);
    load();
  }

  if (!user) {
    return (
      <AppShell title="Guardian Mode" subtitle="Sign in to manage your trusted circle">
        <div className="mx-auto max-w-md p-8 text-center">
          <Heart className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Guardian check-ins require an account.</p>
          <Button asChild className="mt-4"><Link to="/auth">Sign in</Link></Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Guardian Mode" subtitle="Your trusted circle, always informed">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-8">
        <Card className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick check-in</h3>
          <Input placeholder="Optional note (e.g. 'Stopped at fuel station')" value={note} onChange={(e) => setNote(e.target.value)} className="mt-3" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button disabled={busy} onClick={() => checkIn("safe")} className="gap-1">{busy && <Loader2 className="h-4 w-4 animate-spin" />}I'm safe</Button>
            <Button disabled={busy} variant="outline" onClick={() => checkIn("delayed")}>Delayed</Button>
            <Button disabled={busy} variant="destructive" onClick={() => checkIn("need_help")}>Need help</Button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold"><UserCheck className="h-4 w-4 text-primary" /> Trusted contacts ({guardians.length}/8)</h3>
          <form onSubmit={addGuardian} className="mt-3 grid gap-2 sm:grid-cols-4">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Phone or email" value={contact} onChange={(e) => setContact(e.target.value)} />
            <Input placeholder="Relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
            <Button type="submit" disabled={guardians.length >= 8}>Add</Button>
          </form>
          <ul className="mt-4 divide-y divide-border">
            {guardians.map((g) => (
              <li key={g.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <div className="font-medium">{g.name} {g.relationship && <span className="text-xs text-muted-foreground">· {g.relationship}</span>}</div>
                  <div className="text-xs text-muted-foreground">{g.contact}</div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => removeGuardian(g.id)}><Trash2 className="h-4 w-4" /></Button>
              </li>
            ))}
            {guardians.length === 0 && <li className="py-3 text-xs text-muted-foreground">No guardians yet — add up to 8.</li>}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-primary" /> Recent check-ins</h3>
          {checkins.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">No check-ins yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {checkins.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate">{c.note ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleString()}
                      {c.latitude && c.longitude ? ` • ${c.latitude.toFixed(3)}, ${c.longitude.toFixed(3)}` : ""}
                    </p>
                  </div>
                  <Badge variant={c.status === "need_help" ? "destructive" : c.status === "delayed" ? "secondary" : "outline"}>{c.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}