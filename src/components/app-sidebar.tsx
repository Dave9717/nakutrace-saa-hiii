import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  Map as MapIcon,
  Compass,
  Users,
  ShieldAlert,
  Mountain,
  Heart,
  Camera,
  Calendar,
  Sparkles,
  PackageOpen,
  Settings,
  Home,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const primary = [
  { title: "Home", url: "/", icon: Home },
  { title: "Map", url: "/map", icon: MapIcon },
  { title: "Expedition", url: "/expedition", icon: Compass },
  { title: "Convoy", url: "/convoy", icon: Users },
  { title: "SOS", url: "/sos", icon: ShieldAlert },
];

const tools = [
  { title: "Survival", url: "/survival", icon: Mountain },
  { title: "Guardian", url: "/guardian", icon: Heart },
  { title: "Safari", url: "/safari", icon: Camera },
  { title: "Community", url: "/community", icon: Users },
  { title: "Events", url: "/events", icon: Calendar },
];

const knowledge = [
  { title: "AI Assistant", url: "/ai-assistant", icon: Sparkles },
  { title: "Knowledge Packs", url: "/knowledge-packs", icon: PackageOpen },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { user } = useAuth();
  const isActive = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));
  const account = user
    ? [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }]
    : [{ title: "Sign in", url: "/auth", icon: LogIn }];

  const renderGroup = (label: string, items: typeof primary) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            N
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-wide text-sidebar-foreground">
                NAKUTRACE
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary">SAI</span>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Navigate", primary)}
        {renderGroup("Field Tools", tools)}
        {renderGroup("Intelligence", knowledge)}
        {renderGroup("Account", account)}
      </SidebarContent>
    </Sidebar>
  );
}