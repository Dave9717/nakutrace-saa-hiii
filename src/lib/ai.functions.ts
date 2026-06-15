import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1).max(4000),
    }),
  ).min(1).max(20),
});

const SYSTEM = `You are the NAKUTRACE SAI field assistant — an offline-first survival, navigation, safari and emergency guide for Africa and remote environments. Be calm, concise, practical. Give numbered steps in emergencies. Always remind users that AI is informational and never replaces professional emergency services. Use kilometers, litres, Celsius.`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input) => Schema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway not configured");
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
    });
    if (res.status === 429) return { reply: "Rate limit reached — try again shortly.", error: "rate_limit" as const };
    if (res.status === 402) return { reply: "AI credits exhausted. Please top up Lovable AI.", error: "credits" as const };
    if (!res.ok) {
      const text = await res.text();
      console.error("AI gateway error", res.status, text);
      throw new Error("AI gateway failed");
    }
    const json = await res.json();
    const reply: string = json?.choices?.[0]?.message?.content ?? "(no response)";
    return { reply, error: null };
  });