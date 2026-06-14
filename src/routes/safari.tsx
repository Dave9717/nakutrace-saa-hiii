import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/feature-page";
import { Camera, Bird, MountainSnow, Tent, Sparkles, PawPrint } from "lucide-react";

export const Route = createFileRoute("/safari")({
  head: () => ({ meta: [{ title: "Safari Explorer — NAKUTRACE SAI" }] }),
  component: () => (
    <FeaturePage
      title="Safari Explorer"
      subtitle="Wildlife, migration, and the perfect shot"
      headline="Explore the wild — responsibly."
      intro="Wildlife sightings, migration routes, scenic points and photography spots, all map-aware and shareable with the community."
      icon={Camera}
      features={[
        { icon: PawPrint, title: "Sightings", desc: "Elephants, lions, leopards, buffalo, rhinos, zebras, giraffes, cheetahs." },
        { icon: Bird, title: "Migration routes", desc: "Seasonal corridors and crossing forecasts." },
        { icon: MountainSnow, title: "Scenic points", desc: "Lookouts, ridgelines and golden-hour viewpoints." },
        { icon: Tent, title: "Campsites", desc: "Vetted spots with water, ranger proximity and access notes." },
        { icon: Sparkles, title: "Photography", desc: "Best-light timing, ethical distance reminders and angle tips." },
      ]}
    />
  ),
});