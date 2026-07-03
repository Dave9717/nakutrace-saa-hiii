import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import lion from "@/assets/animals/lion.jpg";
import elephant from "@/assets/animals/elephant.jpg";
import leopard from "@/assets/animals/leopard.jpg";
import giraffe from "@/assets/animals/giraffe.jpg";
import rhino from "@/assets/animals/rhino.jpg";
import cheetah from "@/assets/animals/cheetah.jpg";

export const Route = createFileRoute("/safari")({
  head: () => ({
    meta: [
      { title: "Safari Explorer — NAKUTRACE SAI" },
      { name: "description", content: "Wildlife sightings, habitats, migration corridors and conservation facts for African safaris." },
      { property: "og:title", content: "Safari Explorer — NAKUTRACE SAI" },
      { property: "og:description", content: "Wildlife sightings, habitats, migration corridors and conservation facts for African safaris." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://savannah-guide-ai.lovable.app/safari" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Safari Explorer — NAKUTRACE SAI" },
      { name: "twitter:description", content: "Wildlife sightings, habitats, migration corridors and conservation facts for African safaris." },
    ],
    links: [{ rel: "canonical", href: "https://savannah-guide-ai.lovable.app/safari" }],
  }),
  component: SafariPage,
});

type Animal = {
  name: string;
  image: string;
  habitat: string;
  status: "Vulnerable" | "Endangered" | "Least Concern" | "Near Threatened";
  tagline: string;
  facts: string[];
};

const animals: Animal[] = [
  {
    name: "Lion",
    image: lion,
    habitat: "Savannah · Grassland",
    status: "Vulnerable",
    tagline: "The pride king of the plains.",
    facts: [
      "Roars can travel up to 8 km across savannah.",
      "Females do around 90% of the pride's hunting.",
      "Prides average 10–15 members with shared territory.",
    ],
  },
  {
    name: "African Elephant",
    image: elephant,
    habitat: "Savannah · Woodland · Wetlands",
    status: "Endangered",
    tagline: "The world's largest land mammal.",
    facts: [
      "Drinks up to 190 L of water per day.",
      "Communicates in low-frequency rumbles across kilometers.",
      "Matriarch-led herds remember watering holes for decades.",
    ],
  },
  {
    name: "Leopard",
    image: leopard,
    habitat: "Forest · Rocky outcrops",
    status: "Vulnerable",
    tagline: "The silent, solitary climber.",
    facts: [
      "Hauls prey twice its weight into trees.",
      "Rosette patterns are unique — a fingerprint.",
      "Mostly nocturnal, using stealth over speed.",
    ],
  },
  {
    name: "Giraffe",
    image: giraffe,
    habitat: "Savannah · Open woodland",
    status: "Vulnerable",
    tagline: "Tallest living animal on Earth.",
    facts: [
      "Heart weighs ~11 kg to pump blood 2 m upward.",
      "Tongue is ~45 cm long and prehensile.",
      "Sleeps only about 30 minutes a day in the wild.",
    ],
  },
  {
    name: "Black Rhino",
    image: rhino,
    habitat: "Bushland · Semi-desert",
    status: "Endangered",
    tagline: "Armored, prehistoric browser.",
    facts: [
      "Uses a hooked upper lip to strip leaves.",
      "Poor eyesight, but excellent hearing and smell.",
      "Charges at up to 55 km/h — give wide berth.",
    ],
  },
  {
    name: "Cheetah",
    image: cheetah,
    habitat: "Open savannah",
    status: "Vulnerable",
    tagline: "Fastest land animal on the planet.",
    facts: [
      "0–100 km/h in about 3 seconds.",
      "Uses non-retractable claws for grip like sprint spikes.",
      "Hunts by day to avoid larger nocturnal predators.",
    ],
  },
];

const statusColor: Record<Animal["status"], string> = {
  Endangered: "bg-destructive/20 text-destructive border-destructive/40",
  Vulnerable: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  "Near Threatened": "bg-orange-500/15 text-orange-300 border-orange-500/40",
  "Least Concern": "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
};

function SafariPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <AppShell title="Safari Explorer" subtitle="Wildlife, migration, and the perfect shot">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="glass-strong rounded-3xl p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-secondary">
            <Sparkles className="h-3 w-3" /> Safari Explorer
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
            Meet the wild — up close.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Field-verified profiles, habitats and ethical viewing tips. Tap a card to expand facts
            and add sightings to your community feed.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {animals.map((a, i) => {
            const open = expanded === a.name;
            return (
              <motion.article
                key={a.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card group overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur ${statusColor[a.status]}`}
                    >
                      <ShieldCheck className="mr-1 inline h-3 w-3" />
                      {a.status}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-display text-xl font-bold leading-tight text-white drop-shadow">
                      {a.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/85">{a.tagline}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {a.habitat}
                  </div>
                  <button
                    onClick={() => setExpanded(open ? null : a.name)}
                    aria-expanded={open}
                    className="mt-3 inline-flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs font-medium transition hover:border-primary/60 hover:bg-primary/10"
                  >
                    {open ? "Hide facts" : "Field facts"}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <motion.ul
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden text-sm text-muted-foreground"
                  >
                    <div className="space-y-2 pt-3">
                      {a.facts.map((f) => (
                        <li key={f} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </div>
                  </motion.ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}