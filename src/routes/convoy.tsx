import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/feature-page";
import { Users, QrCode, MapPin, AlertTriangle, RadioTower, Flag, CarFront, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/convoy")({
  head: () => ({ meta: [{ title: "Convoy Mode — NAKUTRACE SAI" }] }),
  component: () => (
    <FeaturePage
      title="Convoy"
      subtitle="Group coordination for safaris, NGOs and fleets"
      headline="Move together. Stay together."
      intro="Create or join convoys with offline sync, live GPS, separation alerts and group SOS broadcast."
      icon={Users}
      features={[
        { icon: QrCode, title: "Create / join", desc: "Spin up a convoy and share a QR or 6-digit code with the team." },
        { icon: MapPin, title: "Live tracking", desc: "Offline-capable peer positions over Bluetooth mesh & WiFi Direct." },
        { icon: AlertTriangle, title: "Separation alerts", desc: "Auto-warn when a vehicle drops out of formation or stops." },
        { icon: CarFront, title: "Stopped vehicle", desc: "Detect prolonged stops and prompt a check-in." },
        { icon: ShieldAlert, title: "Convoy SOS", desc: "Broadcast an emergency to every member instantly." },
        { icon: Flag, title: "Rendezvous", desc: "Drop emergency rendezvous waypoints anyone can route to." },
        { icon: RadioTower, title: "Offline relay", desc: "Messages hop peer-to-peer until any node reaches network." },
      ]}
    />
  ),
});