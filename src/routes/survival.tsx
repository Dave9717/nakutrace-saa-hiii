import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/feature-page";
import { Mountain, Compass, Thermometer, Droplets, Flame, Snowflake, PawPrint, HeartPulse, Battery } from "lucide-react";

export const Route = createFileRoute("/survival")({
  head: () => ({
    meta: [
      { title: "Survival Mode — NAKUTRACE SAI" },
      { name: "description", content: "Compass, altitude, terrain and offline knowledge packs for remote survival scenarios." },
      { property: "og:title", content: "Survival Mode — NAKUTRACE SAI" },
      { property: "og:description", content: "Compass, altitude, terrain and offline knowledge packs for remote survival scenarios." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://savannah-guide-ai.lovable.app/survival" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Survival Mode — NAKUTRACE SAI" },
      { name: "twitter:description", content: "Compass, altitude, terrain and offline knowledge packs for remote survival scenarios." },
    ],
    links: [{ rel: "canonical", href: "https://savannah-guide-ai.lovable.app/survival" }],
  }),
  component: () => (
    <FeaturePage
      title="Survival Mode"
      subtitle="Stay alive. Stay oriented."
      headline="Your remote-environment toolkit."
      intro="GPS, compass, altitude, battery and nearest safe points — paired with offline survival knowledge for any biome."
      icon={Mountain}
      features={[
        { icon: Compass, title: "Live telemetry", desc: "Coordinates, heading, altitude — readable in direct sunlight." },
        { icon: Battery, title: "Power-aware", desc: "Survival-grade low-power mode and battery forecasting." },
        { icon: Thermometer, title: "Heat safety", desc: "Hydration cadence, shade strategy, hyperthermia first aid." },
        { icon: Droplets, title: "Flood safety", desc: "High-ground routing and flash-flood escape procedures." },
        { icon: Flame, title: "Desert survival", desc: "Travel windows, water rationing, signaling and shelter." },
        { icon: Snowflake, title: "Mountain", desc: "Altitude sickness, hypothermia and exposure response." },
        { icon: PawPrint, title: "Wildlife", desc: "Behavior, avoidance and encounter response by species." },
        { icon: HeartPulse, title: "First aid", desc: "Bleeding, burns, fractures, shock and CPR walkthroughs." },
      ]}
    />
  ),
});