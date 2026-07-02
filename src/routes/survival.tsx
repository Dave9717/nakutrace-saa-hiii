import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/feature-page";
import {
  Mountain,
  Compass,
  Thermometer,
  Droplets,
  Flame,
  Snowflake,
  PawPrint,
  HeartPulse,
  Battery,
} from "lucide-react";

export const Route = createFileRoute("/survival")({
  head: () => ({ meta: [{ title: "Survival Mode — NAKUTRACE SAI" }] }),
  component: () => (
    <FeaturePage
      title="Survival Mode"
      subtitle="Stay alive. Stay oriented."
      headline="Your remote-environment toolkit."
      intro="GPS, compass, altitude, battery and nearest safe points — paired with offline survival knowledge for any biome."
      icon={Mountain}
      features={[
        {
          icon: Compass,
          title: "Live telemetry",
          desc: "Coordinates, heading, altitude — readable in direct sunlight.",
        },
        {
          icon: Battery,
          title: "Power-aware",
          desc: "Survival-grade low-power mode and battery forecasting.",
        },
        {
          icon: Thermometer,
          title: "Heat safety",
          desc: "Hydration cadence, shade strategy, hyperthermia first aid.",
        },
        {
          icon: Droplets,
          title: "Flood safety",
          desc: "High-ground routing and flash-flood escape procedures.",
        },
        {
          icon: Flame,
          title: "Desert survival",
          desc: "Travel windows, water rationing, signaling and shelter.",
        },
        {
          icon: Snowflake,
          title: "Mountain",
          desc: "Altitude sickness, hypothermia and exposure response.",
        },
        {
          icon: PawPrint,
          title: "Wildlife",
          desc: "Behavior, avoidance and encounter response by species.",
        },
        {
          icon: HeartPulse,
          title: "First aid",
          desc: "Bleeding, burns, fractures, shock and CPR walkthroughs.",
        },
      ]}
    />
  ),
});
