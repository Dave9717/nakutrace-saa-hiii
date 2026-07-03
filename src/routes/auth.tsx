import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Compass } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — NAKUTRACE SAI" },
      { name: "description", content: "Sign in to NAKUTRACE SAI to access convoy coordination, SOS history and operator tools." },
      { property: "og:title", content: "Sign in — NAKUTRACE SAI" },
      { property: "og:description", content: "Sign in to NAKUTRACE SAI to access convoy coordination, SOS history and operator tools." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://savannah-guide-ai.lovable.app/auth" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://savannah-guide-ai.lovable.app/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    navigate({ to: "/dashboard" });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Check your email if confirmation is required.");
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) { setBusy(false); toast.error("Google sign-in failed"); return; }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero px-4">
      <Link to="/" className="mb-8 flex items-center gap-3 text-foreground">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">N</div>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold tracking-wide">NAKUTRACE</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary">SAI</span>
        </div>
      </Link>
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 text-center">
          <Compass className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-2 text-xl font-semibold">Access the field console</h1>
          <p className="text-sm text-muted-foreground">Sign in to coordinate convoys and respond to SOS broadcasts.</p>
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>
          Continue with Google
        </Button>
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-3 pt-2">
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
              <Button type="submit" className="w-full" disabled={busy}>Sign in</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-3 pt-2">
              <div><Label htmlFor="email2">Email</Label><Input id="email2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div><Label htmlFor="password2">Password</Label><Input id="password2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
              <Button type="submit" className="w-full" disabled={busy}>Create account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}