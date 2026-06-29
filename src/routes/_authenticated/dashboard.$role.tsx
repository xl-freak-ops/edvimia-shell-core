import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ROLE_LABEL, SLUG_TO_ROLE, dashboardPathFor, primaryRole } from "@/lib/auth/roles";

export const Route = createFileRoute("/_authenticated/dashboard/$role")({
  head: ({ params }) => {
    const role = SLUG_TO_ROLE[params.role];
    const label = role ? ROLE_LABEL[role] : "Dashboard";
    return { meta: [{ title: `${label} · Edvimia` }] };
  },
  component: RoleDashboardRoute,
});

function RoleDashboardRoute() {
  const { role: slug } = Route.useParams();
  const { roles, loading } = useAuth();
  const role = SLUG_TO_ROLE[slug];

  if (!role) return <Navigate to="/access-denied" />;
  if (loading) return null;
  // Permission check — user must actually hold this role.
  if (!roles.includes(role)) {
    // If they have any role, send them to their own dashboard; else access denied.
    const own = primaryRole(roles);
    return <Navigate to={own ? dashboardPathFor(own) : "/access-denied"} />;
  }

  return (
    <AppShell>
      <RoleDashboard role={role} />
    </AppShell>
  );
}