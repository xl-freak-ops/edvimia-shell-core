---
name: Edvimia Architecture
description: Full architectural reference for the Edvimia AI School OS — stack, auth, routing, DB schema, RLS, UI system, modules, and conventions. Use before implementing any feature.
---

## NEW MODULES (added July 2026)

### Communication Center (`/communication`)
- Route: `src/routes/_authenticated/communication.tsx`
- Hooks: `src/lib/communication/hooks.ts` (announcements, messages, notifications, homework)
- Components: `src/components/communication/` (AnnouncementsPanel, InboxPanel, ComposeAnnouncementDialog, ComposeMessageDialog, NotificationsPanel, EmergencyAlertBanner, MessageTypeBadge)
- Role-aware: admin/staff see full management UI; parents/students see read-only published view
- RPC: `publish_announcement(id)` auto-notifies all targeted users; `link_parent_to_student(school, student, email)` for linking

### Parent Portal (`/dashboard/parent`)
- Hooks: `src/lib/parent/hooks.ts`
- Components: `src/components/parent/` (ParentDashboard, ChildSelector, ChildAttendanceCard, ChildResultsCard, ChildFinanceCard, ParentAnnouncementsPanel, ParentMessagesPanel, ParentAISummary)
- Data access: parent→student via `parent_student_links` table (`parent_user_id = auth.uid()`)
- AI: `ParentAISummary` generates client-side insights from real attendance/results/finance data

### Student Portal (`/dashboard/student`)
- Hooks: `src/lib/student-portal/hooks.ts`
- Components: `src/components/student-portal/` (StudentDashboard, StudentAttendancePanel, StudentResultsPanel, StudentTimetablePanel, StudentHomeworkPanel, StudentAnnouncementsPanel, StudentAIAssistant, StudentMessagesPanel)
- Data access: student self-link also uses `parent_student_links` (same table, `relationship = 'self'` or admin-linked)
- AI: `StudentAIAssistant` generates client-side study tips from results, attendance, homework

### New DB Tables (migration 20260713000001)
- `announcements` — type, target_roles[], is_emergency, is_published, scheduled_at
- `announcement_reads` — tracks per-user read status
- `messages` — direct messaging between school members
- `homework` — assignments by class/arm/subject
- `homework_submissions` — student submissions with grade/feedback
- `parent_student_links` — links parent auth users to student records (ALSO used for student self-link)
- `notifications` — in-app notifications auto-created on announcement publish
- New RPCs: `publish_announcement`, `link_parent_to_student`
- New helpers: `is_parent_of(student_id)`, `is_student_user(student_id)`

### Sidebar (updated)
- `src/components/layout/AppSidebar.tsx` is now role-aware
- Parents see: Home, Announcements, Messages, Profile, Settings
- Students see: Home, My Homework, Announcements, Messages, Profile, Settings
- Staff/admin see: existing full nav
- Footer shows role-appropriate branding copy

### RoleDashboard (updated)
- `parent` role → renders `<ParentDashboard />` (real data)
- `student` role → renders `<StudentDashboard />` (real data)
- All other roles → existing static stat cards unchanged

# Edvimia Architecture Reference

## Stack
- **Framework**: TanStack Start (SSR) + TanStack Router (file-based routing)
- **Runtime/Bundler**: Bun + Vite (`@lovable.dev/vite-tanstack-config`)
- **Auth & DB**: Supabase (anon key in env, client at `src/integrations/supabase/client.ts`)
- **State/Data**: TanStack Query (React Query v5)
- **UI**: Tailwind CSS v4 + shadcn/ui "new-york" style + Radix UI + Lucide icons
- **Language**: TypeScript strict, React 19
- **Port**: 5000 (strictPort, host 0.0.0.0, allowedHosts: true)

## Multi-tenancy
Every table includes a `school_id UUID` column. ALL queries must filter by `school_id` from `useAuth().school?.id`. Never cross school boundaries.

## Auth Flow (`src/lib/auth/AuthProvider.tsx`)
- `AuthProvider` wraps the entire app (in `__root.tsx`)
- Exposes: `{ loading, userId, email, profile, school, roles, signOut, refresh }`
- On mount: registers `onAuthStateChange` then calls `refresh()` → loads `profiles` + `user_roles` from Supabase
- **Self-healing**: if profile/school/role missing → calls `ensure_my_workspace` RPC → re-fetches
- Authenticated routes gated by `src/routes/_authenticated/route.tsx` (client-side only, `ssr: false`)
- `useAuth()` hook — throws if outside `<AuthProvider>`

