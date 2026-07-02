import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Wifi, WifiOff, Battery, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="app-bg flex min-h-dvh w-full text-foreground">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="glass-nav sticky top-0 z-30 flex h-14 items-center gap-3 px-3 md:px-6">
            <SidebarTrigger aria-label="Toggle navigation" />
            <div className="flex min-w-0 flex-col leading-tight">
              {title && (
                <h1 className="truncate text-sm font-semibold tracking-wide md:text-base">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="hidden truncate text-xs text-muted-foreground md:block">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {actions}
              <Badge
                variant="outline"
                className="hidden gap-1 border-primary/40 text-primary-foreground sm:flex"
              >
                <WifiOff className="h-3 w-3" /> Offline ready
              </Badge>
              <Badge variant="outline" className="hidden gap-1 sm:flex">
                <Wifi className="h-3 w-3 text-primary" /> 4G
              </Badge>
              <Badge variant="outline" className="hidden gap-1 md:flex">
                <Battery className="h-3 w-3 text-primary" /> 82%
              </Badge>
              <Link
                to="/sos"
                aria-label="Trigger SOS"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-destructive px-3 text-xs font-semibold text-destructive-foreground shadow-lg transition hover:brightness-110"
              >
                <ShieldAlert className="h-3.5 w-3.5" /> SOS
              </Link>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}