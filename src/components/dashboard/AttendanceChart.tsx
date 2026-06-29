import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const data = [
  { day: "Mon", present: 92, absent: 8 },
  { day: "Tue", present: 95, absent: 5 },
  { day: "Wed", present: 88, absent: 12 },
  { day: "Thu", present: 96, absent: 4 },
  { day: "Fri", present: 90, absent: 10 },
  { day: "Sat", present: 78, absent: 22 },
  { day: "Sun", present: 0, absent: 0 },
];

export function AttendanceChart() {
  return (
    <Card className="rounded-2xl border-border/70 shadow-soft">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Weekly attendance</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Average <span className="font-semibold text-foreground">91.4%</span> · 1,284 students tracked
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" /> Present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Absent
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex h-48 items-end gap-3 sm:gap-5">
          {data.map((d) => {
            const total = d.present + d.absent || 1;
            return (
              <div key={d.day} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-full w-full max-w-[44px] flex-col justify-end overflow-hidden rounded-lg bg-muted/50 transition-colors group-hover:bg-muted">
                  <div
                    className="absolute inset-x-0 bottom-0 bg-muted-foreground/25"
                    style={{ height: `${(d.absent / total) * 100}%` }}
                  />
                  <div
                    className="relative rounded-b-lg bg-gradient-to-t from-primary to-primary/70 transition-all"
                    style={{ height: `${d.present}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">{d.day}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}