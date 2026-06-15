import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { ShieldAlert, LogOut, UserCog, Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NAKUTRACE SAI" }] }),
  component: Dashboard,
});

type Profile = { id: string; display_name: string | null; call_sign: string | null; home_region: string | null; avatar_url: string | null };
type Alert = { id: string; message: string | null; status: string; severity: string; created_at: string; latitude: number | null; longitude: number | null };

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [callSign, setCallSign] = useState("");
  const [homeRegion, setHomeRegion] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: p }, { data: r }, { data: a }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
        supabase.from("sos_alerts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      setProfile(p as Profile | null);
      if (p) {
        setCallSign(p.call_sign ?? "");
        setHomeRegion(p.home_region ?? "");
        setDisplayName(p.display_name ?? "");
      }
      setRoles((r ?? []).map((x: { role: string }) => x.role));
      setAlerts((a ?? []) as Alert[]);
      setLoading(false);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const isAdmin = roles.includes("admin");

  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("profiles")
      .update({ call_sign: callSign || null, home_region: homeRegion || null, display_name: displayName || null })
      .eq("id", profile.id)
      .select()
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    setProfile(data as Profile);
    setEditing(false);
    toast.success("Profile updated");
  }

  return (
    <AppShell>
      <div className="container mx-auto max-w-5xl space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}</h1>
            <p className="text-sm text-muted-foreground">Your field console — convoys, alerts and personal telemetry.</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button asChild variant="outline" size="sm"><Link to="/admin"><UserCog className="mr-2 h-4 w-4" />Admin</Link></Button>
            )}
            <Button variant="outline" size="sm" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Call sign</p>
            <p className="mt-1 text-lg font-semibold">{profile?.call_sign ?? "—"}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Home region</p>
            <p className="mt-1 text-lg font-semibold">{profile?.home_region ?? "—"}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Roles</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {roles.length === 0 ? <Badge variant="secondary">user</Badge> : roles.map(r => <Badge key={r}>{r}</Badge>)}
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Field profile</h2>
            <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}>{editing ? "Cancel" : "Edit"}</Button>
          </div>
          {editing && (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div>
                <Label className="text-xs">Display name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Call sign</Label>
                <Input value={callSign} onChange={(e) => setCallSign(e.target.value)} placeholder="e.g. SIMBA-1" />
              </div>
              <div>
                <Label className="text-xs">Home region</Label>
                <Input value={homeRegion} onChange={(e) => setHomeRegion(e.target.value)} placeholder="e.g. Samburu, KE" />
              </div>
              <div className="md:col-span-3">
                <Button onClick={saveProfile} disabled={saving} className="gap-2"><Save className="h-4 w-4" />{saving ? "Saving…" : "Save profile"}</Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><ShieldAlert className="h-5 w-5 text-destructive" />Your SOS history</h2>
            <Button asChild size="sm" variant="destructive"><Link to="/sos">Broadcast SOS</Link></Button>
          </div>
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> :
            alerts.length === 0 ? <p className="text-sm text-muted-foreground">No alerts on record. Stay safe out there.</p> :
            <ul className="divide-y divide-border">
              {alerts.map(a => (
                <li key={a.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.message || "Emergency broadcast"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}{a.latitude && a.longitude ? ` • ${a.latitude.toFixed(3)}, ${a.longitude.toFixed(3)}` : ""}</p>
                  </div>
                  <Badge variant={a.status === "active" ? "destructive" : "secondary"}>{a.status}</Badge>
                </li>
              ))}
            </ul>
          }
        </Card>
      </div>
    </AppShell>
  );
}