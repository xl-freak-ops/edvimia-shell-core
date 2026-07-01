import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, Upload, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useClasses, useArms } from "@/lib/school/hooks";
import {
  useCreateStudent,
  uploadStudentAsset,
  generateAdmissionNumber,
  generateStudentCode,
} from "@/lib/students/hooks";
import type { TablesInsert } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type Gender = "male" | "female" | "other";

type State = {
  photo?: File;
  photoPreview?: string;
  first_name: string;
  middle_name: string;
  surname: string;
  gender: Gender;
  date_of_birth: string;
  religion: string;
  nationality: string;
  state_of_origin: string;
  lga: string;
  home_address: string;
  blood_group: string;
  genotype: string;
  medical_conditions: string;
  disabilities: string;
  previous_school: string;
  admission_date: string;
  admission_number: string;
  student_code: string;
  class_id: string;
  arm_id: string;
  house: string;
  transport_route: string;
  hostel: string;
  // guardians
  father_name: string;
  mother_name: string;
  guardian_name: string;
  relationship: string;
  occupation: string;
  email: string;
  phone: string;
  whatsapp: string;
  guardian_address: string;
  emergency_contact: string;
};

const STEPS = [
  { key: "personal", title: "Personal Information" },
  { key: "academic", title: "Admission & Class" },
  { key: "guardian", title: "Parent / Guardian" },
  { key: "review", title: "Review & Submit" },
];

function empty(): State {
  return {
    first_name: "",
    middle_name: "",
    surname: "",
    gender: "male",
    date_of_birth: "",
    religion: "",
    nationality: "Nigerian",
    state_of_origin: "",
    lga: "",
    home_address: "",
    blood_group: "",
    genotype: "",
    medical_conditions: "",
    disabilities: "",
    previous_school: "",
    admission_date: new Date().toISOString().slice(0, 10),
    admission_number: generateAdmissionNumber(),
    student_code: generateStudentCode(),
    class_id: "",
    arm_id: "",
    house: "",
    transport_route: "",
    hostel: "",
    father_name: "",
    mother_name: "",
    guardian_name: "",
    relationship: "Parent",
    occupation: "",
    email: "",
    phone: "",
    whatsapp: "",
    guardian_address: "",
    emergency_contact: "",
  };
}

