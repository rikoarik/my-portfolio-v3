import type { ReferrerCategory } from "@/lib/analytics/referrer";

const LABELS: Record<ReferrerCategory, { label: string; color: string }> = {
  organic: { label: "Organic search", color: "#22c55e" },
  direct: { label: "Direct", color: "#2563eb" },
  social: { label: "Social", color: "#a855f7" },
  referral: { label: "Referral", color: "#f59e0b" },
};

export function SeoBreakdownCard({
  breakdown,
}: {
  breakdown: Record<ReferrerCategory, number>;
}) {
  const total = Object.values(breakdown).reduce((sum, n) => sum + n, 0) || 1;
  const items = (Object.keys(LABELS) as ReferrerCategory[]).map((key) => ({
    key,
    ...LABELS[key],
    count: breakdown[key],
    pct: Math.round((breakdown[key] / total) * 100),
  }));

  return (
    <article className="admin-card p-4 md:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Traffic sources (7d)</h3>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Organic vs direct vs social vs referral.
        </p>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium">{item.label}</span>
              <span className="text-[var(--muted-foreground)]">
                {item.count} · {item.pct}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#eef2f7]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${item.pct}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