## Roles (`src/lib/auth/roles.ts`)
```
AppRole = 'super_admin' | 'school_admin' | 'principal' | 'vice_principal'
        | 'form_teacher' | 'subject_teacher' | 'parent' | 'student'
```
- Priority order (highest first): super_admin → school_admin → principal → vice_principal → form_teacher → subject_teacher → parent → student
- `primaryRole(roles)` → picks highest priority role
- `dashboardRouteFor(role)` → `{ to: "/dashboard/$role", params: { role: ROLE_SLUG[role] } }`
- `ROLE_SLUG` maps role → URL slug (e.g. `school_admin` → `"school-admin"`)
- `SLUG_TO_ROLE` is the reverse map
- Dashboard stats in `RoleDashboard` are currently STATIC/MOCK data per role

## Routing (TanStack Router, file-based)
```
src/routes/
  __root.tsx              → App shell (QueryClient, ThemeProvider, AuthProvider, HeadContent, Scripts)
  index.tsx               → / (ssr:false) → redirects to /welcome or role dashboard
  welcome.tsx             → /welcome (landing page, public)
  login.tsx               → /login
  signup.tsx              → /signup (calls create_school_workspace RPC)
  forgot-password.tsx     → /forgot-password
  reset-password.tsx      → /reset-password
  recover.tsx             → /recover (calls ensure_my_workspace)
  access-denied.tsx       → /access-denied

  _authenticated/
    route.tsx             → layout: checks userId, redirects to /login if missing (ssr:false)
    dashboard.index.tsx   → /dashboard/ → redirects to role dashboard
    dashboard.$role.tsx   → /dashboard/:role → RoleDashboard (validates role ownership)
    attendance.tsx        → /attendance
    finance.tsx           → /finance
    profile.tsx           → /profile
    results/
      index.tsx           → /results
      report.$studentId.tsx → /results/report/:studentId
    school.tsx            → /school
    settings.tsx          → /settings
    students/
      index.tsx           → /students
      $id.tsx             → /students/:id (tabs: overview, guardians, documents, results, finance, behaviour, medical, communication, ai)
      new.tsx             → /students/new
    teachers/
      index.tsx           → /teachers
      $id.tsx             → /teachers/:id
      new.tsx             → /teachers/new
    timetable.tsx         → /timetable
```

## Database Schema (Supabase)

### Enums
- `app_role`: super_admin, school_admin, principal, vice_principal, form_teacher, subject_teacher, parent, student
- `student_status`: active, graduated, transferred, suspended, withdrawn, archived
- `student_gender` / `staff_gender`: male, female, other
- `staff_status`: active, on_leave, suspended, terminated, archived
- `staff_position`: principal, vice_principal, school_admin, form_teacher, subject_teacher, account_officer, receptionist, librarian, bursar, other
- `leave_status`: pending, approved, rejected, cancelled
- `attendance_status`: present, absent, late, excused, medical, half_day
- `period_kind`: class, break, lunch, assembly, free
- `result_workflow_status`: draft, pending_review, approved, published, rejected
- `promotion_status`: promoted, repeat, conditional, graduated, pending
- `payment_method`: cash, bank_transfer, pos, card, online (+ others)
- `invoice_status`: draft, issued, partial, paid, overdue, cancelled
- `expense_status`: draft, pending_approval, approved, rejected, paid
- `subject_category`: core, elective, practical

### Core / Identity Tables
| Table | Key Columns | Notes |
|-------|-------------|-------|
| `schools` | id, name, school_type, country, state, address, email, phone | Primary tenant container |
| `profiles` | id (→ auth.users), school_id, full_name, email, phone, avatar_url | 1-to-1 with auth.users |
| `user_roles` | id, user_id, role (app_role), school_id | UNIQUE(user_id, role, school_id) |
| `school_settings` | school_id (PK), attendance config, result config | upserted on conflict |

### Academic Structure
| Table | Key Columns |
|-------|-------------|
| `academic_sessions` | id, school_id, name, start_date, end_date, is_current |
| `terms` | id, school_id, session_id, name, start_date, end_date, is_current |
| `sections` | id, school_id, name, display_order |
| `classes` | id, school_id, section_id, name, display_order |
| `class_arms` | id, school_id, class_id, name |
| `subjects` | id, school_id, name, code, category (subject_category), is_active |
| `grade_scales` | id, school_id, name, min_score, max_score, grade, remark, display_order |

