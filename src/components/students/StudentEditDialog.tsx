import * as React from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateStudent } from "@/lib/students/hooks";
import { useClasses, useArms } from "@/lib/school/hooks";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { Tables } from "@/integrations/supabase/types";

type Student = Tables<"students">;

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function StudentEditDialog({
  student,
  open,
  onOpenChange,
}: {
  student: Student;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { school } = useAuth();
  const schoolId = school?.id ?? "";
  const update = useUpdateStudent(schoolId);
  const { data: classes = [] } = useClasses(schoolId);
  const { data: arms = [] } = useArms(schoolId);

  const filteredArms = React.useMemo(
    () => arms.filter((a) => !form.class_id || a.class_id === form.class_id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arms, student.class_id],
  );

  const [form, setForm] = React.useState(() => ({
    first_name: student.first_name ?? "",
    middle_name: student.middle_name ?? "",
    surname: student.surname ?? "",
    gender: student.gender ?? "male",
    date_of_birth: student.date_of_birth ?? "",
    religion: student.religion ?? "",
    nationality: student.nationality ?? "",
    state_of_origin: student.state_of_origin ?? "",
    lga: student.lga ?? "",
    home_address: student.home_address ?? "",
    admission_number: student.admission_number ?? "",
    admission_date: student.admission_date ?? "",
    class_id: student.class_id ?? "",
    arm_id: student.arm_id ?? "",
    house: student.house ?? "",
    transport_route: student.transport_route ?? "",
    hostel: student.hostel ?? "",
    previous_school: student.previous_school ?? "",
    blood_group: student.blood_group ?? "",
    genotype: student.genotype ?? "",
    medical_conditions: student.medical_conditions ?? "",
    disabilities: student.disabilities ?? "",
  }));

  // Sync form if student prop changes (e.g. after successful save)
  React.useEffect(() => {
    if (open) {
      setForm({
        first_name: student.first_name ?? "",
        middle_name: student.middle_name ?? "",
        surname: student.surname ?? "",
        gender: student.gender ?? "male",
        date_of_birth: student.date_of_birth ?? "",
        religion: student.religion ?? "",
        nationality: student.nationality ?? "",
        state_of_origin: student.state_of_origin ?? "",
        lga: student.lga ?? "",
        home_address: student.home_address ?? "",
        admission_number: student.admission_number ?? "",
        admission_date: student.admission_date ?? "",
        class_id: student.class_id ?? "",
        arm_id: student.arm_id ?? "",
        house: student.house ?? "",
        transport_route: student.transport_route ?? "",
        hostel: student.hostel ?? "",
        previous_school: student.previous_school ?? "",
        blood_group: student.blood_group ?? "",
        genotype: student.genotype ?? "",
        medical_conditions: student.medical_conditions ?? "",
        disabilities: student.disabilities ?? "",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const armsForClass = React.useMemo(
    () => arms.filter((a) => !form.class_id || a.class_id === form.class_id),
    [arms, form.class_id],
  );

  async function save() {
    try {
      await update.mutateAsync({
        id: student.id,
        patch: {
          first_name: form.first_name.trim(),
          middle_name: form.middle_name.trim() || null,
          surname: form.surname.trim(),
          gender: form.gender as Student["gender"],
          date_of_birth: form.date_of_birth || null,
          religion: form.religion || null,
          nationality: form.nationality || null,
          state_of_origin: form.state_of_origin || null,
          lga: form.lga || null,
          home_address: form.home_address || null,
          admission_number: form.admission_number.trim(),
          admission_date: form.admission_date,
          class_id: form.class_id || null,
          arm_id: form.arm_id || null,
          house: form.house || null,
          transport_route: form.transport_route || null,
          hostel: form.hostel || null,
          previous_school: form.previous_school || null,
          blood_group: form.blood_group || null,
          genotype: form.genotype || null,
          medical_conditions: form.medical_conditions || null,
          disabilities: form.disabilities || null,
        },
      });
      toast.success("Student profile updated");
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    }
  }

  // suppress unused variable lint warning
  void filteredArms;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit student profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="mt-1">
          <TabsList className="w-full">
            <TabsTrigger value="personal" className="flex-1">Personal</TabsTrigger>
            <TabsTrigger value="academic" className="flex-1">Academic</TabsTrigger>
            <TabsTrigger value="medical" className="flex-1">Medical</TabsTrigger>
          </TabsList>

          {/* ── Personal ── */}
          <TabsContent value="personal" className="mt-4 grid gap-3 sm:grid-cols-2">
            <F label="First name">
              <Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
            </F>
            <F label="Middle name">
              <Input value={form.middle_name} onChange={(e) => set("middle_name", e.target.value)} />
            </F>
            <F label="Surname">
              <Input value={form.surname} onChange={(e) => set("surname", e.target.value)} />
            </F>
            <F label="Gender">
              <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </F>
            <F label="Date of birth">
              <Input type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} />
            </F>
            <F label="Religion">
              <Input value={form.religion} onChange={(e) => set("religion", e.target.value)} />
            </F>
            <F label="Nationality">
              <Input value={form.nationality} onChange={(e) => set("nationality", e.target.value)} />
            </F>
            <F label="State of origin">
              <Input value={form.state_of_origin} onChange={(e) => set("state_of_origin", e.target.value)} />
            </F>
            <F label="LGA">
              <Input value={form.lga} onChange={(e) => set("lga", e.target.value)} />
            </F>
            <div className="sm:col-span-2">
              <F label="Home address">
                <Textarea rows={2} value={form.home_address} onChange={(e) => set("home_address", e.target.value)} />
              </F>
            </div>
          </TabsContent>

          {/* ── Academic ── */}
          <TabsContent value="academic" className="mt-4 grid gap-3 sm:grid-cols-2">
            <F label="Admission number">
              <Input value={form.admission_number} onChange={(e) => set("admission_number", e.target.value)} />
            </F>
            <F label="Admission date">
              <Input type="date" value={form.admission_date} onChange={(e) => set("admission_date", e.target.value)} />
            </F>
            <F label="Class">
              <Select
                value={form.class_id || "_none"}
                onValueChange={(v) => { set("class_id", v === "_none" ? "" : v); set("arm_id", ""); }}
              >
                <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Unassigned</SelectItem>
                  {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </F>
            <F label="Arm">
              <Select
                value={form.arm_id || "_none"}
                onValueChange={(v) => set("arm_id", v === "_none" ? "" : v)}
              >
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">—</SelectItem>
                  {armsForClass.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </F>
            <F label="House">
              <Input value={form.house} onChange={(e) => set("house", e.target.value)} placeholder="e.g. Red House" />
            </F>
            <F label="Transport route">
              <Input value={form.transport_route} onChange={(e) => set("transport_route", e.target.value)} />
            </F>
            <F label="Hostel">
              <Input value={form.hostel} onChange={(e) => set("hostel", e.target.value)} />
            </F>
            <F label="Previous school">
              <Input value={form.previous_school} onChange={(e) => set("previous_school", e.target.value)} />
            </F>
          </TabsContent>

          {/* ── Medical ── */}
          <TabsContent value="medical" className="mt-4 grid gap-3 sm:grid-cols-2">
            <F label="Blood group">
              <Select value={form.blood_group || "_none"} onValueChange={(v) => set("blood_group", v === "_none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  {["_none","A+","A-","B+","B-","AB+","AB-","O+","O-"].map((g) => (
                    <SelectItem key={g} value={g}>{g === "_none" ? "—" : g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </F>
            <F label="Genotype">
              <Select value={form.genotype || "_none"} onValueChange={(v) => set("genotype", v === "_none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  {["_none","AA","AS","SS","AC","SC"].map((g) => (
                    <SelectItem key={g} value={g}>{g === "_none" ? "—" : g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </F>
            <div className="sm:col-span-2">
              <F label="Medical conditions">
                <Textarea rows={2} value={form.medical_conditions} onChange={(e) => set("medical_conditions", e.target.value)} placeholder="List any known conditions…" />
              </F>
            </div>
            <div className="sm:col-span-2">
              <F label="Disabilities / special needs">
                <Textarea rows={2} value={form.disabilities} onChange={(e) => set("disabilities", e.target.value)} placeholder="None if left blank" />
              </F>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={!form.first_name.trim() || !form.surname.trim() || update.isPending}>
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
