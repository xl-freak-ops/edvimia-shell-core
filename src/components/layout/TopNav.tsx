import { Bell, Search, Moon, Sun, Plus, ChevronDown, Check } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

const schools = [
  { id: "1", name: "Greenfield Academy", initial: "GA", active: true },
  { id: "2", name: "Riverside International", initial: "RI", active: false },
  { id: "3", name: "Northgate Primary", initial: "NP", active: false },
];

export function TopNav() {
  const { theme, toggle } = useTheme();
  const activeSchool = schools.find((s) => s.active)!;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border/70 bg-background/80 px-3 backdrop-blur-xl sm:px-6">
      <SidebarTrigger className="h-9 w-9 rounded-lg hover:bg-accent" />

      <Separator orientation="vertical" className="mx-1 h-6 hidden sm:block" />

      {/* School switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hidden h-9 gap-2 rounded-lg px-2.5 font-medium hover:bg-accent sm:flex"
          >
            <span className="grid h-6 w-6 place-items-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
              {activeSchool.initial}
            </span>
            <span className="max-w-[160px] truncate text-sm">{activeSchool.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Switch school
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {schools.map((s) => (
            <DropdownMenuItem key={s.id} className="gap-2.5 py-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-muted text-[10px] font-bold">
                {s.initial}
              </span>
              <span className="flex-1 text-sm font-medium">{s.name}</span>
              {s.active && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-sm text-muted-foreground">
            <Plus className="h-4 w-4" /> Add new school
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search */}
      <div className="relative ml-auto hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students, classes, reports…"
          className="h-9 rounded-lg border-border/70 bg-muted/40 pl-9 pr-16 text-sm placeholder:text-muted-foreground/70 focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/30"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1 md:ml-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg md:hidden">
          <Search className="h-4 w-4" />
        </Button>

        {/* Quick action */}
        <Button
          size="sm"
          className="hidden h-9 gap-1.5 rounded-lg shadow-soft lg:inline-flex"
        >
          <Plus className="h-4 w-4" />
          New
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-9 w-9 rounded-lg"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-brand ring-2 ring-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-[10px] font-medium text-muted-foreground">3 new</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { title: "Attendance report ready", time: "2m ago" },
              { title: "12 fee payments received", time: "1h ago" },
              { title: "Term 2 results published", time: "Yesterday" },
            ].map((n) => (
              <DropdownMenuItem key={n.title} className="flex-col items-start gap-0.5 py-2.5">
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 rounded-lg px-1.5 pr-2 hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent-brand text-[11px] font-semibold text-primary-foreground">
                  AO
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium leading-none lg:inline">
                Adaora O.
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">Adaora Okoye</span>
              <span className="text-xs font-normal text-muted-foreground">
                adaora@greenfield.edu
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}