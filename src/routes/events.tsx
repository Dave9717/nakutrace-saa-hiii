import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/feature-page";
import { Calendar, Tent, Trophy, Leaf, Users, Camera } from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Events — NAKUTRACE SAI" }] }),
  component: () => (
    <FeaturePage
      title="Events"
      subtitle="Map-based discovery"
      headline="Marathons, festivals, camps and conservation."
      intro="Find map-anchored events — from the Lewa Marathon to community gatherings and conservation drives."
      icon={Calendar}
      features={[
        { icon: Trophy, title: "Marathons", desc: "Race routes, hydration points and spectator zones." },
        { icon: Camera, title: "Festivals", desc: "Cultural events with travel and safety notes." },
        { icon: Leaf, title: "Conservation", desc: "Clean-ups, anti-poaching support and tree drives." },
        { icon: Users, title: "Community", desc: "Gatherings, markets and local meetups." },
        { icon: Tent, title: "Camping", desc: "Group camps with shared logistics." },
      ]}
    />
  ),
});