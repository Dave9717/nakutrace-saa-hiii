import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import { IconBox } from "@/components/icon-box";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  badge?: string;
}

export function FeaturePage({
  title,
  subtitle,
  headline,
  intro,
  icon: Icon,
  features,
  children,
}: {
  title: string;
  subtitle?: string;
  headline: string;
  intro: string;
  icon: LucideIcon;
  features: FeatureItem[];
  children?: ReactNode;
}) {
  return (
    <AppShell title={title} subtitle={subtitle}>
      <section
        className="border-b border-border"
        style={{ background: "var(--gradient-savannah)" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-start gap-4">
            <IconBox icon={Icon} size="lg" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{headline}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{intro}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="p-5">
              <div className="flex items-center gap-2">
                <f.icon className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">{f.title}</h3>
                {f.badge && (
                  <Badge variant="outline" className="ml-auto text-[10px]">
                    {f.badge}
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
        {children && <div className="mt-10">{children}</div>}
      </section>
    </AppShell>
  );
}
