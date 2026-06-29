import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const items = [
  { who: "Ms. Folake", action: "submitted Term 2 Math results for", target: "JSS 2A", time: "5 min ago", initials: "FA", tone: "success" },
  { who: "Bursary", action: "received fee payment of ₦240,000 from", target: "K. Adewale", time: "32 min ago", initials: "BU", tone: "info" },
  { who: "Mr. Daniel", action: "marked attendance for", target: "Primary 5", time: "1h ago", initials: "DA", tone: "default" },
  { who: "Edvi AI", action: "flagged 4 students with declining performance in", target: "SS 3", time: "2h ago", initials: "AI", tone: "brand" },
  { who: "Admin", action: "published the school newsletter to", target: "All parents", time: "Yesterday", initials: "AD", tone: "default" },
];

const toneMap = {
  success: "bg-success/15 text-success",
  info: "bg-info/15 text-info",
  brand: "bg-accent-brand/15 text-accent-brand",
  default: "bg-muted text-foreground",
} as const;

export function ActivityFeed() {
  return (
    <Card className="rounded-2xl border-border/70 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Recent activity</CardTitle>
        <Badge variant="secondary" className="rounded-full text-[10px] font-semibold">
          Live
        </Badge>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((it, i) => (
          <div
            key={i}
            className="group flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className={`text-[10px] font-semibold ${toneMap[it.tone as keyof typeof toneMap]}`}>
                {it.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug">
                <span className="font-semibold">{it.who}</span>{" "}
                <span className="text-muted-foreground">{it.action}</span>{" "}
                <span className="font-medium">{it.target}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{it.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}