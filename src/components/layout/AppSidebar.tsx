import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck2,
  ClipboardList,
  CalendarDays,
  Wallet,
  MessageSquare,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthProvider";
import { primaryRole, ROLE_SLUG } from "@/lib/auth/roles";

const baseNav = (dashboardUrl: string) => [
  { title: "Dashboard", url: dashboardUrl, icon: LayoutDashboard },
  { title: "Students", url: "/students", icon: GraduationCap },
  { title: "Teachers", url: "/teachers", icon: Users },
  { title: "Attendance", url: "/attendance", icon: CalendarCheck2 },
  { title: "Results", url: "/results", icon: ClipboardList },
  { title: "Timetable", url: "/timetable", icon: CalendarDays },
  { title: "Finance", url: "/finance", icon: Wallet },
  { title: "Communication", url: "/communication", icon: MessageSquare },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

const intelligenceNav = [
  { title: "Edvi · AI Assistant", url: "/ai", icon: Sparkles, badge: "New" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { roles, signOut } = useAuth();
  const role = primaryRole(roles);
  const dashboardUrl = role ? `/dashboard/${ROLE_SLUG[role]}` : "/";
  const mainNav = baseNav(dashboardUrl);
  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 pt-4 pb-3">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-glow">
            <span className="text-sm font-bold tracking-tight">E</span>
          </span>
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
                Edvimia
              </span>
              <span className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                School OS
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "h-9 rounded-lg font-medium transition-all",
                      "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold",
                      "hover:bg-sidebar-accent",
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          {!collapsed && (
            <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Intelligence
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {intelligenceNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="h-9 rounded-lg font-medium transition-all hover:bg-sidebar-accent data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4 text-accent-brand" />
                      <span className="flex-1">{item.title}</span>
                      {!collapsed && item.badge && (
                        <span className="rounded-full bg-accent-brand/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent-brand">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          {!collapsed && (
            <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              System
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/settings")}
                  tooltip="Settings"
                  className="h-9 rounded-lg font-medium transition-all hover:bg-sidebar-accent data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                >
                  <Link to="/settings"><Settings className="h-4 w-4" /><span>Settings</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Logout"
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/login" });
                  }}
                  className="h-9 rounded-lg font-medium transition-all hover:bg-sidebar-accent text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="p-3">
          <div className="relative overflow-hidden rounded-xl border border-sidebar-border bg-gradient-to-br from-primary/8 via-sidebar to-accent-brand/8 p-3.5">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent-brand" />
              <span className="text-xs font-semibold tracking-tight">
                Upgrade to Pro
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Unlock predictive analytics and unlimited AI reports.
            </p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}