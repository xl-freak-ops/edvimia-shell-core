import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

const initial = [
  { id: "1", title: "Approve Term 2 results submission", priority: "High", due: "Today", done: false },
  { id: "2", title: "Review 3 leave requests from staff", priority: "Med", due: "Today", done: false },
  { id: "3", title: "Confirm bus route changes for Primary", priority: "Low", due: "Tomorrow", done: false },
  { id: "4", title: "Sign off on June payroll", priority: "High", due: "Jun 30", done: true },
];

const priorityTone = {
  High: "bg-destructive/10 text-destructive",
  Med: "bg-warning/20 text-warning-foreground",
  Low: "bg-muted text-muted-foreground",
} as const;

export function TasksWidget() {
  const [tasks, setTasks] = useState(initial);
  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <Card className="rounded-2xl border-border/70 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Your tasks</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">{remaining} remaining today</p>
        </div>
        <Badge variant="outline" className="rounded-full text-[10px]">
          {tasks.length} total
        </Badge>
      </CardHeader>
      <CardContent className="space-y-1">
        {tasks.map((t) => (
          <label
            key={t.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50"
          >
            <Checkbox
              checked={t.done}
              onCheckedChange={(v) =>
                setTasks((cur) => cur.map((x) => (x.id === t.id ? { ...x, done: !!v } : x)))
              }
            />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-sm font-medium",
                  t.done && "text-muted-foreground line-through",
                )}
              >
                {t.title}
              </p>
              <p className="text-[11px] text-muted-foreground">Due {t.due}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                priorityTone[t.priority as keyof typeof priorityTone],
              )}
            >
              {t.priority}
            </span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}