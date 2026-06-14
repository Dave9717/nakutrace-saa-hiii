import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, WifiOff } from "lucide-react";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [{ title: "Offline AI Assistant — NAKUTRACE SAI" }] }),
  component: AIPage,
});

const suggestions = [
  "I'm out of fuel 40km from the nearest town — what do I do?",
  "How do I treat a suspected snakebite in the bush?",
  "Recover a Land Cruiser stuck in deep sand.",
  "Wildlife encounter — lion at 80m. How do I respond?",
];

function AIPage() {
  return (
    <AppShell title="Offline AI Assistant" subtitle="Hybrid: local model + cached knowledge">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 md:px-8">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Ask the field assistant</h2>
            <Badge variant="outline" className="ml-auto gap-1">
              <WifiOff className="h-3 w-3" /> Offline
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Survival, navigation, vehicle recovery, first aid, tourism — answered from your
            downloaded packs.
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-lg border border-border bg-card/40 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Assistant
              </div>
              <p className="mt-1 text-sm">
                I'm ready. I'll route around hazards, talk you through emergencies, and keep you
                pointed at the nearest safe point. What's happening?
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Button key={s} variant="outline" size="sm" className="h-auto whitespace-normal text-left text-xs">
                  {s}
                </Button>
              ))}
            </div>

            <form className="flex gap-2">
              <Input placeholder="Type a question…" className="flex-1" />
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" /> Send
              </Button>
            </form>
          </div>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5 p-4">
          <p className="text-xs text-muted-foreground">
            AI guidance is informational only and must not replace professional emergency, rescue,
            navigation, medical, or security services.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}