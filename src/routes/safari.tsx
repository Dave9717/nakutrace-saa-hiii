import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Bird,
  MountainSnow,
  Tent,
  Sparkles,
  PawPrint,
  Trees,
  Waves,
  Landmark,
} from "lucide-react";

const experiences = [
  {
    title: "Wildlife migration sites",
    description:
      "Seasonal river crossings, plains crossings, and predator-prey hotspots for responsible viewing.",
    icon: PawPrint,
  },
  {
    title: "National parks and reserves",
    description:
      "Protected areas with ranger updates, access notes, and best-season recommendations.",
    icon: Bird,
  },
  {
    title: "Scenic viewpoints",
    description: "Golden-hour lookouts, ridgelines, and photography platforms with safety notes.",
    icon: MountainSnow,
  },
  {
    title: "Campsites and conservation areas",
    description: "Well-positioned camps, water access, and low-impact camping guidance.",
    icon: Tent,
  },
  {
    title: "Rivers, waterfalls and forests",
    description: "River crossings, misty forest paths, seasonal water levels, and safe access.",
    icon: Waves,
  },
  {
    title: "Historical and cultural destinations",
    description:
      "Community heritage sites, cultural stops, and nearby attractions with respectful guidance.",
    icon: Landmark,
  },
];

export const Route = createFileRoute("/safari")({
  head: () => ({ meta: [{ title: "Safari Explorer — NAKUTRACE SAI" }] }),
  component: SafariPage,
});

function SafariPage() {
  return (
    <AppShell title="Safari Explorer" subtitle="Premium wildlife and landscape discovery">
      <section className="border-b border-border bg-gradient-to-br from-emerald-950/70 to-background p-6 md:p-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Camera className="h-3 w-3" /> Rich media explorer
            </Badge>
            <Badge variant="secondary">Offline-ready media cache</Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Explore Africa’s wild places with immersive maps, galleries, and safety-first guidance.
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
            Discover migration corridors, parks, campsites, forests, rivers, waterfalls, and
            cultural landmarks with curated imagery, route notes, and best-season tips.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((experience) => (
            <Card key={experience.title} className="p-5">
              <div className="flex items-center gap-2">
                <experience.icon className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">{experience.title}</h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{experience.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Curated media • map pins • safety info
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Trees className="h-4 w-4 text-primary" /> Featured explorer highlights
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              [
                "Mara river crossings",
                "Best during the migration season with early-morning sightings.",
              ],
              [
                "Samburu conservancies",
                "Cultural visits, scenic outlooks, and responsible safari routes.",
              ],
              [
                "Mt. Kenya forest trails",
                "Cool forests, waterfalls, and low-light photography routes.",
              ],
            ].map(([title, desc]) => (
              <div key={title} className="glass-surface p-3">
                <div className="font-medium">{title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
