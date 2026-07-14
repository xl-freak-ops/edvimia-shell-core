import { useMemo } from "react";
import {
  Users,
  GraduationCap,
  Wallet,
  TrendingUp,
  ClipboardList,
  BookOpen,
  CalendarCheck2,
  Building2,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatCard } from "@/components/dashboard/StatCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TasksWidget } from "@/components/dashboard/TasksWidget";
import { AnnouncementCard } from "@/components/dashboard/AnnouncementCard";
import { RecentStudentsTable } from "@/components/dashboard/RecentStudentsTable";
import { ParentDashboard } from "@/components/parent/ParentDashboard";
import { StudentDashboard } from "@/components/student-portal/StudentDashboard";
import type { AppRole } from "@/lib/auth/roles";
import { ROLE_LABEL } from "@/lib/auth/roles";

type Stat = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  accent: "primary" | "success" | "brand" | "info";
  spark: number[];
};

const STATS: Record<Exclude<AppRole, "parent" | "student">, Stat[]> = {
  super_admin: [
    { label: "Schools onboarded", value: "412", delta: "+24", trend: "up", icon: Building2, accent: "primary", spark: [200, 240, 260, 300, 340, 380, 412] },
    { label: "Active users", value: "84,302", delta: "+6.4%", trend: "up", icon: Users, accent: "success", spark: [60, 64, 68, 72, 76, 80, 84] },
    { label: "Platform revenue", value: "$1.42M", delta: "+18%", trend: "up", icon: Wallet, accent: "brand", spark: [10, 14, 18, 20, 22, 28, 32] },
    { label: "AI requests", value: "2.1M", delta: "+42%", trend: "up", icon: TrendingUp, accent: "info", spark: [12, 16, 22, 28, 36, 40, 48] },
  ],
  school_admin: [
    { label: "Total students", value: "1,284", delta: "+3.2%", trend: "up", icon: GraduationCap, accent: "primary", spark: [12, 18, 15, 22, 20, 28, 32] },
    { label: "Attendance today", value: "92.4%", delta: "+1.8%", trend: "up", icon: Users, accent: "success", spark: [80, 85, 82, 88, 90, 91, 92] },
    { label: "Fees collected", value: "₦18.4M", delta: "+12%", trend: "up", icon: Wallet, accent: "brand", spark: [10, 14, 12, 18, 22, 24, 30] },
    { label: "Avg. performance", value: "74.2", delta: "-0.6", trend: "down", icon: TrendingUp, accent: "info", spark: [78, 76, 77, 75, 74, 75, 74] },
  ],
  principal: [
    { label: "Enrolled students", value: "1,284", delta: "+18", trend: "up", icon: GraduationCap, accent: "primary", spark: [1200, 1230, 1245, 1260, 1270, 1280, 1284] },
    { label: "Faculty present", value: "96.1%", delta: "+0.4%", trend: "up", icon: Users, accent: "success", spark: [92, 93, 95, 94, 95, 96, 96] },
    { label: "Discipline cases", value: "7", delta: "-3", trend: "down", icon: ShieldCheck, accent: "brand", spark: [12, 10, 9, 11, 9, 8, 7] },
    { label: "Term progress", value: "62%", delta: "+8%", trend: "up", icon: TrendingUp, accent: "info", spark: [20, 28, 35, 42, 50, 56, 62] },
  ],
  vice_principal: [
    { label: "Attendance compliance", value: "94.8%", delta: "+1.1%", trend: "up", icon: CalendarCheck2, accent: "success", spark: [88, 90, 91, 92, 93, 94, 94] },
    { label: "Late arrivals", value: "23", delta: "-7", trend: "down", icon: Users, accent: "brand", spark: [40, 35, 30, 28, 26, 25, 23] },
    { label: "Open discipline", value: "5", delta: "-2", trend: "down", icon: ShieldCheck, accent: "primary", spark: [10, 8, 7, 7, 6, 6, 5] },
    { label: "Teachers on duty", value: "48", delta: "+2", trend: "up", icon: GraduationCap, accent: "info", spark: [42, 44, 45, 46, 47, 48, 48] },
  ],
  form_teacher: [
    { label: "Class size", value: "32", icon: Users, accent: "primary", spark: [32, 32, 32, 32, 32, 32, 32] },
    { label: "Present today", value: "29", delta: "+1", trend: "up", icon: CalendarCheck2, accent: "success", spark: [27, 28, 28, 29, 29, 28, 29] },
    { label: "Class average", value: "78.6", delta: "+1.2", trend: "up", icon: TrendingUp, accent: "info", spark: [74, 75, 76, 77, 78, 78, 78] },
    { label: "Open tasks", value: "9", delta: "-2", trend: "down", icon: ClipboardList, accent: "brand", spark: [12, 11, 10, 10, 9, 9, 9] },
  ],
  subject_teacher: [
    { label: "Classes taught", value: "6", icon: BookOpen, accent: "primary", spark: [6, 6, 6, 6, 6, 6, 6] },
    { label: "Lessons this week", value: "18", delta: "+2", trend: "up", icon: CalendarCheck2, accent: "success", spark: [14, 15, 16, 17, 17, 18, 18] },
    { label: "Assignments pending", value: "47", delta: "-6", trend: "down", icon: ClipboardList, accent: "brand", spark: [60, 56, 54, 52, 50, 48, 47] },
    { label: "Subject average", value: "72.1", delta: "+0.4", trend: "up", icon: TrendingUp, accent: "info", spark: [70, 71, 71, 71, 72, 72, 72] },
  ],
};

export function RoleDashboard({ role }: { role: AppRole }) {
  // Delegate to dedicated portals for parent and student
  if (role === "parent") return <ParentDashboard />;
  if (role === "student") return <StudentDashboard />;

  const stats = useMemo(() => STATS[role as keyof typeof STATS] ?? [], [role]);

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
      <WelcomeBanner />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <h2 className="text-lg font-bold tracking-tight">{ROLE_LABEL[role]} dashboard</h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            trend={s.trend}
            icon={s.icon}
            accent={s.accent}
            spark={s.spark}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AttendanceChart />
          <AnnouncementCard />
          {(role === "school_admin" || role === "principal" || role === "vice_principal" || role === "form_teacher") && (
            <RecentStudentsTable />
          )}
        </div>
        <div className="space-y-4">
          <CalendarWidget />
          <TasksWidget />
          <QuickActions />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
