export default function AdminDashboardLoading() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted-foreground)]">Memuat data CMS...</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--muted)]/50"
          />
        ))}
      </div>
    </div>
  );
}

