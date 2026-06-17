import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Compass,
  ShieldAlert,
  Users,
  Mountain,
  Map as MapIcon,
  Sparkles,
  Camera,
  Heart,
  Download,
  WifiOff,
  Navigation as NavIcon,
} from "lucide-react";
import { AI_DISCLAIMER } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NAKUTRACE SAI — Navigate. Survive. Explore." },
      {
        name: "description",
        content:
          "Africa-first offline navigation, survival, emergency response, convoy coordination, and safari intelligence — built for remote environments.",
      },
      { property: "og:title", content: "NAKUTRACE SAI" },
      {
        property: "og:description",
        content: "Navigate. Survive. Explore. Offline-first survival navigation for Africa.",
      },
    ],
  }),
  component: Index,
});

const modes = [
  {
    to: "/map",
    icon: MapIcon,
    title: "Offline Maps",
    desc: "Vector tiles, GPS routing, terrain awareness.",
  },
  {
    to: "/expedition",
    icon: Compass,
    title: "Expedition Mode",
    desc: "Unified nav, survival, convoy & SOS.",
  },
  {
    to: "/convoy",
    icon: Users,
    title: "Convoy",
    desc: "Live tracking, separation alerts, group SOS.",
  },
  {
    to: "/sos",
    icon: ShieldAlert,
    title: "SOS & Rescue",
    desc: "Mesh-broadcast emergencies, evidence vault.",
  },
  {
    to: "/survival",
    icon: Mountain,
    title: "Survival Mode",
    desc: "Compass, altitude, offline survival knowledge.",
  },
  {
    to: "/safari",
    icon: Camera,
    title: "Safari Explorer",
    desc: "Wildlife sightings, scenic points, migration.",
  },
  {
    to: "/guardian",
    icon: Heart,
    title: "Guardian Mode",
    desc: "Trusted contacts get check-ins & alerts.",
  },
  {
    to: "/ai-assistant",
    icon: Sparkles,
    title: "Offline AI",
    desc: "On-device survival & navigation guidance.",
  },
];

function Index() {
  return (
    <AppShell title="NAKUTRACE SAI" subtitle="Navigate. Survive. Explore.">
      <section
        className="relative overflow-hidden border-b border-border"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            <WifiOff className="h-3 w-3" /> Offline-first · Africa-built
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Navigate. Survive. <span className="text-primary">Explore.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            The most advanced offline navigation, survival, emergency response, convoy and safari
            intelligence platform — engineered for deserts, parks, mountains and zero-signal zones.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/expedition">
                <NavIcon className="h-4 w-4" /> Launch Expedition
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/knowledge-packs">
                <Download className="h-4 w-4" /> Download Knowledge Packs
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="destructive"
              className="gap-2"
              style={{ boxShadow: "var(--shadow-gold)" }}
            >
              <Link to="/sos">
                <ShieldAlert className="h-4 w-4" /> SOS
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["10", "Countries covered"],
              ["8+", "Knowledge packs"],
              ["100%", "Works offline"],
              ["1-tap", "Return to safety"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-lg border border-border bg-card/60 p-4 backdrop-blur">
                <div className="text-2xl font-bold text-primary">{v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Field modes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          One platform — every survival and navigation surface you need in the wild.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((m) => (
            <Link key={m.to} to={m.to} className="group">
              <Card className="h-full border-border bg-card p-5 transition-all hover:border-primary/60 hover:bg-card/80">
                <m.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                <div className="mt-4 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open →
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Card className="border-primary/30 bg-card/60 p-6 md:p-8">
            <h3 className="text-lg font-semibold">Download once. Stay prepared.</h3>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              You are downloading a one-time survival and navigation system designed for remote
              travel. Once installed, it works without internet — maps, survival tools, AI
              assistant, emergency systems, and safety intelligence remain available even in the
              most remote areas.
            </p>
            <p className="mt-3 max-w-3xl text-xs italic text-muted-foreground">{AI_DISCLAIMER}</p>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
