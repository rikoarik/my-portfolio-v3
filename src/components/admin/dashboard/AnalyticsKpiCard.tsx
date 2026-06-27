export function AnalyticsKpiCard({
  label,
  value,
  subtext,
  suffix = "",
}: {
  label: string;
  value: number;
  subtext: string;
  suffix?: string;
}) {
  return (
    <article className="admin-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight">
        {value.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{subtext}</p>
    </article>
  );
}
