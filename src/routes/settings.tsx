import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NAKUTRACE SAI" },
      { name: "description", content: "Manage your NAKUTRACE SAI profile, call sign, notifications and offline preferences." },
      { property: "og:title", content: "Settings — NAKUTRACE SAI" },
      { property: "og:description", content: "Manage your NAKUTRACE SAI profile, call sign, notifications and offline preferences." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://savannah-guide-ai.lovable.app/settings" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Settings — NAKUTRACE SAI" },
      { name: "twitter:description", content: "Manage your NAKUTRACE SAI profile, call sign, notifications and offline preferences." },
    ],
    links: [{ rel: "canonical", href: "https://savannah-guide-ai.lovable.app/settings" }],
  }),
  component: SettingsPage,
});

const toggles = [
  ["Survival low-power mode", "Reduces refresh rates and screen brightness ceiling."],
  ["Mesh relay (Bluetooth + WiFi Direct)", "Allow your device to relay peer messages."],
  ["Auto check-in escalation", "Notify guardians when scheduled check-ins are missed."],
  ["Share anonymous community data", "Help others by sharing fuel, water and hazard reports."],
  ["End-to-end encrypted messaging", "Required for SOS and guardian channels."],
];

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Privacy, power and connectivity">
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-8">
        {toggles.map(([title, desc], i) => (
          <Card key={title} className="flex items-center justify-between gap-4 p-4">
            <div>
              <Label className="text-sm font-semibold">{title}</Label>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </div>
            <Switch defaultChecked={i !== 3} />
          </Card>
        ))}
      </div>
    </AppShell>
  );
}