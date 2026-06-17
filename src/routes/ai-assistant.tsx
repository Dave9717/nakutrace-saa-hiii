import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Cloud, Loader2 } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askAssistant } from "@/lib/ai.functions";
import { toast } from "sonner";
import { AI_DISCLAIMER } from "@/lib/utils";

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
  const ask = useServerFn(askAssistant);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "I'm ready. I'll route around hazards, talk you through emergencies, and keep you pointed at the nearest safe point. What's happening?",
    },
  ]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next = [...messages, { role: "user" as const, content: text.trim() }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const { reply, error } = await ask({ data: { messages: next } });
      if (error) toast.error(reply);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      toast.error("AI request failed — check connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="Field AI Assistant"
      subtitle="Powered by Lovable AI · cached knowledge fallback"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 md:px-8">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Ask the field assistant</h2>
            <Badge variant="outline" className="ml-auto gap-1">
              <Cloud className="h-3 w-3" /> Live
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Survival, navigation, vehicle recovery, first aid, tourism — answered from your
            downloaded packs.
          </p>

          <div className="mt-5 space-y-3">
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    "rounded-lg border p-4 " +
                    (m.role === "assistant"
                      ? "border-border bg-card/40"
                      : "border-primary/30 bg-primary/5")
                  }
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {m.role === "assistant" ? "Assistant" : "You"}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{m.content}</p>
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  className="h-auto whitespace-normal text-left text-xs"
                  onClick={() => send(s)}
                  disabled={busy}
                >
                  {s}
                </Button>
              ))}
            </div>

            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <Input
                placeholder="Type a question…"
                className="flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={busy}
              />
              <Button type="submit" className="gap-2" disabled={busy || !input.trim()}>
                <Send className="h-4 w-4" /> Send
              </Button>
            </form>
          </div>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5 p-4">
          <p className="text-xs text-muted-foreground">{AI_DISCLAIMER}</p>
        </Card>
      </div>
    </AppShell>
  );
}
