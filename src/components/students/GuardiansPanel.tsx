import { Mail, Phone, MessageCircle, Shield, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/school/EmptyState";
import { useGuardians } from "@/lib/students/hooks";

export function GuardiansPanel({ studentId }: { studentId: string }) {
  const { data = [] } = useGuardians(studentId);
  if (!data.length) {
    return <EmptyState icon={User} title="No guardians recorded" description="Add parent or guardian contact details for this student." />;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((g) => (
        <Card key={g.id} className="shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{g.full_name}</CardTitle>
              <div className="flex gap-1.5">
                {g.is_primary && <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary text-[10px]">Primary</Badge>}
                {g.is_emergency && <Badge variant="outline" className="border-rose-500/20 bg-rose-500/10 text-rose-600 text-[10px]"><Shield className="mr-1 h-3 w-3" />Emergency</Badge>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{g.relationship}{g.occupation ? ` · ${g.occupation}` : ""}</p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {g.email && <Row icon={Mail}>{g.email}</Row>}
            {g.phone && <Row icon={Phone}>{g.phone}</Row>}
            {g.whatsapp && <Row icon={MessageCircle}>{g.whatsapp}</Row>}
            {g.address && <p className="text-xs text-muted-foreground">{g.address}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Row({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{children}</span>
    </div>
  );
}