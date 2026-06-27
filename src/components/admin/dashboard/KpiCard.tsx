import Link from "next/link";

export function KpiCard({
  label,
  value,
  subtext,
  href,
}: {
  label: string;
  value: number;
  subtext: string;
  href: string;
}) {
  return (
    <article className="admin-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{subtext}</p>
      <Link href={href} className="mt-3 inline-block text-xs font-medium text-[var(--primary)] hover:underline">
        View all
      </Link>
    </article>
  );
}
