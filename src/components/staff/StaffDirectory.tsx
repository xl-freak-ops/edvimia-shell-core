import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Download,
  Printer,
  MoreHorizontal,
  UserPlus,
  FileSpreadsheet,
  FileText,
  Eye,
  Users as UsersIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/school/EmptyState";
import { StaffStatusBadge, POSITION_LABELS } from "./StaffStatusBadge";
import type { Tables } from "@/integrations/supabase/types";
import { exportStaffCsv, exportStaffExcel } from "@/lib/staff/export";

type Row = Tables<"staff">;

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "S";
}

const PAGE_SIZE = 15;

export function StaffDirectory({ staff }: { staff: Row[] }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  const departments = useMemo(() => {
    const set = new Set<string>();
    staff.forEach((s) => s.department && set.add(s.department));
    return Array.from(set).sort();
  }, [staff]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return staff.filter((s) => {
      if (positionFilter !== "all" && s.position !== positionFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (deptFilter !== "all" && s.department !== deptFilter) return false;
      if (!term) return true;
      return (
        s.staff_code.toLowerCase().includes(term) ||
        s.full_name.toLowerCase().includes(term) ||
        (s.email ?? "").toLowerCase().includes(term) ||
        (s.phone ?? "").toLowerCase().includes(term)
      );
    });
  }, [staff, q, positionFilter, statusFilter, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <Card className="shadow-soft">
      <CardContent className="p-4 md:p-6">
        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(0); }}
                placeholder="Search name, staff ID, email…"
                className="pl-9"
              />
            </div>
            <Select value={positionFilter} onValueChange={(v) => { setPositionFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Position" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                {Object.entries(POSITION_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={deptFilter} onValueChange={(v) => { setDeptFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="transferred">Transferred</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportStaffCsv(filtered)}>
                  <FileText className="mr-2 h-4 w-4" /> Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportStaffExcel(filtered)}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" /> Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="gap-2" asChild>
              <Link to="/teachers/new"><UserPlus className="h-4 w-4" /> Add Staff</Link>
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No staff yet"
            description="Add your first teacher or administrator to build your directory."
            action={
              <Button size="sm" asChild>
                <Link to="/teachers/new">Add Staff</Link>
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[280px]">Staff</TableHead>
                    <TableHead>Staff ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((s) => (
                    <TableRow
                      key={s.id}
                      className="cursor-pointer"
                      onClick={() => navigate({ to: "/teachers/$id", params: { id: s.id } })}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={s.photo_url ?? undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {initials(s.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{s.full_name}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              {s.qualification ?? "—"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{s.staff_code}</TableCell>
                      <TableCell className="text-sm">{s.department ?? "—"}</TableCell>
                      <TableCell className="text-sm">{POSITION_LABELS[s.position]}</TableCell>
                      <TableCell className="text-sm">
                        <div className="truncate max-w-[180px]">{s.email ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{s.phone ?? ""}</div>
                      </TableCell>
                      <TableCell><StaffStatusBadge status={s.status} /></TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to="/teachers/$id" params={{ id: s.id }}>
                                <Eye className="mr-2 h-4 w-4" /> View profile
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <div>
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <span className="tabular-nums">Page {page + 1} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}