export function StatLegendCard({
  items,
}: {
  items: { label: string; published: number; draft: number; color: string }[];
}) {
  return (
    <article className="admin-card p-4 md:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Status breakdown</h3>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Ringkasan published vs draft/pending.
        </p>
      </div>
      <div className="space-y-4">
        {items.map((item) => {
          const total = Math.max(item.published + item.draft, 1);
          const publishedPct = Math.round((item.published / total) * 100);
          return (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium">{item.label}</span>
                <span className="text-[var(--muted-foreground)]">
                  {item.published} pub · {item.draft} draft
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#eef2f7]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${publishedPct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
