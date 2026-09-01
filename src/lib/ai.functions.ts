import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1).max(4000),
    }),
  ).min(1).max(20),
});

const SYSTEM = `You are the NAKUTRACE SAI field assistant — an offline-first survival, navigation, safari and emergency guide for Africa and remote environments. Be calm, concise, practical. Give numbered steps in emergencies. Always remind users that AI is informational and never replaces professional emergency services. Use kilometers, litres, Celsius.`;

const OFFLINE_FALLBACK = `I can't reach the AI gateway right now, so here's a safe general playbook:

1. **Stop and stabilise.** Get to safe ground, check people first, vehicle second.
2. **Pin your location.** Open the Map tab and tap "Locate me" — the app stores your last known safe point for 142 hours.
3. **Signal.** If you have any signal, trigger SOS from the red button in the top bar.
4. **Ration.** Water first (3L / person / day in heat), then shade, then food.
5. **Wait or walk.** In vehicles, staying put is almost always safer than walking away.

Try again in a moment for tailored guidance. This message is informational only and does not replace professional emergency services.`;

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => Schema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { reply: OFFLINE_FALLBACK, error: "no_key" as const };
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "system", content: SYSTEM }, ...data.messages],
        }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (res.status === 429)
        return {
          reply: "Rate limit reached — please try again in a moment.",
          error: "rate_limit" as const,
        };
      if (res.status === 402)
        return {
          reply: "AI credits exhausted. Please top up Lovable AI to continue.",
          error: "credits" as const,
        };
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("AI gateway error", res.status, text);
        return { reply: OFFLINE_FALLBACK, error: "gateway" as const };
      }
      const json = await res.json();
      const reply: string =
        json?.choices?.[0]?.message?.content?.trim() ||
        "I didn't get a response — try rephrasing your question.";
      return { reply, error: null };
    } catch (e) {
      console.error("AI request failed", e);
      return { reply: OFFLINE_FALLBACK, error: "network" as const };
    }
  });