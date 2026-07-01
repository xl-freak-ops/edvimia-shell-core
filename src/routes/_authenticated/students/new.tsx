import { createFileRoute } from "@tanstack/react-router";
import { StudentWizard } from "@/components/students/StudentWizard";

export const Route = createFileRoute("/_authenticated/students/new")({
  component: NewStudentPage,
});

function NewStudentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Admission</h1>
        <p className="text-sm text-muted-foreground">Enrol a new student with their personal, academic and guardian records.</p>
      </div>
      <StudentWizard />
    </div>
  );
}