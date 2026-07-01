import { useRef, useState } from "react";
import { FileText, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useStudentDocs, uploadStudentAsset, studentKeys } from "@/lib/students/hooks";
import { EmptyState } from "@/components/school/EmptyState";

const KINDS = [
  { value: "birth_certificate", label: "Birth Certificate" },
  { value: "passport_photo", label: "Passport Photo" },
  { value: "previous_result", label: "Previous Result" },
  { value: "transfer_letter", label: "Transfer Letter" },
  { value: "medical_report", label: "Medical Report" },
  { value: "other", label: "Other" },
];

export function DocumentsPanel({ studentId, schoolId }: { studentId: string; schoolId: string }) {
  const { data = [] } = useStudentDocs(studentId);
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState("birth_certificate");
  const [busy, setBusy] = useState(false);

  async function onFile(file: File) {
    setBusy(true);
    try {
      const { path, signedUrl } = await uploadStudentAsset(schoolId, studentId, kind, file);
      const { error } = await supabase.from("student_documents").insert({
        student_id: studentId,
        school_id: schoolId,
        kind,
        file_name: file.name,
        file_path: path,
        file_url: signedUrl,
        mime_type: file.type,
        size_bytes: file.size,
      });
      if (error) throw error;
      toast.success("Document uploaded");
      qc.invalidateQueries({ queryKey: studentKeys.docs(studentId) });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select value={kind} onValueChange={setKind}>
          <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            {KINDS.map((k) => <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        <Button size="sm" className="gap-2" disabled={busy} onClick={() => inputRef.current?.click()}>
          <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Upload document"}
        </Button>
      </div>

      {data.length === 0 ? (
        <EmptyState icon={FileText} title="No documents yet" description="Upload birth certificates, previous results and other records here." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((d) => (
            <Card key={d.id} className="shadow-soft">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold capitalize">{d.kind.replace(/_/g, " ")}</div>
                  <div className="truncate text-xs text-muted-foreground">{d.file_name}</div>
                </div>
                {d.file_url && (
                  <Button size="icon" variant="ghost" asChild>
                    <a href={d.file_url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}