### Students
| Table | Key Columns |
|-------|-------------|
| `students` | id, school_id, surname, first_name, middle_name, admission_number, status (student_status), gender, dob, photo_url, current_class_id, current_arm_id, blood_group, genotype, medical_conditions, disabilities, nationality, state_of_origin |
| `student_guardians` | id, school_id, student_id, full_name, relationship, phone, email, whatsapp, is_primary, is_emergency, occupation, address |
| `student_documents` | id, school_id, student_id, name, doc_type, storage_path, content_type, size_bytes, uploaded_by |
| `student_status_history` | id, student_id, school_id, old_status, new_status, reason, changed_by, changed_at |

### Staff
| Table | Key Columns |
|-------|-------------|
| `staff` | id, school_id, staff_number, first_name, last_name, email, phone, gender, position (staff_position), status (staff_status), date_joined, photo_url, qualification, specialization |
| `staff_assignments` | id, school_id, staff_id, class_id, arm_id, subject_id, session_id, is_form_teacher |
| `staff_leave_requests` | id, school_id, staff_id, leave_type, start_date, end_date, reason, status (leave_status), reviewed_by, review_note |
| `staff_attendance` | id, school_id, staff_id, date, status, note |
| `staff_documents` | id, school_id, staff_id, name, doc_type, storage_path |

### Attendance
| Table | Key Columns |
|-------|-------------|
| `attendance_records` | id, school_id, student_id, class_id, arm_id, subject_id, term_id, date, status (attendance_status), marked_by, note |
| `attendance_audit` | id, school_id, record_id, actor_id, action, old_status, new_status, note |

### Timetable
| Table | Key Columns |
|-------|-------------|
| `timetable_periods` | id, school_id, class_id, arm_id, subject_id, teacher_id, day_of_week (0–6), start_time, end_time, room, kind (period_kind) |
| `timetable_versions` | id, school_id, name, is_active, created_by |

### Results / Assessments
| Table | Key Columns |
|-------|-------------|
| `assessment_components` | id, school_id, name, code, max_score, weight, is_exam, is_enabled, display_order |
| `result_sheets` | id, school_id, class_id, arm_id, subject_id, term_id, teacher_id, status (result_workflow_status) |
| `result_scores` | id, school_id, sheet_id, student_id, component_id, score |
| `result_meta` | id, school_id, sheet_id, student_id, total, grade, position, promotion_status |
| `result_audit` | id, school_id, sheet_id, actor_id, action, note |

### Finance
| Table | Key Columns |
|-------|-------------|
| `fee_categories` | id, school_id, name, description |
| `fee_structures` | id, school_id, category_id, term_id, class_id, arm_id, amount, discount_amount, penalty_amount, due_date, is_active |
| `invoices` | id, school_id, student_id, session_id, term_id, class_id, arm_id, status (invoice_status), subtotal, discount_total, penalty_total, total, due_date, created_by |
| `invoice_items` | id, invoice_id, school_id, fee_structure_id, category_id, description, amount, discount, penalty |
| `payments` | id, school_id, invoice_id, student_id, amount, method (payment_method), reference, note, recorded_by |
| `receipts` | id, school_id, payment_id, receipt_number (auto) — created by tg_auto_receipt trigger |
| `expense_categories` | id, school_id, name |
| `expenses` | id, school_id, category_id, title, amount, date, status (expense_status), approved_by, note |

## Key RPC Functions
| Function | Purpose |
|----------|---------|
| `ensure_my_workspace(_school_name)` | Self-healing: creates profile + role + school if missing |
| `create_school_workspace(...)` | Called during signup; creates school + profile + role atomically |
| `generate_invoices_for_class(school_id, term_id, class_id, arm_id)` | Bulk invoice generation for a class |
| `seed_default_assessments(school_id)` | Seeds default CA + Exam components |

## RLS Helper Functions (SECURITY DEFINER, EXECUTE granted to authenticated + anon)
- `is_super_admin()` — checks `user_roles` for super_admin
- `is_school_admin_of(school_id uuid)` — checks for school_admin in that school
- `is_school_member(school_id uuid)` — checks `profiles.school_id` or `user_roles.school_id`
- `can_manage_finance(school_id uuid)` — school_admin or specific finance roles
- `has_role(user_id, role)` — generic role check

