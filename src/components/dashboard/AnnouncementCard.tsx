import { Card } from "@/components/ui/card";
import { Megaphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnnouncementCard() {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-primary via-primary to-[oklch(0.42_0.2_265)] p-6 text-primary-foreground shadow-elevated">
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent-brand/30 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
          <Sparkles className="h-3 w-3" /> Edvi insight
        </div>
        <h3 className="text-xl font-bold leading-tight tracking-tight">
          Attendance dipped 4% in Primary 4 this week.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-primary-foreground/85">
          Edvi noticed a pattern around Wednesday afternoons. Want a suggested intervention plan for the class teacher?
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            size="sm"
            className="rounded-lg bg-white text-primary shadow-soft hover:bg-white/90"
          >
            Generate plan
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-lg text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
          >
            Dismiss
          </Button>
        </div>
      </div>
      <Megaphone className="absolute right-5 top-5 h-5 w-5 text-primary-foreground/40" />
    </Card>
  );
}