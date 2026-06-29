import { createFileRoute } from "@tanstack/react-router";
import { Users, GraduationCap, Wallet, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatCard } from "@/components/dashboard/StatCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TasksWidget } from "@/components/dashboard/TasksWidget";
import { AnnouncementCard } from "@/components/dashboard/AnnouncementCard";
import { RecentStudentsTable } from "@/components/dashboard/RecentStudentsTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Edvimia" },
      { name: "description", content: "Your AI-powered school operating system dashboard." },
      { property: "og:title", content: "Dashboard · Edvimia" },
      { property: "og:description", content: "Your AI-powered school operating system dashboard." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
        <WelcomeBanner />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total students" value="1,284" delta="+3.2%" trend="up" icon={GraduationCap} accent="primary" spark={[12, 18, 15, 22, 20, 28, 32]} />
          <StatCard label="Attendance today" value="92.4%" delta="+1.8%" trend="up" icon={Users} accent="success" spark={[80, 85, 82, 88, 90, 91, 92]} />
          <StatCard label="Fees collected" value="₦18.4M" delta="+12%" trend="up" icon={Wallet} accent="brand" spark={[10, 14, 12, 18, 22, 24, 30]} />
          <StatCard label="Avg. performance" value="74.2" delta="-0.6" trend="down" icon={TrendingUp} accent="info" spark={[78, 76, 77, 75, 74, 75, 74]} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <AttendanceChart />
            <AnnouncementCard />
            <RecentStudentsTable />
          </div>
          <div className="space-y-4">
            <CalendarWidget />
            <TasksWidget />
            <QuickActions />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
