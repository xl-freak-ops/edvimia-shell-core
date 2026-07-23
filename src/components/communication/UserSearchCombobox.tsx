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
  const { data: members = [], isLoading } = useSchoolMembers(schoolId);

  const eligible = React.useMemo(
    () => members.filter((m) => m.id !== excludeId),
    [members, excludeId],
  );

  const selected = eligible.find((m) => m.id === value) ?? null;

  // Group members by category
  const groups = React.useMemo(() => {
    const staff: SchoolMember[] = [];
    const parents: SchoolMember[] = [];
    const students: SchoolMember[] = [];
    const other: SchoolMember[] = [];

    for (const m of eligible) {
      const cat = getCategory(m.role);
      if (cat === "staff") staff.push(m);
      else if (cat === "parents") parents.push(m);
      else if (cat === "students") students.push(m);
      else other.push(m);
    }

    return [
      { label: "Staff", members: staff },
      { label: "Parents", members: parents },
      { label: "Students", members: students },
      { label: "Other", members: other },
    ].filter((g) => g.members.length > 0);
  }, [eligible]);

  function displayName(m: SchoolMember) {
    return m.full_name?.trim() || m.email || m.id;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            <span className="text-muted-foreground">Search by name or role…</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command
          filter={(value, search) => {
            // value is member.id; find the member and search against name + role
            const m = eligible.find((m) => m.id === value);
            if (!m) return 0;
            const haystack = [m.full_name, m.email, roleLabel(m.role)]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return haystack.includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Search name or role…" />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.members.map((m) => (
                  <CommandItem
                    key={m.id}
                    value={m.id}
                    onSelect={() => {
                      onChange(m.id, displayName(m));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        value === m.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{displayName(m)}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {roleLabel(m.role)}
                        {m.email && m.full_name ? ` · ${m.email}` : ""}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
