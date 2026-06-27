import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContentChartCard } from "@/components/admin/dashboard/ContentChartCard";
import { KpiCard } from "@/components/admin/dashboard/KpiCard";
import { ShortcutCard } from "@/components/admin/dashboard/ShortcutCard";
import { StatLegendCard } from "@/components/admin/dashboard/StatLegendCard";
import {
  buildChartData,
  buildKpiCards,
  buildLegendItems,
  DASHBOARD_SHORTCUTS,
  getDashboardSnapshot,
  SECONDARY_SHORTCUTS,
} from "@/lib/admin/dashboard-data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const snapshot = await getDashboardSnapshot();
  const chartData = buildChartData(snapshot);
  const kpiCards = buildKpiCards(snapshot);
  const legendItems = buildLegendItems(snapshot);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Ringkasan performa CMS dan akses cepat ke modul konten portfolio."
      />

      {snapshot.guestbookPending > 0 ? (
        <div className="rounded-[var(--admin-radius)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {snapshot.guestbookPending} guestbook message
          {snapshot.guestbookPending > 1 ? "s" : ""} menunggu moderasi.{" "}
          <Link href="/admin/dashboard/guestbook" className="font-medium underline">
            Review now
          </Link>
        </div>
      ) : null}

      <section aria-label="Quick shortcuts">
        <div className="admin-shortcut-scroll lg:grid lg:grid-cols-4 lg:gap-4">
          {DASHBOARD_SHORTCUTS.map((item) => (
            <ShortcutCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-12" aria-label="Content analytics">
        <div className="lg:col-span-8">
          <ContentChartCard data={chartData} />
        </div>
        <div className="lg:col-span-4">
          <StatLegendCard items={legendItems} />
        </div>
      </section>

      <section aria-label="KPI cards">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((item) => (
            <KpiCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section aria-label="More modules">
        <div className="grid gap-4 sm:grid-cols-2">
          {SECONDARY_SHORTCUTS.map((item) => (
            <ShortcutCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
