export function TopPagesTable({
  rows,
}: {
  rows: { path: string; views: number; share: number }[];
}) {
  return (
    <article className="admin-card overflow-hidden">
      <div className="border-b border-[var(--border)] px-4 py-3 md:px-5">
        <h3 className="text-sm font-semibold">Top pages (30d)</h3>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">Most viewed paths.</p>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-[var(--muted-foreground)] md:px-5">
          No page views recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                <th className="px-4 py-2 font-medium md:px-5">Path</th>
                <th className="px-4 py-2 font-medium md:px-5">Views</th>
                <th className="px-4 py-2 font-medium md:px-5">Share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.path} className="border-b border-[var(--border)] last:border-0">
                  <td className="max-w-[240px] truncate px-4 py-2 font-mono text-xs md:px-5">
                    {row.path}
                  </td>
                  <td className="px-4 py-2 md:px-5">{row.views.toLocaleString()}</td>
                  <td className="px-4 py-2 md:px-5">{row.share}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
