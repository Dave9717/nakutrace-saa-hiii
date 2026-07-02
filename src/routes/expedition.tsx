import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/feature-page";
import {
  Compass,
  Navigation,
  Mountain,
  Users,
  ShieldAlert,
  CloudSun,
  Fuel,
  Sparkles,
  Radio,
} from "lucide-react";

export const Route = createFileRoute("/expedition")({
  head: () => ({ meta: [{ title: "Expedition Mode — NAKUTRACE SAI" }] }),
  component: () => (
    <FeaturePage
      title="Expedition Mode"
      subtitle="Unified field operations"
      headline="Everything you need, in one mode."
      intro="A single combined mode fusing navigation, survival, convoy, SOS, weather, fuel & water intelligence, AI assistant, and ranger/extraction layers."
      icon={Compass}
      features={[
        {
          icon: Navigation,
          title: "Navigation",
          desc: "Multi-modal offline routing with terrain, fuel and water-aware ETA.",
        },
        {
          icon: Mountain,
          title: "Survival overlay",
          desc: "Compass, altitude, battery and nearest safety points always visible.",
        },
        {
          icon: Users,
          title: "Convoy sync",
          desc: "Live group positions, separation alerts, rendezvous waypoints.",
        },
        {
          icon: ShieldAlert,
          title: "SOS chain",
          desc: "One-tap broadcast to convoy, guardians and mesh peers.",
        },
        {
          icon: CloudSun,
          title: "Weather cache",
          desc: "Forecasts, flood and storm risk cached for the next 72h.",
        },
        {
          icon: Fuel,
          title: "Fuel & water",
          desc: "Crowd-sourced station status and reliable water sources on-route.",
        },
        {
          icon: Sparkles,
          title: "AI co-pilot",
          desc: "Offline survival, navigation and recovery guidance on demand.",
        },
        {
          icon: Radio,
          title: "Ranger layers",
          desc: "Ranger posts, park gates, airstrips and extraction zones.",
        },
      ]}
    />
  ),
});