export function StudentWizard() {
  const navigate = useNavigate();
  const { school } = useAuth();
  const schoolId = school?.id ?? "";
  const { data: classes = [] } = useClasses(schoolId);
  const { data: arms = [] } = useArms(schoolId);
  const create = useCreateStudent(schoolId);

  const [step, setStep] = useState(0);
  const [state, setState] = useState<State>(empty);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof State>(k: K, v: State[K]) => setState((s) => ({ ...s, [k]: v }));

  const filteredArms = useMemo(
    () => arms.filter((a) => !state.class_id || a.class_id === state.class_id),
    [arms, state.class_id],
  );

  const canNext = useMemo(() => {
    if (step === 0) return state.first_name && state.surname && state.gender;
    if (step === 1) return state.admission_number && state.student_code && state.admission_date;
    if (step === 2) return state.father_name || state.mother_name || state.guardian_name;
    return true;
  }, [step, state]);

  const onPhoto = (file: File) => {
    const url = URL.createObjectURL(file);
    setState((s) => ({ ...s, photo: file, photoPreview: url }));
  };

  async function submit() {
    if (!schoolId) return toast.error("No school context");
    setSaving(true);
    try {
      let photoUrl: string | undefined;
      if (state.photo) {
        const { signedUrl } = await uploadStudentAsset(schoolId, state.student_code, "photo", state.photo);
        photoUrl = signedUrl;
      }
      const student: TablesInsert<"students"> = {
        school_id: schoolId,
        admission_number: state.admission_number,
        student_code: state.student_code,
        photo_url: photoUrl,
        first_name: state.first_name,
        middle_name: state.middle_name || null,
        surname: state.surname,
        gender: state.gender,
        date_of_birth: state.date_of_birth || null,
        religion: state.religion || null,
        nationality: state.nationality || null,
        state_of_origin: state.state_of_origin || null,
        lga: state.lga || null,
        home_address: state.home_address || null,
        blood_group: state.blood_group || null,
        genotype: state.genotype || null,
        medical_conditions: state.medical_conditions || null,
        disabilities: state.disabilities || null,
        previous_school: state.previous_school || null,
        admission_date: state.admission_date,
        class_id: state.class_id || null,
        arm_id: state.arm_id || null,
        house: state.house || null,
        transport_route: state.transport_route || null,
        hostel: state.hostel || null,
      };
      const guardians: Omit<TablesInsert<"student_guardians">, "student_id" | "school_id">[] = [];
      if (state.father_name)
        guardians.push({ relationship: "Father", full_name: state.father_name, phone: state.phone || null, email: state.email || null, is_primary: true });
      if (state.mother_name)
        guardians.push({ relationship: "Mother", full_name: state.mother_name, whatsapp: state.whatsapp || null });
      if (state.guardian_name)
        guardians.push({ relationship: state.relationship, full_name: state.guardian_name, occupation: state.occupation || null, address: state.guardian_address || null });
      if (state.emergency_contact)
        guardians.push({ relationship: "Emergency Contact", full_name: state.emergency_contact, is_emergency: true });

      const created = await create.mutateAsync({ student, guardians });
      toast.success("Student admitted successfully");
      navigate({ to: "/students/$id", params: { id: created.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create student");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition",
                i < step && "bg-primary text-primary-foreground",
                i === step && "bg-primary text-primary-foreground shadow-glow",
                i > step && "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <div className="hidden min-w-0 flex-1 sm:block">
              <div className={cn("truncate text-xs font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>
                {s.title}
              </div>
            </div>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-6 md:p-8">
          {step === 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2 flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={state.photoPreview} />
                  <AvatarFallback className="bg-primary/10 text-primary"><User className="h-8 w-8" /></AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="photo" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Passport Photograph
                  </Label>
                  <label htmlFor="photo" className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent">
                    <Upload className="h-4 w-4" /> Upload photo
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onPhoto(e.target.files[0])}
                  />
                </div>
              </div>
              <Field label="First name" v={state.first_name} onChange={(v) => set("first_name", v)} required />
              <Field label="Middle name" v={state.middle_name} onChange={(v) => set("middle_name", v)} />
              <Field label="Surname" v={state.surname} onChange={(v) => set("surname", v)} required />
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={state.gender} onValueChange={(v) => set("gender", v as Gender)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field type="date" label="Date of birth" v={state.date_of_birth} onChange={(v) => set("date_of_birth", v)} />
              <Field label="Religion" v={state.religion} onChange={(v) => set("religion", v)} />
              <Field label="Nationality" v={state.nationality} onChange={(v) => set("nationality", v)} />
              <Field label="State of origin" v={state.state_of_origin} onChange={(v) => set("state_of_origin", v)} />
              <Field label="LGA" v={state.lga} onChange={(v) => set("lga", v)} />
              <div className="md:col-span-2">
                <Label className="mb-2 block">Home address</Label>
                <Textarea value={state.home_address} onChange={(e) => set("home_address", e.target.value)} rows={2} />
              </div>
              <Field label="Blood group" v={state.blood_group} onChange={(v) => set("blood_group", v)} placeholder="O+" />
              <Field label="Genotype" v={state.genotype} onChange={(v) => set("genotype", v)} placeholder="AA" />
              <div className="md:col-span-2">
                <Label className="mb-2 block">Medical conditions</Label>
                <Textarea value={state.medical_conditions} onChange={(e) => set("medical_conditions", e.target.value)} rows={2} />
              </div>
              <div className="md:col-span-2">
                <Label className="mb-2 block">Disabilities (optional)</Label>
                <Textarea value={state.disabilities} onChange={(e) => set("disabilities", e.target.value)} rows={2} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Previous school" v={state.previous_school} onChange={(v) => set("previous_school", v)} />
              <Field type="date" label="Admission date" v={state.admission_date} onChange={(v) => set("admission_date", v)} required />
              <Field label="Admission number" v={state.admission_number} onChange={(v) => set("admission_number", v)} required />
              <Field label="Student ID" v={state.student_code} onChange={(v) => set("student_code", v)} required />
              <div className="space-y-2">
                <Label>Current class</Label>
                <Select value={state.class_id} onValueChange={(v) => { set("class_id", v); set("arm_id", ""); }}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Arm</Label>
                <Select value={state.arm_id} onValueChange={(v) => set("arm_id", v)} disabled={!state.class_id}>
                  <SelectTrigger><SelectValue placeholder="Select arm" /></SelectTrigger>
                  <SelectContent>
                    {filteredArms.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Field label="School house" v={state.house} onChange={(v) => set("house", v)} placeholder="Blue / Red / …" />
              <Field label="Transport route (optional)" v={state.transport_route} onChange={(v) => set("transport_route", v)} />
              <Field label="Hostel (optional)" v={state.hostel} onChange={(v) => set("hostel", v)} />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Father's name" v={state.father_name} onChange={(v) => set("father_name", v)} />
              <Field label="Mother's name" v={state.mother_name} onChange={(v) => set("mother_name", v)} />
              <Field label="Guardian name" v={state.guardian_name} onChange={(v) => set("guardian_name", v)} />
              <Field label="Relationship" v={state.relationship} onChange={(v) => set("relationship", v)} />
              <Field label="Occupation" v={state.occupation} onChange={(v) => set("occupation", v)} />
              <Field type="email" label="Email" v={state.email} onChange={(v) => set("email", v)} />
              <Field label="Phone" v={state.phone} onChange={(v) => set("phone", v)} />
              <Field label="WhatsApp number" v={state.whatsapp} onChange={(v) => set("whatsapp", v)} />
              <div className="md:col-span-2">
                <Label className="mb-2 block">Home address</Label>
                <Textarea value={state.guardian_address} onChange={(e) => set("guardian_address", e.target.value)} rows={2} />
              </div>
              <Field label="Emergency contact" v={state.emergency_contact} onChange={(v) => set("emergency_contact", v)} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <ReviewGrid state={state} classes={classes} arms={arms} />
            </div>
          )}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => (step === 0 ? navigate({ to: "/students" }) : setStep((s) => s - 1))} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button className="gap-2" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="gap-2" disabled={saving} onClick={submit}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Submit admission
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label, v, onChange, type = "text", required, placeholder,
}: {
  label: string; v: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <Input type={type} value={v} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ReviewGrid({ state, classes, arms }: { state: State; classes: { id: string; name: string }[]; arms: { id: string; name: string }[] }) {
  const className = classes.find((c) => c.id === state.class_id)?.name;
  const armName = arms.find((a) => a.id === state.arm_id)?.name;
  const rows: [string, string][] = [
    ["Name", `${state.surname} ${state.first_name} ${state.middle_name}`.trim()],
    ["Gender", state.gender],
    ["Date of birth", state.date_of_birth || "—"],
    ["Admission no", state.admission_number],
    ["Student ID", state.student_code],
    ["Class", className ? `${className}${armName ? " · " + armName : ""}` : "—"],
    ["House", state.house || "—"],
    ["Nationality", state.nationality || "—"],
    ["State / LGA", [state.state_of_origin, state.lga].filter(Boolean).join(" / ") || "—"],
    ["Guardian", state.father_name || state.mother_name || state.guardian_name || "—"],
    ["Phone", state.phone || "—"],
    ["Emergency", state.emergency_contact || "—"],
  ];
  return (
    <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-start justify-between border-b border-border/60 pb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k}</span>
          <span className="text-sm font-medium text-foreground">{v}</span>
        </div>
      ))}
    </div>
  );
}