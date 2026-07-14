import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ReportsCenter } from "@/components/reports/ReportsCenter";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports · Edvimia" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const { school } = useAuth();
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports Center</h1>
          <p className="text-sm text-muted-foreground">
            Generate and export cross-module reports for {school?.name ?? "your school"}.
          </p>
        </div>
        <ReportsCenter />
      </div>
    </AppShell>
  );
}
