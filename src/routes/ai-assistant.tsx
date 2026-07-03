import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Cloud, Loader2, RotateCcw, User2, Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askAssistant } from "@/lib/ai.functions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "Offline AI Assistant — NAKUTRACE SAI" },
      { name: "description", content: "Field-ready AI guidance for survival, navigation and safari questions — works with graceful offline fallbacks." },
      { property: "og:title", content: "Offline AI Assistant — NAKUTRACE SAI" },
      { property: "og:description", content: "Field-ready AI guidance for survival, navigation and safari questions — works with graceful offline fallbacks." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://savannah-guide-ai.lovable.app/ai-assistant" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Offline AI Assistant — NAKUTRACE SAI" },
      { name: "twitter:description", content: "Field-ready AI guidance for survival, navigation and safari questions — works with graceful offline fallbacks." },
    ],
    links: [{ rel: "canonical", href: "https://savannah-guide-ai.lovable.app/ai-assistant" }],
  }),
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
  const [lastError, setLastError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "I'm ready. I'll route around hazards, talk you through emergencies, and keep you pointed at the nearest safe point. What's happening?",
    },
  ]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next = [...messages, { role: "user" as const, content: text.trim() }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setLastError(null);
    try {
      const { reply, error } = await ask({ data: { messages: next } });
      if (error) {
        setLastError(error);
        toast.warning("AI degraded — showing offline guidance.");
      }
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setLastError("network");
      toast.error("AI request failed — check your connection.");
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "I couldn't reach the network. Try again in a moment — your last known safe point is still saved on-device.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function retry() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages(messages.slice(0, -1));
    await send(lastUser.content);
  }

  return (
    <AppShell title="Field AI Assistant" subtitle="Powered by Lovable AI · cached knowledge fallback">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 md:px-8">
        <div className="glass-strong rounded-3xl p-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold leading-tight">
                Ask the field assistant
              </h2>
              <p className="text-xs text-muted-foreground">
                Survival · navigation · recovery · first aid
              </p>
            </div>
            <Badge
              variant="outline"
              className={`ml-auto gap-1 ${lastError ? "border-amber-500/50 text-amber-300" : "border-primary/50 text-primary"}`}
            >
              <Cloud className="h-3 w-3" /> {lastError ? "Degraded" : "Live"}
            </Badge>
          </div>

          <div
            ref={scrollRef}
            className="mt-5 max-h-[52vh] min-h-[220px] space-y-3 overflow-y-auto pr-1"
            aria-live="polite"
          >
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={
                    "flex gap-3 " + (m.role === "assistant" ? "" : "flex-row-reverse")
                  }
                >
                  <div
                    className={
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 " +
                      (m.role === "assistant"
                        ? "bg-primary/15 text-primary ring-primary/30"
                        : "bg-secondary/20 text-secondary ring-secondary/30")
                    }
                    aria-hidden
                  >
                    {m.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User2 className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm " +
                      (m.role === "assistant"
                        ? "glass rounded-tl-sm"
                        : "rounded-tr-sm border border-primary/30 bg-primary/10")
                    }
                  >
                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ol:my-2 prose-ul:my-2">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {busy && (
              <div className="flex items-center gap-2 pl-11 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={busy}
                className="rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs transition hover:border-primary/60 hover:bg-primary/10 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="mt-4 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="glass flex flex-1 items-center gap-2 rounded-full px-4">
              <input
                type="text"
                placeholder="Type a question…"
                aria-label="Ask the assistant"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={busy}
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            {lastError && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={retry}
                aria-label="Retry last question"
                disabled={busy}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="submit"
              className="gap-2 rounded-full"
              disabled={busy || !input.trim()}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>

        <div className="glass rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-xs text-muted-foreground">
            AI guidance is informational only and must not replace professional emergency, rescue,
            navigation, medical, or security services.
          </p>
        </div>
      </div>
    </AppShell>
  );
}