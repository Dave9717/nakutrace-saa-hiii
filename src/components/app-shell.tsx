import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Wifi, WifiOff, Battery } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur md:px-6">
            <SidebarTrigger />
            <div className="flex flex-col leading-tight">
              {title && (
                <h1 className="text-sm font-semibold tracking-wide md:text-base">{title}</h1>
              )}
              {subtitle && (
                <p className="hidden text-xs text-muted-foreground md:block">{subtitle}</p>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {actions}
              <Badge variant="outline" className="hidden gap-1 border-secondary/60 text-secondary-foreground sm:flex">
                <WifiOff className="h-3 w-3" /> Offline ready
              </Badge>
              <Badge variant="outline" className="hidden gap-1 sm:flex">
                <Wifi className="h-3 w-3 text-primary" /> 4G
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Battery className="h-3 w-3 text-primary" /> 82%
              </Badge>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}