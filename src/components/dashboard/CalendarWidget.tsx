import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const events = new Set([4, 12, 18, 19, 24]);
const today = 18;

export function CalendarWidget() {
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = i - 2;
    return d > 0 && d <= 30 ? d : null;
  });

  return (
    <Card className="rounded-2xl border-border/70 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">June 2026</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {days.map((d, i) => (
            <div key={i} className="py-1">{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((d, i) => (
            <button
              key={i}
              disabled={d === null}
              className={cn(
                "relative aspect-square rounded-lg text-xs font-medium transition-colors",
                d === null && "opacity-0",
                d !== null && "hover:bg-muted",
                d === today && "bg-primary text-primary-foreground font-semibold shadow-glow hover:bg-primary",
              )}
            >
              {d ?? ""}
              {d !== null && events.has(d) && d !== today && (
                <span className="absolute inset-x-0 bottom-1 mx-auto h-1 w-1 rounded-full bg-accent-brand" />
              )}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-3">
          <div className="flex items-start gap-2.5">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent-brand" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold">Inter-house sports day</p>
              <p className="text-[11px] text-muted-foreground">Today · 9:00 AM</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold">PTA meeting</p>
              <p className="text-[11px] text-muted-foreground">Thu, Jun 24 · 4:00 PM</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}