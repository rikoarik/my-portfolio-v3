"use client";

import { useMemo, useState } from "react";

import { FieldError } from "@/components/admin/FieldError";
import { ListEditor } from "@/components/admin/ListEditor";
import { Textarea } from "@/components/ui/textarea";
import { serializeCaseStudyJson } from "@/lib/admin/case-study";
import type { Project } from "@/types/portfolio";

type CaseStudy = NonNullable<Project["case_study"]>;

export function CaseStudyEditor({
  initial,
  errors,
  compact,
}: {
  initial?: CaseStudy | null;
  errors?: string[];
  compact?: boolean;
}) {
  const [problem, setProblem] = useState(initial?.problem ?? "");
  const [solution, setSolution] = useState(initial?.solution ?? "");
  const [constraints, setConstraints] = useState(initial?.constraints ?? []);
  const [results, setResults] = useState(initial?.results ?? []);

  const jsonValue = useMemo(
    () => serializeCaseStudyJson({ problem, solution, constraints, results }),
    [problem, solution, constraints, results],
  );

  const rows = compact ? 2 : 3;

  return (
    <div className="space-y-2 rounded border border-[var(--border)] p-2">
      <input type="hidden" name="case_study" value={jsonValue} />
      <p className="text-[10px] font-medium text-[var(--muted-foreground)]">Case study (opsional)</p>
      <div className="grid gap-2 md:grid-cols-2">
        <Textarea
          id="case_study_problem"
          rows={rows}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Problem"
          className="min-h-0 resize-y text-xs"
          aria-label="Problem"
        />
        <Textarea
          id="case_study_solution"
          rows={rows}
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="Solution"
          className="min-h-0 resize-y text-xs"
          aria-label="Solution"
        />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <ListEditor
          name="_constraints"
          initialEntries={constraints}
          onEntriesChange={setConstraints}
          hideFromSubmit
        />
        <ListEditor
          name="_results"
          initialEntries={results}
          onEntriesChange={setResults}
          hideFromSubmit
        />
      </div>
      <FieldError errors={errors} />
    </div>
  );
}
