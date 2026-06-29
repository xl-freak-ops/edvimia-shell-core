export type AppRole =
  | "super_admin"
  | "school_admin"
  | "principal"
  | "vice_principal"
  | "form_teacher"
  | "subject_teacher"
  | "parent"
  | "student";

export const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: "Edvimia Super Admin",
  school_admin: "School Administrator",
  principal: "Principal",
  vice_principal: "Vice Principal",
  form_teacher: "Form Teacher",
  subject_teacher: "Subject Teacher",
  parent: "Parent",
  student: "Student",
};

export const ROLE_SLUG: Record<AppRole, string> = {
  super_admin: "super-admin",
  school_admin: "school-admin",
  principal: "principal",
  vice_principal: "vice-principal",
  form_teacher: "form-teacher",
  subject_teacher: "subject-teacher",
  parent: "parent",
  student: "student",
};

export const SLUG_TO_ROLE: Record<string, AppRole> = Object.fromEntries(
  Object.entries(ROLE_SLUG).map(([k, v]) => [v, k as AppRole]),
) as Record<string, AppRole>;

// Priority — used to pick the "primary" dashboard when a user holds multiple roles.
const ORDER: AppRole[] = [
  "super_admin",
  "school_admin",
  "principal",
  "vice_principal",
  "form_teacher",
  "subject_teacher",
  "parent",
  "student",
];

export function primaryRole(roles: AppRole[]): AppRole | null {
  for (const r of ORDER) if (roles.includes(r)) return r;
  return null;
}

export function dashboardPathFor(role: AppRole): string {
  return `/dashboard/${ROLE_SLUG[role]}`;
}

// Typed helper for TanStack Navigate / navigate({ to, params })
export function dashboardRouteFor(role: AppRole): { to: "/dashboard/$role"; params: { role: string } } {
  return { to: "/dashboard/$role", params: { role: ROLE_SLUG[role] } };
}