import * as React from "react";
import { Check, ChevronsUpDown, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSchoolMembers, type SchoolMember } from "@/lib/communication/hooks";

// ── Role categorisation ────────────────────────────────────

const STAFF_ROLES = new Set([
  "school_admin", "principal", "vice_principal", "form_teacher",
  "subject_teacher", "bursar", "account_officer", "receptionist",
  "librarian", "other_staff",
]);

const ROLE_LABELS: Record<string, string> = {
  school_admin: "Admin",
  principal: "Principal",
  vice_principal: "Vice Principal",
  form_teacher: "Form Teacher",
  subject_teacher: "Subject Teacher",
  bursar: "Bursar",
  account_officer: "Account Officer",
  receptionist: "Receptionist",
  librarian: "Librarian",
  other_staff: "Other Staff",
  parent: "Parent",
  student: "Student",
};

type Category = "all" | "staff" | "parents" | "students";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "staff", label: "Staff" },
  { value: "parents", label: "Parents" },
  { value: "students", label: "Students" },
];

function getCategory(role: string | null): "staff" | "parents" | "students" | "other" {
  if (!role) return "other";
  if (STAFF_ROLES.has(role)) return "staff";
  if (role === "parent") return "parents";
  if (role === "student") return "students";
  return "other";
}

function roleLabel(role: string | null) {
  return role ? (ROLE_LABELS[role] ?? role) : "Unknown";
}

function displayName(m: SchoolMember) {
  return m.full_name?.trim() || m.email || m.id;
}

function matchesSearch(m: SchoolMember, search: string) {
  if (!search) return true;
  const q = search.toLowerCase();
  return (
    (m.full_name ?? "").toLowerCase().includes(q) ||
    (m.email ?? "").toLowerCase().includes(q) ||
    roleLabel(m.role).toLowerCase().includes(q)
  );
}

// ── Component ──────────────────────────────────────────────

interface Props {
  schoolId: string;
  /** Exclude this user ID from the list (the current sender). */
  excludeId?: string;
  value: string;
  onChange: (userId: string, displayName: string) => void;
}

export function UserSearchCombobox({ schoolId, excludeId, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<Category>("all");

  const { data: members = [], isLoading } = useSchoolMembers(schoolId);

  const eligible = React.useMemo(
    () => members.filter((m) => m.id !== excludeId),
    [members, excludeId],
  );

  const filtered = React.useMemo(() => {
    return eligible.filter((m) => {
      if (category !== "all" && getCategory(m.role) !== category) return false;
      return matchesSearch(m, search);
    });
  }, [eligible, category, search]);

  // Group the filtered list for display
  const groups = React.useMemo(() => {
    if (category !== "all") {
      // Single group when a specific category is selected
      return [{ label: CATEGORIES.find((c) => c.value === category)!.label, members: filtered }];
    }
    const staff = filtered.filter((m) => getCategory(m.role) === "staff");
    const parents = filtered.filter((m) => getCategory(m.role) === "parents");
    const students = filtered.filter((m) => getCategory(m.role) === "students");
    const other = filtered.filter((m) => getCategory(m.role) === "other");
    return [
      { label: "Staff", members: staff },
      { label: "Parents", members: parents },
      { label: "Students", members: students },
      { label: "Other", members: other },
    ].filter((g) => g.members.length > 0);
  }, [filtered, category]);

  const selected = eligible.find((m) => m.id === value) ?? null;

  function handleSelect(member: SchoolMember) {
    onChange(member.id, displayName(member));
    setSearch("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSearch(""); }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading members…
            </span>
          ) : selected ? (
            <span className="flex items-center gap-2 truncate">
              <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{displayName(selected)}</span>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                — {roleLabel(selected.role)}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select recipient…</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        {/* Category filter tabs */}
        <div className="flex gap-1 border-b px-2 pt-2 pb-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                category === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search + results — shouldFilter=false so we control filtering */}
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by name or role…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {filtered.length === 0 ? (
              <CommandEmpty>No members found.</CommandEmpty>
            ) : (
              groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.members.map((m) => (
                    <CommandItem
                      key={m.id}
                      value={m.id}
                      onSelect={() => handleSelect(m)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          value === m.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block truncate text-sm">{displayName(m)}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {roleLabel(m.role)}
                          {m.email && m.full_name ? ` · ${m.email}` : ""}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
