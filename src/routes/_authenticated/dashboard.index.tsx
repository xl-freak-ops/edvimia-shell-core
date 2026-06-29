import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth/AuthProvider";
import { dashboardPathFor, primaryRole } from "@/lib/auth/roles";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { roles, loading } = useAuth();
  if (loading) return null;
  const r = primaryRole(roles);
  return <Navigate to={r ? dashboardPathFor(r) : "/access-denied"} />;
}