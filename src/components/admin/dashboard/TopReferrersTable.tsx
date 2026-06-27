function displayReferrer(referrer: string) {
  if (referrer === "(direct)") return "Direct / none";
  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer;
  }
}

export function TopReferrersTable({
  rows,
}: {
  rows: { referrer: string; views: number }[];
}) {
  return (
    <article className="admin-card overflow-hidden">
      <div className="border-b border-[var(--border)] px-4 py-3 md:px-5">
        <h3 className="text-sm font-semibold">Top referrers (30d)</h3>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">Where visitors come from.</p>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-[var(--muted-foreground)] md:px-5">
          No referrer data yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                <th className="px-4 py-2 font-medium md:px-5">Referrer</th>
                <th className="px-4 py-2 font-medium md:px-5">Views</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.referrer} className="border-b border-[var(--border)] last:border-0">
                  <td className="max-w-[280px] truncate px-4 py-2 md:px-5" title={row.referrer}>
                    {displayReferrer(row.referrer)}
                  </td>
                  <td className="px-4 py-2 md:px-5">{row.views.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
