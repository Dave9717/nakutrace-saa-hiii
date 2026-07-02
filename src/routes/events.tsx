import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tent, Trophy, Leaf, Users, Camera, MapPin, Clock3 } from "lucide-react";

const events = [
  {
    title: "Safaricom Lewa Marathon",
    type: "Upcoming",
    location: "Lewa Wildlife Conservancy",
    description:
      "A high-profile marathon with hydration points, crowd-control routes, and conservation partnerships.",
  },
  {
    title: "Wildlife Conservation Day",
    type: "Ongoing",
    location: "Samburu County",
    description: "Community-led conservation, education, and anti-poaching volunteer activities.",
  },
  {
    title: "Safari Photography Exhibition",
    type: "Recent",
    location: "Nairobi",
    description: "A showcase of wildlife photography, local guides, and field safety workshops.",
  },
];

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Events — NAKUTRACE SAI" }] }),
  component: EventsPage,
});

function EventsPage() {
  const categories = [
    { icon: Trophy, label: "Marathons" },
    { icon: Camera, label: "Exhibitions" },
    { icon: Leaf, label: "Conservation" },
    { icon: Users, label: "Community" },
    { icon: Tent, label: "Camping" },
  ];

  return (
    <AppShell title="Events" subtitle="Dynamic tourism and conservation discovery">
      <section className="border-b border-border bg-card/40 p-6 md:p-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" /> Live event discovery
            </Badge>
            <Badge variant="secondary">Map-ready • gallery-ready • schedule-ready</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Upcoming, ongoing, and recent events across the wild.
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Discover tourism, wildlife, conservation, outdoor, and travel events with locations,
            maps, and short schedules that can be refreshed from public sources when available.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <Card key={event.title} className="p-5">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant={
                    event.type === "Upcoming"
                      ? "default"
                      : event.type === "Ongoing"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {event.type}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" /> 09:00
                </div>
              </div>
              <h2 className="mt-3 font-semibold">{event.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> {event.location}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Trophy className="h-4 w-4 text-primary" /> Event categories
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map(({ icon: Icon, label }) => (
                <Badge key={label} variant="outline" className="gap-1">
                  <Icon className="h-3 w-3" /> {label}
                </Badge>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4 text-primary" /> Discovery note
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Public tourism and conservation sources can be linked here to refresh event listings
              automatically when network access is available.
            </p>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
