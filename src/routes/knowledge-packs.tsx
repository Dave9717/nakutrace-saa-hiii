import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Download,
  CheckCircle2,
  Mountain,
  Sun,
  HeartPulse,
  Bug,
  PawPrint,
  Wrench,
  Hospital,
  Camera,
  Shield,
  Droplets,
  Languages,
  Map as MapIcon,
} from "lucide-react";

export const Route = createFileRoute("/knowledge-packs")({
  head: () => ({ meta: [{ title: "Knowledge Packs — NAKUTRACE SAI" }] }),
  component: PacksPage,
});

const packs = [
  { slug: "wilderness", icon: Mountain, title: "Wilderness Survival", size: "82 MB", sizeMb: 82 },
  { slug: "desert", icon: Sun, title: "Desert Survival", size: "64 MB", sizeMb: 64 },
  { slug: "first-aid", icon: HeartPulse, title: "First Aid", size: "120 MB", sizeMb: 120 },
  { slug: "snakebite", icon: Bug, title: "Snakebite & Venom", size: "48 MB", sizeMb: 48 },
  { slug: "wildlife", icon: PawPrint, title: "Wildlife Safety", size: "96 MB", sizeMb: 96 },
  { slug: "vehicle", icon: Wrench, title: "Vehicle Recovery", size: "55 MB", sizeMb: 55 },
  { slug: "medical", icon: Hospital, title: "Medical Emergency", size: "210 MB", sizeMb: 210 },
  { slug: "safari", icon: Camera, title: "Safari Guide", size: "180 MB", sizeMb: 180 },
  { slug: "ranger", icon: Shield, title: "Ranger Operations", size: "75 MB", sizeMb: 75 },
  { slug: "water-fuel", icon: Droplets, title: "Water & Fuel Intelligence", size: "40 MB", sizeMb: 40 },
  { slug: "translation", icon: Languages, title: "Translation Pack (EN/SW/FR/AR/HI/SO/Sudanese)", size: "30 MB", sizeMb: 30 },
  { slug: "eastafrica-maps", icon: MapIcon, title: "East Africa Offline Maps", size: "1.4 GB", sizeMb: 1400 },
];
const TOTAL_MB = 8192;

function PacksPage() {
  const { user } = useAuth();
  const [installed, setInstalled] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setInstalled(new Set()); return; }
    supabase.from("knowledge_pack_downloads").select("pack_slug").then(({ data }) => {
      setInstalled(new Set((data ?? []).map((d: any) => d.pack_slug)));
    });
  }, [user]);

  async function toggle(slug: string, isInstalled: boolean) {
    if (!user) return toast.error("Sign in to manage downloads");
    setBusy(slug);
    if (isInstalled) {
      const { error } = await supabase.from("knowledge_pack_downloads").delete().eq("pack_slug", slug);
      if (error) toast.error(error.message);
      else { setInstalled((s) => { const n = new Set(s); n.delete(slug); return n; }); toast.success("Removed"); }
    } else {
      const { error } = await supabase.from("knowledge_pack_downloads").insert({ user_id: user.id, pack_slug: slug });
      if (error) toast.error(error.message);
      else { setInstalled((s) => new Set(s).add(slug)); toast.success("Downloaded"); }
    }
    setBusy(null);
  }

  const usedMb = packs.filter((p) => installed.has(p.slug)).reduce((s, p) => s + p.sizeMb, 0);
  const pct = Math.min(100, Math.round((usedMb / TOTAL_MB) * 100));

  return (
    <AppShell title="Knowledge Packs" subtitle="Download once. Use anywhere.">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Card className="border-primary/30 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
              <h2 className="text-base font-semibold">Storage used</h2>
              <p className="text-xs text-muted-foreground">{(usedMb / 1024).toFixed(2)} GB of 8 GB allocated</p>
              <Progress value={pct} className="mt-2 h-2" />
            </div>
            <Button className="gap-2" onClick={async () => {
              if (!user) return toast.error("Sign in first");
              const missing = packs.filter((p) => !installed.has(p.slug));
              if (!missing.length) return toast("Already up to date");
              const { error } = await supabase.from("knowledge_pack_downloads").upsert(missing.map((p) => ({ user_id: user.id, pack_slug: p.slug })), { onConflict: "user_id,pack_slug" });
              if (error) return toast.error(error.message);
              setInstalled(new Set(packs.map((p) => p.slug)));
              toast.success("All packs queued");
            }}>
              <Download className="h-4 w-4" /> Download all (recommended)
            </Button>
          </div>
        </Card>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((p) => {
            const isInstalled = installed.has(p.slug);
            return (
            <Card key={p.slug} className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{p.size}</div>
              </div>
              {isInstalled ? (
                <Badge variant="outline" onClick={() => toggle(p.slug, true)} className="cursor-pointer gap-1 border-primary/40 text-primary">
                  <CheckCircle2 className="h-3 w-3" /> Installed
                </Badge>
              ) : (
                <Button size="sm" variant="outline" className="gap-1" disabled={busy === p.slug} onClick={() => toggle(p.slug, false)}>
                  <Download className="h-3 w-3" /> Get
                </Button>
              )}
            </Card>
          );})}
        </div>
      </div>
    </AppShell>
  );
}