import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/feature-page";
import { Heart, BellRing, MapPin, Clock, ShieldAlert, UserCheck } from "lucide-react";

export const Route = createFileRoute("/guardian")({
  head: () => ({ meta: [{ title: "Guardian Mode — NAKUTRACE SAI" }] }),
  component: () => (
    <FeaturePage
      title="Guardian Mode"
      subtitle="Your trusted circle, always informed"
      headline="Someone always knows where you are."
      intro="Scheduled check-ins, location updates and SOS alerts auto-relayed to your guardians."
      icon={Heart}
      features={[
        { icon: UserCheck, title: "Trusted contacts", desc: "Family, ops desk or partner team — up to 8 guardians." },
        { icon: MapPin, title: "Location updates", desc: "Configurable cadence with privacy windows." },
        { icon: Clock, title: "Smart check-ins", desc: "'Are you lost?' prompts escalate automatically if missed." },
        { icon: BellRing, title: "Auto-escalation", desc: "Missed check-ins trigger a tiered alert chain." },
        { icon: ShieldAlert, title: "Emergency notify", desc: "SOS reaches every guardian within seconds." },
      ]}
    />
  ),
});