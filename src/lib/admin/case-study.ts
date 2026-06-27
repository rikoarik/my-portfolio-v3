export type CaseStudyShape = {
  problem: string;
  constraints: string[];
  solution: string;
  results: string[];
};

/** Returns empty string when case study is blank (all fields empty). */
export function serializeCaseStudyJson(parts: CaseStudyShape): string {
  const problem = parts.problem.trim();
  const solution = parts.solution.trim();
  const constraints = parts.constraints.map((s) => s.trim()).filter(Boolean);
  const results = parts.results.map((s) => s.trim()).filter(Boolean);

  if (!problem && !solution && constraints.length === 0 && results.length === 0) {
    return "";
  }

  return JSON.stringify({ problem, solution, constraints, results });
}
