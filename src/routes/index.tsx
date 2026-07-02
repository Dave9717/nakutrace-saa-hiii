import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
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
  Search,
} from "lucide-react";
import heroImg from "@/assets/hero-savannah.jpg";

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
  { to: "/map", icon: MapIcon, title: "Offline Maps", desc: "Vector tiles, GPS routing, terrain awareness.", tint: "from-emerald-500/25 to-emerald-500/0" },
  { to: "/safari", icon: Camera, title: "Safari Explorer", desc: "Wildlife sightings, migration & scenic points.", tint: "from-amber-400/30 to-amber-400/0" },
  { to: "/expedition", icon: Compass, title: "Expedition", desc: "Unified nav, survival, convoy & SOS.", tint: "from-orange-500/25 to-orange-500/0" },
  { to: "/convoy", icon: Users, title: "Convoy", desc: "Live tracking, separation alerts, group SOS.", tint: "from-cyan-500/25 to-cyan-500/0" },
  { to: "/sos", icon: ShieldAlert, title: "SOS & Rescue", desc: "Mesh-broadcast emergencies, evidence vault.", tint: "from-red-500/30 to-red-500/0" },
  { to: "/survival", icon: Mountain, title: "Survival", desc: "Compass, altitude, offline knowledge packs.", tint: "from-lime-500/25 to-lime-500/0" },
  { to: "/guardian", icon: Heart, title: "Guardian", desc: "Trusted contacts, live check-ins & alerts.", tint: "from-pink-500/25 to-pink-500/0" },
  { to: "/ai-assistant", icon: Sparkles, title: "Field AI", desc: "Survival & navigation guidance, on demand.", tint: "from-violet-500/30 to-violet-500/0" },
];

function Index() {
  return (
    <AppShell title="NAKUTRACE SAI" subtitle="Navigate. Survive. Explore.">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt=""
            width={1920}
            height={1088}
            className="ken-burns h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero)", mixBlendMode: "soft-light" }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:pb-24 md:pt-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary backdrop-blur">
            <WifiOff className="h-3 w-3" /> Offline-first · Africa-built
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Navigate. Survive.{" "}
            <span className="bg-gradient-to-r from-[oklch(0.78_0.14_82)] to-[oklch(0.68_0.18_55)] bg-clip-text text-transparent">
              Explore.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            The most advanced offline navigation, survival, emergency response, convoy and safari
            intelligence platform — engineered for deserts, parks, mountains and zero-signal zones.
          </p>

          {/* Glass search */}
          <div className="glass-strong mt-8 flex max-w-2xl items-center gap-2 rounded-full p-1.5 pl-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              type="search"
              placeholder="Search parks, animals, routes, packs…"
              aria-label="Search NAKUTRACE"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button size="sm" className="rounded-full">
              Search
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/expedition">
                <NavIcon className="h-4 w-4" /> Launch Expedition
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 backdrop-blur">
              <Link to="/knowledge-packs">
                <Download className="h-4 w-4" /> Knowledge Packs
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["10", "Countries"],
              ["8+", "Knowledge packs"],
              ["100%", "Works offline"],
              ["1-tap", "Return to safety"],
            ].map(([v, l]) => (
              <div key={l} className="glass rounded-2xl p-4">
                <div className="font-display text-2xl font-bold text-primary">{v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Field modes
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every survival and navigation surface you need in the wild.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((m) => (
            <Link key={m.to} to={m.to} className="group focus:outline-none">
              <div className="glass-card relative h-full overflow-hidden p-5 focus-visible:ring-2 focus-visible:ring-primary">
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${m.tint} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25 transition group-hover:scale-110">
                    <m.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{m.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                  <div className="mt-4 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="glass-strong rounded-3xl p-6 md:p-8">
          <h3 className="font-display text-lg font-semibold">Download once. Stay prepared.</h3>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            A one-time survival and navigation system designed for remote travel. Once installed,
            maps, survival tools, AI assistant, emergency systems, and safety intelligence remain
            available even in the most remote areas.
          </p>
          <p className="mt-3 max-w-3xl text-xs italic text-muted-foreground">
            AI guidance is informational only and must not replace professional emergency, rescue,
            navigation, medical, or security services.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
