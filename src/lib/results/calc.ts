import type { Tables } from "@/integrations/supabase/types";

export type Component = Tables<"assessment_components">;
export type Score = Tables<"result_scores">;
export type GradeScale = Tables<"grade_scales">;

export type ComputedRow = {
  studentId: string;
  total: number;
  max: number;
  percentage: number;
  grade: string | null;
  remark: string | null;
  position: number | null;
  scores: Record<string, number | null>;
};

/** Compute weighted total for a single student across enabled components. */
export function computeStudentTotal(
  scores: Pick<Score, "component_id" | "score">[],
  components: Component[],
): { total: number; max: number; percentage: number } {
  const enabled = components.filter((c) => c.is_enabled);
  let total = 0;
  let max = 0;
  for (const c of enabled) {
    const w = Number(c.weight) || 0;
    const ms = Number(c.max_score) || 0;
    max += w;
    const s = scores.find((x) => x.component_id === c.id);
    const v = s?.score == null ? null : Number(s.score);
    if (v != null && ms > 0) total += (v / ms) * w;
  }
  const pct = max > 0 ? Math.round((total / max) * 10000) / 100 : 0;
  return { total: Math.round(total * 100) / 100, max, percentage: pct };
}

/** Resolve grade + remark from a school's grade scale for a given percentage. */
export function resolveGrade(
  percentage: number,
  scale: GradeScale[],
): { grade: string | null; remark: string | null } {
  const band = scale.find(
    (g) => percentage >= Number(g.min_score) && percentage <= Number(g.max_score),
  );
  return { grade: band?.grade ?? null, remark: band?.remark ?? null };
}

/** Build ranked rows for a subject sheet. Position uses "1224" ranking. */
export function computeSheetRows(
  studentIds: string[],
  scores: Score[],
  components: Component[],
  scale: GradeScale[],
): ComputedRow[] {
  const rows: ComputedRow[] = studentIds.map((sid) => {
    const my = scores.filter((s) => s.student_id === sid);
    const t = computeStudentTotal(my, components);
    const g = resolveGrade(t.percentage, scale);
    const scoreMap: Record<string, number | null> = {};
    for (const c of components) {
      const found = my.find((x) => x.component_id === c.id);
      scoreMap[c.id] = found?.score == null ? null : Number(found.score);
    }
    return {
      studentId: sid,
      total: t.total,
      max: t.max,
      percentage: t.percentage,
      grade: g.grade,
      remark: g.remark,
      position: null,
      scores: scoreMap,
    };
  });
  // Rank
  const sorted = [...rows].sort((a, b) => b.percentage - a.percentage);
  let lastPct = -1;
  let lastPos = 0;
  sorted.forEach((r, i) => {
    if (r.percentage !== lastPct) {
      lastPos = i + 1;
      lastPct = r.percentage;
    }
    r.position = r.percentage > 0 ? lastPos : null;
  });
  return rows;
}

export function ordinal(n: number | null | undefined): string {
  if (n == null) return "—";
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function validateScore(v: number, max: number): string | null {
  if (Number.isNaN(v)) return "Not a number";
  if (v < 0) return "Cannot be negative";
  if (v > max) return `Max is ${max}`;
  return null;
}