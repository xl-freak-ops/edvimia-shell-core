import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const rows = [
  { name: "Chiamaka Eze", id: "STU-1042", class: "JSS 2A", status: "Active", fee: "Paid", initials: "CE" },
  { name: "Tunde Bakare", id: "STU-1043", class: "SS 1B", status: "Active", fee: "Partial", initials: "TB" },
  { name: "Amara Nwosu", id: "STU-1044", class: "Primary 5", status: "Active", fee: "Paid", initials: "AN" },
  { name: "Kelechi Obi", id: "STU-1045", class: "JSS 3C", status: "On leave", fee: "Pending", initials: "KO" },
  { name: "Fatima Ahmed", id: "STU-1046", class: "SS 3A", status: "Active", fee: "Paid", initials: "FA" },
];

const statusTone = {
  Active: "bg-success/15 text-success border-success/20",
  "On leave": "bg-warning/20 text-warning-foreground border-warning/30",
} as const;

const feeTone = {
  Paid: "bg-success/10 text-success",
  Partial: "bg-info/10 text-info",
  Pending: "bg-destructive/10 text-destructive",
} as const;

export function RecentStudentsTable() {
  return (
    <Card className="rounded-2xl border-border/70 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Recently enrolled</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">Latest 5 admissions this week</p>
        </div>
        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs">
          View all
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-2 font-semibold">Student</th>
                <th className="px-3 py-2 font-semibold">Class</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Fees</th>
                <th className="px-6 py-2 text-right font-semibold">ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="group border-b border-border/50 transition-colors last:border-0 hover:bg-muted/40">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-accent-brand/80 text-[10px] font-semibold text-primary-foreground">
                          {r.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{r.class}</td>
                  <td className="px-3 py-3">
                    <Badge variant="outline" className={cn("rounded-full text-[10px]", statusTone[r.status as keyof typeof statusTone])}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", feeTone[r.fee as keyof typeof feeTone])}>
                      {r.fee}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-[11px] text-muted-foreground">{r.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}