import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  { icon: Mountain, title: "Wilderness Survival", size: "82 MB", installed: true },
  { icon: Sun, title: "Desert Survival", size: "64 MB", installed: true },
  { icon: HeartPulse, title: "First Aid", size: "120 MB", installed: true },
  { icon: Bug, title: "Snakebite & Venom", size: "48 MB", installed: false },
  { icon: PawPrint, title: "Wildlife Safety", size: "96 MB", installed: false },
  { icon: Wrench, title: "Vehicle Recovery", size: "55 MB", installed: false },
  { icon: Hospital, title: "Medical Emergency", size: "210 MB", installed: false },
  { icon: Camera, title: "Safari Guide", size: "180 MB", installed: false },
  { icon: Shield, title: "Ranger Operations", size: "75 MB", installed: false },
  { icon: Droplets, title: "Water & Fuel Intelligence", size: "40 MB", installed: false },
  { icon: Languages, title: "Translation Pack (EN/SW/FR/AR/HI/SO/Sudanese)", size: "30 MB", installed: true },
  { icon: MapIcon, title: "East Africa Offline Maps", size: "1.4 GB", installed: false },
];

function PacksPage() {
  return (
    <AppShell title="Knowledge Packs" subtitle="Download once. Use anywhere.">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Card className="border-primary/30 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
              <h2 className="text-base font-semibold">Storage used</h2>
              <p className="text-xs text-muted-foreground">2.1 GB of 8 GB allocated</p>
              <Progress value={26} className="mt-2 h-2" />
            </div>
            <Button className="gap-2">
              <Download className="h-4 w-4" /> Download all (recommended)
            </Button>
          </div>
        </Card>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((p) => (
            <Card key={p.title} className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{p.size}</div>
              </div>
              {p.installed ? (
                <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
                  <CheckCircle2 className="h-3 w-3" /> Installed
                </Badge>
              ) : (
                <Button size="sm" variant="outline" className="gap-1">
                  <Download className="h-3 w-3" /> Get
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}