import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export function SignInPrompt({
  title,
  subtitle,
  icon: Icon,
  heading,
  description,
}: {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  heading: string;
  description: string;
}) {
  return (
    <AppShell title={title} subtitle={subtitle}>
      <div className="mx-auto max-w-2xl p-8">
        <Card className="p-8 text-center">
          <Icon className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-3 text-xl font-bold">{heading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <Button asChild className="mt-4">
            <Link to="/auth">Sign in</Link>
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
