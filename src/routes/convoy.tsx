import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, LogIn, Send, LogOut, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/convoy")({
  head: () => ({
    meta: [
      { title: "Convoy Mode — NAKUTRACE SAI" },
      { name: "description", content: "Live convoy tracking, separation alerts, group SOS and encrypted mesh chat." },
      { property: "og:title", content: "Convoy Mode — NAKUTRACE SAI" },
      { property: "og:description", content: "Live convoy tracking, separation alerts, group SOS and encrypted mesh chat." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://savannah-guide-ai.lovable.app/convoy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Convoy Mode — NAKUTRACE SAI" },
      { name: "twitter:description", content: "Live convoy tracking, separation alerts, group SOS and encrypted mesh chat." },
    ],
    links: [{ rel: "canonical", href: "https://savannah-guide-ai.lovable.app/convoy" }],
  }),
  component: ConvoyPage,
});

type Convoy = { id: string; name: string; region: string | null; status: string; join_code: string; owner_id: string };
type Message = { id: string; convoy_id: string; user_id: string; body: string; created_at: string };

function ConvoyPage() {
  const { user, loading } = useAuth();
  const [convoys, setConvoys] = useState<Convoy[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<{ user_id: string; role: string; display_name: string | null; call_sign: string | null }[]>([]);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [code, setCode] = useState("");
  const [body, setBody] = useState("");

  async function refreshConvoys() {
    if (!user) return;
    const { data: mem } = await supabase.from("convoy_members").select("convoy_id").eq("user_id", user.id);
    const ids = (mem ?? []).map((m) => m.convoy_id);
    if (ids.length === 0) {
      setConvoys([]);
      return;
    }
    const { data } = await supabase.from("convoys").select("*").in("id", ids).order("created_at", { ascending: false });
    setConvoys((data ?? []) as Convoy[]);
    if (!activeId && data && data.length) setActiveId(data[0].id);
  }

  useEffect(() => {
    if (user) refreshConvoys();
  }, [user]);

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    (async () => {
      const [{ data: msgs }, { data: mems }] = await Promise.all([
        supabase.from("convoy_messages").select("*").eq("convoy_id", activeId).order("created_at", { ascending: true }).limit(100),
        supabase.from("convoy_members").select("user_id, role").eq("convoy_id", activeId),
      ]);
      if (cancelled) return;
      setMessages((msgs ?? []) as Message[]);
      const userIds = (mems ?? []).map((m) => m.user_id);
      const { data: profiles } = await supabase.from("profiles").select("id, display_name, call_sign").in("id", userIds);
      const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
      setMembers((mems ?? []).map((m) => ({
        user_id: m.user_id,
        role: m.role,
        display_name: pmap.get(m.user_id)?.display_name ?? null,
        call_sign: pmap.get(m.user_id)?.call_sign ?? null,
      })));
    })();
    const channel = supabase
      .channel(`convoy-${activeId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "convoy_messages", filter: `convoy_id=eq.${activeId}` }, (p) => {
        setMessages((prev) => [...prev, p.new as Message]);
      })
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [activeId]);

  async function createConvoy() {
    if (!user || !name.trim()) return;
    const { data, error } = await supabase.from("convoys").insert({ owner_id: user.id, name: name.trim(), region: region.trim() || null }).select().single();
    if (error) return toast.error(error.message);
    await supabase.from("convoy_members").insert({ convoy_id: data.id, user_id: user.id, role: "leader" });
    setName(""); setRegion("");
    await refreshConvoys();
    setActiveId(data.id);
    toast.success(`Convoy created. Code: ${data.join_code}`);
  }

  async function joinConvoy() {
    if (!user || !code.trim()) return;
    const { data, error } = await supabase.from("convoys").select("id").eq("join_code", code.trim().toUpperCase()).maybeSingle();
    if (error || !data) return toast.error("Invalid join code");
    const { error: e2 } = await supabase.from("convoy_members").insert({ convoy_id: data.id, user_id: user.id, role: "member" });
    if (e2 && !e2.message.includes("duplicate")) return toast.error(e2.message);
    setCode("");
    await refreshConvoys();
    setActiveId(data.id);
    toast.success("Joined convoy");
  }

  async function leaveConvoy(id: string) {
    if (!user) return;
    await supabase.from("convoy_members").delete().match({ convoy_id: id, user_id: user.id });
    if (activeId === id) setActiveId(null);
    await refreshConvoys();
    toast.success("Left convoy");
  }

  async function sendMessage() {
    if (!user || !activeId || !body.trim()) return;
    const { error } = await supabase.from("convoy_messages").insert({ convoy_id: activeId, user_id: user.id, body: body.trim() });
    if (error) return toast.error(error.message);
    setBody("");
  }

  const active = convoys.find((c) => c.id === activeId);

  if (loading) return <AppShell title="Convoy"><div className="p-8 text-sm text-muted-foreground">Loading…</div></AppShell>;

  if (!user) {
    return (
      <AppShell title="Convoy" subtitle="Group coordination for safaris, NGOs and fleets">
        <div className="mx-auto max-w-2xl p-8">
          <Card className="p-8 text-center">
            <Users className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-3 text-xl font-bold">Sign in to coordinate</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create or join a convoy, broadcast group SOS, and keep your team on the same map.</p>
            <Button asChild className="mt-4"><Link to="/auth">Sign in</Link></Button>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Convoy" subtitle="Group coordination — live chat, members, codes">
      <div className="grid gap-4 p-4 md:grid-cols-[360px_1fr] md:p-6">
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold"><Plus className="h-4 w-4" />Create convoy</h3>
            <div className="mt-3 space-y-2">
              <Input placeholder="Name (e.g. Samburu Ops)" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Region (optional)" value={region} onChange={(e) => setRegion(e.target.value)} />
              <Button className="w-full" onClick={createConvoy} disabled={!name.trim()}>Create</Button>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold"><LogIn className="h-4 w-4" />Join by code</h3>
            <div className="mt-3 flex gap-2">
              <Input placeholder="6-char code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} />
              <Button onClick={joinConvoy} disabled={!code.trim()}>Join</Button>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold">Your convoys</h3>
            {convoys.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">No convoys yet.</p>
            ) : (
              <ul className="mt-2 space-y-1">
                {convoys.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setActiveId(c.id)}
                      className={"w-full rounded-md px-3 py-2 text-left text-sm transition " + (activeId === c.id ? "bg-primary/15 text-primary" : "hover:bg-muted")}
                    >
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.region ?? "Any region"} · {c.join_code}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          {!active ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">Select or create a convoy to begin.</Card>
          ) : (
            <>
              <Card className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{active.name}</h2>
                    <p className="text-xs text-muted-foreground">{active.region ?? "Any region"} · Status: {active.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">{active.join_code}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(active.join_code); toast.success("Code copied"); }}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => leaveConvoy(active.id)}>
                      <LogOut className="mr-1 h-3 w-3" />Leave
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {members.map((m) => (
                    <Badge key={m.user_id} variant="secondary" className="gap-1">
                      {m.call_sign ?? m.display_name ?? m.user_id.slice(0, 6)} · {m.role}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="flex h-[480px] flex-col p-4">
                <h3 className="text-sm font-semibold">Convoy channel</h3>
                <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
                  {messages.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No messages yet — say hi.</p>
                  ) : messages.map((m) => {
                    const mine = m.user_id === user.id;
                    const mem = members.find((x) => x.user_id === m.user_id);
                    return (
                      <div key={m.id} className={"flex " + (mine ? "justify-end" : "justify-start")}>
                        <div className={"max-w-[80%] rounded-lg px-3 py-2 text-sm " + (mine ? "bg-primary text-primary-foreground" : "bg-muted")}>
                          <div className="text-[10px] uppercase tracking-wider opacity-70">{mem?.call_sign ?? mem?.display_name ?? "Member"}</div>
                          <div>{m.body}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                  <Input placeholder="Message convoy…" value={body} onChange={(e) => setBody(e.target.value)} />
                  <Button type="submit" disabled={!body.trim()}><Send className="h-4 w-4" /></Button>
                </form>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}