## DB Triggers
- `on_auth_user_created` → `handle_new_user()` — creates profile row on signup
- `tg_set_updated_at` — sets updated_at on every UPDATE
- `tg_auto_receipt` — creates receipt row when payment inserted
- `tg_recalc_invoice` — recalculates invoice totals when payment changes

## Storage Buckets
- `school-assets` — logos, covers
- `student-assets` — student documents/photos
- `staff-assets` — staff documents/photos

## UI Design System (`src/styles.css`, `components.json`)

### Color Tokens (OKLCH, light + dark)
- `--primary` — main blue/brand
- `--accent-brand` — orange accent (gradient partner to primary)
- `--success` — green
- `--destructive` — red
- `--background`, `--foreground`, `--card`, `--muted`, `--muted-foreground`
- `--sidebar-*` variants for sidebar colors
- `--border`, `--input`, `--ring`

### Custom Utilities
- `shadow-soft` — subtle card shadow
- `shadow-elevated` — stronger shadow (modals, avatars)
- `shadow-glow` — glow effect (logo icon)
- `animate-fade-in` — page transition

### shadcn/ui Config
- Style: `"new-york"`, TSX: true
- Aliases: `@/components/ui/*`, `@/lib/utils`, `@/hooks/*`
- Icons: Lucide

### Layout Pattern
```
AppShell
  SidebarProvider
    AppSidebar (collapsible="icon")
    SidebarInset
      TopNav (theme toggle, search, notifications, profile dropdown)
      <main className="flex-1 animate-fade-in">{children}</main>
```

## Domain Hook Patterns (`src/lib/<domain>/hooks.ts`)

All hooks follow this pattern:
```ts
// Query key factory
const keys = { all: (sid) => ['domain', sid], detail: (id) => [...] }

// Read hook
export function useWidgets(schoolId) {
  return useQuery({ enabled: !!schoolId, queryKey: keys.all(schoolId), queryFn: ... })
}

// Mutation hook
export function useCreateWidget(schoolId) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (row) => { ... }, onSuccess: () => qc.invalidateQueries(...) })
}
```

## Modules & Their Files

| Module | Route | Component dir | Lib dir |
|--------|-------|---------------|---------|
| Dashboard | `/dashboard/$role` | `dashboard/` | — |
| Students | `/students`, `/students/$id`, `/students/new` | `students/` | `lib/students/` |
| Teachers/Staff | `/teachers`, `/teachers/$id`, `/teachers/new` | `staff/` | `lib/staff/` |
| Attendance | `/attendance` | `attendance/` | `lib/attendance/` |
| Results | `/results`, `/results/report/$id` | `results/` | `lib/results/` |
| Timetable | `/timetable` | `timetable/` | `lib/timetable/` |
| Finance | `/finance` | `finance/` | `lib/finance/` |
| School Setup | `/school` | `school/` | `lib/school/` |
| Profile | `/profile` | — | — |
| Settings | `/settings` | `settings/` | — |

## Planned but Not Yet Built (EmptyState placeholders in UI)
- Student results tab on `/students/$id`
- Student finance tab on `/students/$id`
- Student behaviour tab on `/students/$id`
- Student communication tab on `/students/$id`
- `/communication` route (sidebar link exists, no route file)
- `/reports` route (sidebar link exists, no route file)
- `/ai` route — "Edvi · AI Assistant" (sidebar link exists, no route file)
- "Upgrade to Pro" in sidebar footer (not yet functional)

## Conventions to Follow
1. All new routes go under `src/routes/_authenticated/` — never create standalone non-auth routes for internal features
2. All new components go in `src/components/<module>/` — match existing module folders
3. All Supabase queries go in `src/lib/<module>/hooks.ts` — never query Supabase directly from components
4. Always filter by `school_id` from `useAuth().school?.id`
5. Use `useAuth()` for user/school/role context — never read from localStorage directly
6. Use `cn()` from `@/lib/utils` for all className merging
7. Use shadcn/ui primitives from `@/components/ui/*` — do not install duplicate component libs
8. New pages wrap their content in `<AppShell>` 
9. `routeTree.gen.ts` is auto-generated — never edit by hand; add new route files and let Vite regenerate
10. Export functions for CSV/Excel go in `src/lib/<module>/export.ts`
